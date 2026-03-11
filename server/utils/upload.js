import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  console.log('✅ Cloudinary storage activated for uploads.');
} else {
  console.log('⚠️ Cloudinary keys missing. Falling back to local disk storage.');
}

// Create local uploads directory as fallback
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage always - we handle saving ourselves
const storage = multer.memoryStorage();

// File filter - explicitly allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimetypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
  ];
  if (allowedMimetypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

/**
 * After multer processes the file into memory (req.file.buffer),
 * call this helper to upload it to Cloudinary or save it locally.
 * Returns the public URL string.
 */
export const saveFile = (fileBuffer, mimetype, fieldname, options = {}) => {
  return new Promise((resolve, reject) => {
    if (useCloudinary) {
      // Upload to Cloudinary via stream
      const resourceType = mimetype === 'application/pdf' ? 'raw' : 'image';
      
      const uploadOptions = {
        folder: 'tisk_school',
        resource_type: resourceType,
        public_id: fieldname + '-' + Date.now(),
        ...options
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      const readable = new Readable();
      readable.push(fileBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    } else {
      // Save to local disk
      const subDir = mimetype === 'application/pdf' ? 'tc' : 'general';
      const localDir = path.join(uploadDir, subDir);
      if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
      const ext = mimetype === 'application/pdf' ? '.pdf' : '.jpg';
      const filename = fieldname + '-' + Date.now() + ext;
      const filePath = path.join(localDir, filename);
      fs.writeFileSync(filePath, fileBuffer);
      resolve(`uploads/${subDir}/${filename}`);
    }
  });
};
