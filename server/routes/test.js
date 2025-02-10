import { Router } from "express";
import { addTest, getTests, getTest, deleteImage, updateTest, deleteTest, changeTestStatus } from "../controllers/test.js";
import { checkAuth } from "../middleware/checkAuth.js";
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const userId = req.userId;
        const fileExtension = path.extname(file.originalname);
        const timestamp = Date.now();
        const fileName = `${userId}_${timestamp}${fileExtension}`;
        cb(null, fileName);
    },
});
*/

cloudinary.config({
  cloud_name: 'dp1yp82xe',
  api_key: '561468265722954',
  api_secret: 'BzJqZIREIjhMvb6Y5qX-H6hWdEM'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    public_id: (req, file) => {
      const userId = req.userId;
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}${fileExtension}`;
      return fileName;
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
});

const router = new Router();

router.post('/', checkAuth, upload.single('image'), addTest);

router.get('/', checkAuth, getTests);

router.get('/:testId', checkAuth, getTest);

router.put('/:testId/status', checkAuth, upload.none(), changeTestStatus);

router.delete('/:testId/image', checkAuth, deleteImage);

router.put('/:testId', checkAuth, upload.single('image'), updateTest);

router.delete('/:testId', checkAuth, deleteTest);

export default router;