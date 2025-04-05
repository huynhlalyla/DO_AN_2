const Categories = require('../models/Categories');
const Users = require('../models/Users');


//GET: /category/add
async function addCategory(req, res) {
    try {
        //lấy dữ liệu từ người dùng gửi lên
        // const data = req.body;
        const data = {
            name: 'Bán vàng',
            type: 'income',
            user_id: '67d908ef4abdd3937e27b62f'
        }
        //kiểm tra xem category đã tồn tại chưa
        
        const allCategories = await Categories.find({user_id: data.user_id});
        const category = allCategories.find(category => category.name === data.name);
        //nếu đã tồn tại thì trả về thông báo lỗi
        if(category) {
            return res.status(400).json({message: "Category already exists"});
        } else {
            //nếu chưa tồn tại thì tạo mới
            const category = new Categories(data);
            category.save()
            .then(category => {
                Users.findById(category.user_id)
                .then(user => {
                    user.created_categories.push(category._id);
                    user.save();
                })
            })    
            res.redirect('/');
        }
    } catch (error) {
        //nếu việc đó lỗi chạy ở đây
        res.status(500).json({message: 'Lỗi server:', error});
    }

    
    
}


//GET: /category/view-all
async function viewAllCategories(req, res) {
    const user_id = "67d9093ac31624c45abf001d";
    Categories.find({user_id: user_id})
    .then(categories => {
        res.json(categories)
    })
}

module.exports = {
    addCategory,
    viewAllCategories
}
