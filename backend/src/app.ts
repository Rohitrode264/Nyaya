import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import uploadRoutes from './routes/Upload.js';
import chatRoutes from './routes/Chat.js';
import wizardRoutes from './routes/Wizard.js';
import authRoutes from './routes/Auth.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();
const app = express();
app.use(express.json());
const h=process.env.MONGO_URI;
console.log(h);
await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get('/',(req,res)=>{
    res.send('Nyaya Backend is running');
});
app.use('/api/auth',authRoutes);
app.use('/api/upload',authMiddleware, uploadRoutes);
app.use('/api/chat',authMiddleware, chatRoutes);
app.use('/api/wizard',authMiddleware, wizardRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log('Server started on', process.env.PORT || 4000);
});
