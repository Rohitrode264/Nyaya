import express from "express";
import ConversationModel from "../models/Conversation.js";
import { callGemini } from "../services/llm.js";
import { SystemPrompt } from "../utils/prompt.js";
import Chat from "../models/Chat.js";
import { WizardSystemPrompt } from "../utils/wizardPrompt.js";

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

    const systemPrompt = WizardSystemPrompt;

    const conversationHistoryText = conv.messages
      .map(m => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n");

    const prompt = `${conversationHistoryText}\n\nUSER: ${message}`;

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



router.post('/new',async(req,res)=>{
    const {userId}=req.body;
    const chat=await Chat.create({userId,meesages:[]});
    res.json(chat);
})
export default router;
