import express from "express";
import { login, logout, signup, getAllUsers, updateUser, activateAccount, resendActivationEmail } from "../controller/user.controller.js";


const router = express.Router();

// Đăng ký người dùng mới
router.post("/signup", signup);
// Đăng nhập người dùng
router.post("/login", login);
// Đăng xuất người dùng
router.post("/logout", logout);

router.get('/activate/:token', activateAccount);
router.post("/resend-activation", resendActivationEmail);

// Lấy tất cả người dùng
router.get("/", getAllUsers);
// Lấy người dùng theo id
router.put("/:id", updateUser);


export default router;
