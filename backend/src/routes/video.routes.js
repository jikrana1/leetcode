import express from 'express'
import { isAdminMiddleware } from '../middleware/adminAuth.middleware.js';
import { deleteVideo, generateUploadSignature, saveVideoMetadata } from '../controllers/video.controller.js';

const router = express.Router();

router.get("/create/:problemId", isAdminMiddleware, generateUploadSignature);
router.post("/save", isAdminMiddleware, saveVideoMetadata);
router.delete("/delete/:videoId", isAdminMiddleware, deleteVideo);

export default router;