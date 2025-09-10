import express from "express";
import ConversationModel from "../models/Conversation.js";
import { callGemini } from "../services/llm.js";
import { SystemPrompt } from "../utils/prompt.js";
import Chat from "../models/Chat.js";

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

        const systemPrompt =SystemPrompt;


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


router.post('/new',async(req,res)=>{
    const {userId}=req.body;
    const chat=await Chat.create({userId,meesages:[]});
    res.json(chat);
})
export default router;
