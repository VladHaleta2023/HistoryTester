import { Router } from "express";
import { addData, getDatas, getData, uploadImageData, deleteImageData, updateData, deleteData } from "../controllers/data.js";
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

router.post('/:testId/data/', checkAuth, upload.array('images'), addData);

router.get('/:testId/data/', checkAuth, getDatas);

router.put('/:testId/data/:dataId/images/:imageId/', checkAuth, upload.single('image'), uploadImageData);

router.delete('/:testId/data/:dataId/images/:imageId/', checkAuth, deleteImageData);

router.get('/:testId/data/:dataId/', checkAuth, getData);

router.put('/:testId/data/:dataId/', checkAuth, upload.array('images'), updateData);

router.delete('/:testId/data/:dataId/', checkAuth, deleteData);

export default router;