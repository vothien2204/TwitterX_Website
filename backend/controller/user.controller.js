import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import jwt from 'jsonwebtoken';
import { generateToken } from "../middleware/auth.js";
import { sendActivationEmail } from "../middleware/sendEmail.js";


// Regex kiểm tra email hợp lệ
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Kiểm tra định dạng email cơ bản
    return emailRegex.test(email);
};




// Đăng ký người dùng
export const signup = async (req, res) => {
    try {
        const { username, email, password, bio } = req.body;

        // Kiểm tra email hợp lệ
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        // Kiểm tra username không chứa ký tự đặc biệt
        const usernameRegex = /^[a-zA-Z0-9_]+$/; // Username chỉ chứa chữ cái, số và dấu gạch dưới
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: "Username must only contain letters, numbers, and underscores." });
        }

        // Kiểm tra bio không quá 150 ký tự
        if (bio && bio.length > 150) {
            return res.status(400).json({ message: "Bio must not exceed 150 characters." });
        }

        // Kiểm tra nếu email hoặc username đã tồn tại
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists." });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            bio
        });

        await newUser.save();

        const activationToken = generateToken(newUser);
        const activationLink = `http://localhost:5000/api/user/activate/${activationToken}`;
        await sendActivationEmail({ to: email, activationLink });

        res.status(201).json({
            message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Đăng nhập người dùng
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email hợp lệ
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Tìm user theo email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại." });
        }

        if (!user.isActivated) {
            return res.status(403).json({ message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để kích hoạt!" });
        }

        // Kiểm tra mật khẩu
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Mật khẩu không đúng." });
        }

        // Trả về tất cả thông tin người dùng (trừ password)
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        const token = generateToken(user);

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Đăng xuất người dùng
export const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const activateAccount = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_demo');
        const userId = decoded.id;

        // Tìm user và kích hoạt
        const user = await User.findByIdAndUpdate(userId, { isActivated: true }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Tài khoản đã được kích hoạt. Bạn có thể đăng nhập!" });
    } catch (error) {
        res.status(400).json({ message: "Link xác nhận không hợp lệ hoặc đã hết hạn." });
    }
};

export const resendActivationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại!" });
        }

        // Nếu đã active thì khỏi gửi
        if (user.isActivated) {
            return res.status(400).json({ message: "Tài khoản đã được xác thực, không cần gửi lại!" });
        }

        // Tạo lại token xác thực
        const activationToken = generateToken(user);
        const activationLink = `http://localhost:5000/api/user/activate/${activationToken}`;
        await sendActivationEmail({ to: email, activationLink });

        res.status(200).json({ message: "Đã gửi lại email xác thực, vui lòng kiểm tra email!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


// Lấy thông tin người dùng theo ID
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
    try {
        const { username, email, profilePicture, bio } = req.body;
        const userId = req.params.id;

        // Validate email if provided
        if (email && !validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Không động vào password
        let updateData = { username, email, profilePicture, bio };

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
