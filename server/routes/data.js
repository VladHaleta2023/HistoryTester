import { Router } from "express";
import { addData, getDatas, getData, uploadImageData, deleteImageData, updateData, deleteData } from "../controllers/data.js";
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

router.post('/:testId/data/', checkAuth, upload.array('images'), addData);

router.get('/:testId/data/', checkAuth, getDatas);

router.put('/:testId/data/:dataId/images/:imageId/', checkAuth, upload.single('image'), uploadImageData);

router.delete('/:testId/data/:dataId/images/:imageId/', checkAuth, deleteImageData);

router.get('/:testId/data/:dataId/', checkAuth, getData);

router.put('/:testId/data/:dataId/', checkAuth, upload.array('images'), updateData);

router.delete('/:testId/data/:dataId/', checkAuth, deleteData);

export default router;