import express from 'express';
import { uploadMiddleware, uploadBufferToGridFS } from '../services/Storage.js';
import DocumentModel from '../models/Document.js';
import mongoose from 'mongoose';
import type { AuthRequest } from '../middleware/auth.js';
const router = express.Router();



import { processDocumentOCR } from '../workers/ocrWorkers.js';

router.post('/', uploadMiddleware.single('file'), async (req: AuthRequest, res) => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ error: 'file missing' });
    if (!req.user?.id) return res.status(401).json({ error: 'unauthorized' });

    const generatedFileId = await uploadBufferToGridFS(
      file.buffer,
      `${Date.now()}-${file.originalname}`,
      file.mimetype
    );


    const doc = await DocumentModel.create({
      userId: new mongoose.Types.ObjectId(req.user.id),
      originalFilename: file.originalname,
      gridFsId: generatedFileId,
      mimeType: file.mimetype, 
      createdAt: new Date(),
    });

    
    processDocumentOCR(doc?._id?.toString() ?? '')
      .then(() => console.log(`OCR completed for doc ${doc._id}`))
      .catch(err => console.error("OCR failed:", err));

    return res.json({ docId: doc._id, fileId: generatedFileId });
  } catch (err) {
    console.error("upload error:", err);
    res.status(500).json({ error: 'upload failed' });
  }
});



export default router;
