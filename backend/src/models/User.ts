import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email?: string;
    phone?: string;
    passwordHash?: string;
    role: 'user' | 'volunteer' | 'admin';
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: String,
    email: { type: String, index: true, unique: false, sparse: true },
    phone: { type: String, index: true, sparse: true },
    passwordHash: String,
    role: { type: String, enum: ['user', 'volunteer', 'admin'], default: 'user' },
    createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.model<IUser>('User', UserSchema);
