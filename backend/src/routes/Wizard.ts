import express from 'express';
import Joi from 'joi';
import { callGemini } from '../services/llm.js';
import DocumentModel from '../models/Document.js';
import ConversationModel from '../models/Conversation.js';
import mongoose from 'mongoose';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
      const { conversationId, userId, message, mode = "standard" } = req.body;
      let conv = conversationId ? await ConversationModel.findById(conversationId) : null;

      if (!conv) {
          conv = await ConversationModel.create({ userId, messages: [] });
      }

      
      conv.messages.push({ role: "user", text: message, timestamp: new Date() });
      await conv.save();

      const WizardSystemPrompt = `
You are Nyaya Wizard — a step-by-step legal guide for Indian users.
Your job: understand the user's problem, ask for exactly what's missing, request documents only if needed, and give the next 1–2 actions. Be concise and friendly.

Rules
- Be brief. No long paragraphs. Max ~90 words total.
- Use short bullets (≤14 words each). 5 bullets max.
- One follow-up question per turn. End with: "Q: <your single question>"
- If info is incomplete, ask for the *one* most useful missing detail.
- If ~60% info is present, state a careful assumption and confirm it: “Assumption: … — am I right?”
- If documents would materially change advice, ask for them: 
  “Please upload via Nyaya’s document upload in the Wizard.”
- If user asks for story mode or doc upload explicitly, keep them in Wizard and guide them.
- Avoid legal jargon unless asked. Never hallucinate statutes. If unsure, say so and ask precisely.
- Do not repeat prior information; only move the conversation forward.

Output format (use these headings exactly; keep each line short):
1) Understanding: <one-line summary>
2) What I need (if any): - <bullet(s) or “None”>
3) Next steps: - <1–2 bullets>
4) Q: <single targeted question>
`;



      const systemPrompt =WizardSystemPrompt;


      const prompt = `User message: ${message}\n\nConversation summary: ${conv.contextSummary || ""}`;


      const llmResp = await callGemini(prompt, systemPrompt);


      const assistantText =
          llmResp.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "⚠️ No response from model";

     
      conv.messages.push({ role: "assistant", text: assistantText, timestamp: new Date() });
      await conv.save();

      res.json({ conversationId: conv._id, reply: assistantText });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "chat failed" });
  }
});

function analyzeDocumentNeeds(message: string): string[] {
  const neededDocs: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('eviction') || lowerMessage.includes('lease') || lowerMessage.includes('rent')) {
    neededDocs.push('lease agreement', 'eviction notice', 'rental agreement');
  }
  if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
    neededDocs.push('contract', 'agreement document');
  }
  if (lowerMessage.includes('court') || lowerMessage.includes('legal') || lowerMessage.includes('case')) {
    neededDocs.push('legal documents', 'court filings', 'case documents');
  }
  if (lowerMessage.includes('property') || lowerMessage.includes('real estate')) {
    neededDocs.push('property documents', 'deed', 'title documents');
  }
  
  return neededDocs;
}


function formatDocumentContext(documents: any[]): string {
  if (documents.length === 0) {
    return "No documents available for reference.";
  }
  
  const docContexts = documents.map(doc => {
    const summary = doc.text ? `Content: ${doc.text.substring(0, 500)}...` : "No text content available";
    return `Document: ${doc.originalFilename}\n${summary}`;
  });
  
  return docContexts.join('\n\n');
}


