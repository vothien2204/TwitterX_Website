import express from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controller/post.controller.js";
import { upload, processImage } from '../middleware/upload.js';

const router = express.Router();

// Tạo bài post mới với upload ảnh
router.post("/", upload.single('image'), processImage, createPost);

// Lấy danh sách bài post 
router.get("/", getPosts);

// Cập nhật bài post
router.put("/:id", updatePost);


// Xóa bài post
router.delete("/:id", deletePost);

export default router;
