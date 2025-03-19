const Users = require('../models/Users');

// Thêm người dùng (Test)
const addUser = async (req, res) => {
    try {
        const data = {
            name: 'Hà',
            password: '1111',
            email: 'h@gmail.com',
            phone: '0965342432',
        };
        const user = new Users(data);
        await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Xác thực người dùng
const authenticateUser = async (req, res) => {
    try {
        const data = req.body;
        const user = await Users.findOne({ phone: data.sdt });

        if (user && user.password === data.password) {
            res.json({ message: 'success', user });
        } else {
            res.json({ message: 'fail' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Đăng ký người dùng (Không mã hóa)
const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        // Kiểm tra xem số điện thoại đã tồn tại chưa
        const existingUser = await Users.findOne({ phone });
        if (existingUser) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });

        // Lưu mật khẩu trực tiếp (không mã hóa)
        const newUser = new Users({ name, phone, email, password });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Đăng nhập người dùng (Không mã hóa)
const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await Users.findOne({ phone });
        if (!user) return res.status(400).json({ message: 'Số điện thoại không tồn tại' });

        // So sánh mật khẩu trực tiếp (không giải mã)
        if (password !== user.password) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác' });
        }

        res.status(200).json({ message: 'Đăng nhập thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

module.exports = {
    addUser,
    authenticateUser,
    registerUser,
    loginUser
};
