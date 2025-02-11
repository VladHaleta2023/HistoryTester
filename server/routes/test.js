import { Router } from "express";
import { addTest, getTests, getTest, deleteImage, updateTest, deleteTest, changeTestStatus } from "../controllers/test.js";
import { checkAuth } from "../middleware/checkAuth.js";
import multer from "multer";

const storage = multer.memoryStorage();

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