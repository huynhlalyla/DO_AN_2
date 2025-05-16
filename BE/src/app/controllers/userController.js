const Users = require('../models/Users');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
const checkUser = async (req, res) => {
    try {
        const {user_id} = req.body;
        const user = await Users.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'failed' });
        }
        return res.status(200).json({ message: 'success', user });
    } catch
        (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
}
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
            redirectUrl: '/FE/statistical.html' // FE sẽ dùng URL này để chuyển hướng
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error });
    }
};
async function sendEmail(to, subject, htmlContent) {
    try {
        // Cấu hình SMTP
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Hoặc SMTP khác như Outlook, Yahoo
            auth: {
                user: 'quanlychitieuqha20252025@gmail.com', // Email của bạn
                pass: 'gqjn yexr hent qine'  // Mật khẩu ứng dụng (App Password)
            }
        });

        // Nội dung email
        const mailOptions = {
            from: 'quanlychitieuqha20252025@gmail.com', // Email gửi
            to, // Email nhận
            subject,
            html: htmlContent // Nội dung
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
async function createTokenResetpassword(req, res) {
    try {
        const { email } = req.body;
        console.log(email);
        const token = crypto.randomBytes(2).toString('hex').toUpperCase(); // Tạo mã OTP ngẫu nhiên 4 ký tự
        const expires = Date.now() + 120000; // 2 phút
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }
        const updatedUser = await Users.findOneAndUpdate({ email }, { resetPasswordToken: token, resetPasswordExpires: expires }, { new: true });
        if (!updatedUser) {
            return res.status(500).json({ message: 'Cập nhật mã OTP thất bại' });
        }
        // Gửi email chứa mã OTP
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Đặt lại mật khẩu</h2>
                <p>Xin chào,</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Dưới đây là mã OTP để xác nhận:</p>
                <div style="font-size: 20px; font-weight: bold; color: #4CAF50; margin: 10px 0;">
                    ${token}
                </div>
                <p><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 2 phút.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">Đây là email tự động, vui lòng không trả lời.</p>
            </div>
        `;
        await sendEmail(email, 'Mã OTP Đặt lại mật khẩu', htmlContent);
        return res.status(200).json({ message: 'success', expires });
    }
    catch (error) {
        res.status(500).json({ message: 'Tạo OTP thất bại', error });
    }
}
async function verifyToken(req, res) {
    try {
        const { email, token } = req.body;
        // console.table(email, token);
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }
        if (user.resetPasswordToken !== token) {
            return res.status(400).json({ message: 'Mã OTP không chính xác' });
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Mã OTP đã hết hạn' });
        }
        return res.status(200).json({ message: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: 'Xác thực mã OTP thất bại', error });
    }
}
async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Phiên làm mới đã hết hạn' });
        }
        await Users.findOneAndUpdate({ email }, { password: newPassword, resetPasswordToken: null, resetPasswordExpires: null }, { new: true })
        return res.status(200).json({ message: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: 'Đặt lại mật khẩu thất bại', error });
    }
}
async function updateUser(req, res) {
    try {
        const {userId, newName, newEmail, newPhone} = req.body;
        const user = await Users.findByIdAndUpdate(userId, {name: newName, email: newEmail, phone: newPhone}, {new: true});
        if (!user) {
            return res.status(404).json({ message: 'Có lỗi trong việc xác nhận người dùng!' });
        }
        return res.status(200).json({ message: 'Cập nhật thành công', user });
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi trong việc cập nhật người dùng!', error: err });
    }
}

async function getUser(req, res) {
    try {
        const { userId } = req.body;
        const user = await Users.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        return res.status(200).json({ message: 'success', user });
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi trong việc lấy thông tin người dùng!', error: err });
    }
}

async function changePassword(req, res) {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }
        if (user.password !== currentPassword) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
        }
        const updatedUser = await Users.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
        if (!updatedUser) {
            return res.status(500).json({ message: 'Có lỗi trong việc cập nhật mật khẩu!' });
        }
        return res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi trong việc đổi mật khẩu!', error: err });
    }
}


module.exports = {
    addUser,
    authenticateUser, 
    registerUser, 
    loginUser,
    createTokenResetpassword,
    verifyToken,
    resetPassword,
    updateUser,
    getUser,
    changePassword,
    checkUser
};