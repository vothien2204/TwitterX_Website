import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import mongoose from "mongoose";

// Thêm bình luận mới
export const addComment = async (req, res) => {
    try {
        const { userId, postId, text } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !postId || !text) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Kiểm tra bài post tồn tại
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Tạo bình luận mới
        const newComment = new Comment({
            userId,
            postId,
            text,
        });

        await newComment.save();

        // Thêm ID bình luận vào mảng `comments` trong bài post
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json({ message: "Comment added successfully!", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Lấy tất cả bình luận của một bài post
export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Kiểm tra bài post tồn tại
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Lấy danh sách bình luận của bài post
        const comments = await Comment.find({ postId })

        res.status(200).json({ message: "Comments retrieved successfully!", data: comments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Xóa bình luận
export const deleteComment = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "No such comment" });
    }
    try {
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });    
    }
};