router.post('/wizard', async (req: AuthRequest, res) => {
  try {
    const { conversationId, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }
    
    if (!req.user?.id) {
      return res.status(401).json({ error: 'unauthorized' });
    }


    let conv = conversationId ? await ConversationModel.findById(conversationId) : null;
    if (!conv) {
      conv = await ConversationModel.create({ 
        userId: new mongoose.Types.ObjectId(req.user.id), 
        messages: [] 
      });
    }

   
    conv.messages.push({ role: "user", text: message, timestamp: new Date() });
    await conv.save();

    const userDocuments = await DocumentModel.find({
      userId: new mongoose.Types.ObjectId(req.user.id)
    }).sort({ createdAt: -1 }).limit(10); 

    
    const neededDocTypes = analyzeDocumentNeeds(message);
    

    const hasRelevantDocs = userDocuments.length > 0;
    const missingDocs = hasRelevantDocs ? [] : neededDocTypes;

    const systemPrompt = `
You are Nyaya Wizard — a step-by-step legal guide for Indian users.
Your job: understand the user's problem, ask for exactly what's missing, request documents only if needed, and give the next 1–2 actions. Be concise and friendly.

Context:
- User's uploaded documents: ${formatDocumentContext(userDocuments)}
- Document analysis: ${hasRelevantDocs ? 'User has uploaded documents that may be relevant to this request.' : 'No relevant documents found in user\'s uploads.'}
- Conversation history: ${conv.contextSummary || 'No previous context'}

Rules
- Be brief. No long paragraphs. Max ~90 words total.
- Use short bullets (≤14 words each). 5 bullets max.
- One follow-up question per turn. End with: "Q: <your single question>"
- If info is incomplete, ask for the *one* most useful missing detail.
- If ~60% info is present, state a careful assumption and confirm it: "Assumption: … — am I right?"
- If documents would materially change advice, ask for them: 
  "Please upload via Nyaya's document upload in the Wizard."
- If user asks for story mode or doc upload explicitly, keep them in Wizard and guide them.
- Avoid legal jargon unless asked. Never hallucinate statutes. If unsure, say so and ask precisely.
- Do not repeat prior information; only move the conversation forward.
- Use information from uploaded documents when relevant to provide accurate legal advice.

${missingDocs.length > 0 ? `Missing documents that would be helpful: ${missingDocs.join(', ')}` : ''}

Output format (use these headings exactly; keep each line short):
1) Understanding: <one-line summary>
2) What I need (if any): - <bullet(s) or "None">
3) Next steps: - <1–2 bullets>
4) Q: <single targeted question>
`;

    const llmResp = await callGemini(message, systemPrompt);

    const assistantText =
      llmResp.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "⚠️ No response from model";

      conv.messages.push({ role: "assistant", text: assistantText, timestamp: new Date() });
    await conv.save();

    res.json({ 
      conversationId: conv._id,
      reply: assistantText,
      hasDocuments: hasRelevantDocs,
      documentCount: userDocuments.length,
      missingDocuments: missingDocs
    });
    
  } catch (err) {
    console.error('Wizard error:', err);
    res.status(500).json({ error: 'wizard failed' });
  }
});

router.get('/documents', async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const documents = await DocumentModel.find({
      userId: new mongoose.Types.ObjectId(req.user.id)
    })
    .select('originalFilename mimeType createdAt text')
    .sort({ createdAt: -1 });

    res.json({ 
      documents: documents.map(doc => ({
        id: doc._id,
        filename: doc.originalFilename,
        type: doc.mimeType,
        uploadedAt: doc.createdAt,
        hasText: !!doc.text
      }))
    });
    
  } catch (err) {
    console.error('Document fetch error:', err);
    res.status(500).json({ error: 'failed to fetch documents' });
  }
});

router.get('/conversation/:conversationId', async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const conversation = await ConversationModel.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'conversation not found' });
    }

    if (conversation.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'unauthorized' });
    }

    res.json({ conversation });
    
  } catch (err) {
    console.error('Conversation fetch error:', err);
    res.status(500).json({ error: 'failed to fetch conversation' });
  }
});

router.get('/conversations', async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const conversations = await ConversationModel.find({
      userId: new mongoose.Types.ObjectId(req.user.id)
    })
    .select('_id contextSummary createdAt')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({ conversations });
    
  } catch (err) {
    console.error('Conversations fetch error:', err);
    res.status(500).json({ error: 'failed to fetch conversations' });
  }
});

export default router;
