import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage { role: 'user' | 'assistant' | 'system'; text: string; timestamp: Date }
export interface IConversation extends Document {
    userId: mongoose.Types.ObjectId;
    messages: IMessage[];
    contextSummary?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() }
});

const ConversationSchema = new Schema<IConversation>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: { type: [MessageSchema], default: [] },
    contextSummary: String,
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() }
});

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
