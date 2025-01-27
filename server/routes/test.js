import { Router } from "express";
import { addTest, getTests, getTest, deleteImage, updateTest, deleteTest } from "../controllers/test.js";
import { checkAuth } from "../middleware/checkAuth.js";
import path from "path";
import multer from "multer";

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

const upload = multer({ storage: storage });

const router = new Router();

router.post('/', checkAuth, upload.single('image'), addTest);

router.get('/', checkAuth, getTests);

router.get('/:testId', checkAuth, getTest);

router.delete('/:testId/image', checkAuth, deleteImage);

router.put('/:testId', checkAuth, upload.single('image'), updateTest);

router.delete('/:testId', checkAuth, deleteTest);

export default router;