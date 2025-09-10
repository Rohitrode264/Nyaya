import Tesseract from "tesseract.js";
import DocumentModel from "../models/Document.js";
import { getGridFsReadStream } from "../services/Storage.js";
import { Readable } from "stream";

async function toBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    return "[PDF text extraction failed]";
  }
}

export async function processDocumentOCR(docId: string) {
  const doc = await DocumentModel.findById(docId);
  if (!doc) throw new Error("Doc not found");
  if (!doc.gridFsId) throw new Error("Document is missing gridFsId");

  const rs = getGridFsReadStream(doc.gridFsId as any);
  const buf = await toBuffer(rs as Readable);

  let text = "";

  if (doc.mimeType === "application/pdf") {
    text = await extractPdfText(buf);
  } else {
    const { data } = await Tesseract.recognize(buf, "eng");
    text = data.text;
  }

  doc.text = text;
  await doc.save();

  return text;
}
