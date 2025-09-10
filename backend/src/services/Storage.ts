import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

export const uploadMiddleware = multer({ storage: multer.memoryStorage() });

export const uploadBufferToGridFS = async (
  buffer: Buffer,
  filename: string,
  contentType?: string
): Promise<mongoose.Types.ObjectId> => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
    bucketName: 'uploads',
  });

  return await new Promise((resolve, reject) => {
    const uploadStream = contentType
      ? bucket.openUploadStream(filename, { contentType })
      : bucket.openUploadStream(filename);

    uploadStream.on('error', (err) => reject(err));
    uploadStream.on('finish', () => resolve(uploadStream.id as mongoose.Types.ObjectId));

    uploadStream.end(buffer);
  });
};

export const getGridFsReadStream = (fileId: mongoose.Types.ObjectId) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
    bucketName: 'uploads',
  });
  return bucket.openDownloadStream(fileId);
};

