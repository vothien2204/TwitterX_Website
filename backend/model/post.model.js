import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        image: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            maxlength: 600
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ] // Mảng các ID bình luận
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
