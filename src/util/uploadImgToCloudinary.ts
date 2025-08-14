import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

// Delete file after upload
const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(
      `Error deleting file: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
};

// Upload to Cloudinary (supports video)
export const uploadToCloudinary = async (filePath: string, folder: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  // Detect if file is video by extension
  const ext = path.extname(filePath).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: isVideo ? 'video' : 'auto', // auto detects images/docs
    });
    await deleteFile(filePath);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('File upload failed');
  }
};

// Multer config
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter - now includes video MIME types
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Video MIME types
    'video/mp4',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv
    'video/webm',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

export const upload = multer({ storage, fileFilter });
