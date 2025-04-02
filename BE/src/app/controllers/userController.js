const Users = require('../models/Users');

// Thêm người dùng (Test)
const addUser = async (req, res) => {
    try {
        const data = {
            name: 'Ly Ly',
            password: '1191',
            email: 'll@gmail.com',
            phone: '0965356321',
        };
        const user = new Users(data);
        await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Xác thực người dùng
//POST /users/authenticate

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

// Đăng ký người dùng
const registerUser = async (req, res) => {
    console.log(req.body);
    try {
        const { name, phone, email, password } = req.body;

        // Kiểm tra số điện thoại đã tồn tại chưa
        const existingPhone = await Users.findOne({ phone });
        if (existingPhone) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await Users.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email đã được sử dụng' });

        // Lưu người dùng mới mà không mã hóa mật khẩu
        const newUser = new Users({ name, phone, email, password });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
};


const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Tìm người dùng theo số điện thoại
        const user = await Users.findOne({ phone });
        if (!user) return res.status(400).json({ success: false, message: 'Số điện thoại không tồn tại' });

        // So sánh mật khẩu trực tiếp (không mã hóa)
        if (password !== user.password) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
        }

        // Trả về JSON chứa URL để FE tự động điều hướng
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            user: { id: user._id, phone: user.phone, name: user.name },
            redirectUrl: '/DO_AN_2/FE/statistical.html' // FE sẽ dùng URL này để chuyển hướng
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error });
    }
};


module.exports = {
    addUser,
    authenticateUser, 
    registerUser, 
    loginUser 
};