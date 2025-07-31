import express from "express";
import { addComment, deleteComment, getCommentsByPost } from "../controller/comment.controller.js";

const router = express.Router();

// Thêm bình luận mới
router.post("/", addComment);

// Lấy tất cả bình luận của một bài post
router.get("/:postId", getCommentsByPost);

// Xóa bình luận
router.delete("/:id", deleteComment);

export default router;