import mongoose, { Schema, Document } from 'mongoose';

export interface IDoc extends Document {
    userId: mongoose.Types.ObjectId;
    caseId?: mongoose.Types.ObjectId;
    originalFilename: string;
    gridFsId?: mongoose.Types.ObjectId | string;
    mimeType?: string; // Add MIME type field
    text?: string; // OCR result
    summary?: string;
    createdAt: Date;
}

const DocumentSchema = new Schema<IDoc>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: false },
    originalFilename: String,
    gridFsId: Schema.Types.Mixed,
    mimeType: String, // Add MIME type field
    text: String,
    summary: String,
    createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.model<IDoc>('Document', DocumentSchema);
