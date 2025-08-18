// src/util/upload.ts (example – reuse your existing version if you have it)
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

export const upload = multer({
  storage: multer.diskStorage({
    destination: async (_req, _file, cb) => {
      const dir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
    },
  }),
});
