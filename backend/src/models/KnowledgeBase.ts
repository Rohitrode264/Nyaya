import mongoose, { Schema, Document } from 'mongoose';

export interface IKB extends Document {
    title: string;
    jurisdiction: string;
    text: string;
    sourceUrl?: string;
    tags?: string[];
    embeddingId?: string;
    createdAt: Date;
}

const KBSchema = new Schema<IKB>({
    title: String,
    jurisdiction: String,
    text: String,
    sourceUrl: String,
    tags: [String],
    embeddingId: String,
    createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.model<IKB>('KnowledgeBase', KBSchema);
