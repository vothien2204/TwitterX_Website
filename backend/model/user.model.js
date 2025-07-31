import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        maxlength: 150
    },
    isActivated: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
