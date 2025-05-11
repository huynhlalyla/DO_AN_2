const Categories = require('../models/Categories');
const Users = require('../models/Users');
const Budgets = require('../models/Budgets');
const Transactions = require('../models/Transactions');


//GET: /category/add
async function addCategory(req, res) {
    try {
        const { name, type, limit_amount, start_date, end_date, user_id } = req.body;
        // Kiểm tra xem category đã tồn tại chưa
        const allCategories = await Categories.find({ user_id: user_id });
        const existingCategory = allCategories.find(category => category.name === name);
        if (existingCategory) {
            return res.status(400).json({ message: "Danh mục đã tồn tại" });
        }

        //tạo một budget mới với thông tin từ request body
        const budgetData = {
            user_id: user_id,// Lấy ID từ category vừa tạo
            start_date: start_date,
            end_date: end_date,
            limit_amount: limit_amount,
        };
        const newBudget = new Budgets(budgetData);
        await newBudget.save(); // Lưu budget


        // Tạo mới category
        const categoryData = {
            name: name,
            type: type,
            user_id: user_id,
            budget_id: newBudget._id, // Lấy ID từ budget vừa tạo
        };
        const newCategory = new Categories(categoryData);
        const savedCategory = await newCategory.save(); // Lưu category trước



        // Cập nhật user với category mới
        const user = await Users.findById(user_id);
        if (user) {
            user.created_categories.push(savedCategory._id);
            await user.save();
        }
        //thêm budget vào user
        await Users.findByIdAndUpdate(user_id, {
            $push: { created_budgets: newBudget._id }
        });

        return res.status(200).json({ message: "success", category: savedCategory });
    } catch (error) {
        // Xử lý lỗi
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", error });
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

//POST: /category/getall
async function getAll(req, res) {
    const user_id = req.body.user_id;
    try {
        const categories = await Categories.find({user_id: user_id}).populate('budget_id');
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving categories', error });
    }
}

//cái này dời qua Budget có vẻ hợp lý hơn - làm biến dời rồi
//GET: /category/:id
async function getCategoryById(req, res) {
    const categoryId = req.params.id;
    try {
        // const category = await Categories.findById(categoryId);
        const budget = await Categories.findById(categoryId).populate('budget_id');
        return res.status(200).json(budget);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving category', error });
    }
}

async function updateCategory(req, res) {
    const categoryId = req.params.id;
    const { name, type, limit_amount, start_date, end_date } = req.body;
    try {
        const updatedCategory = await Categories.findByIdAndUpdate(categoryId, { name, type }, { new: true });
        await Budgets.findByIdAndUpdate(updatedCategory.budget_id, { limit_amount, start_date: new Date(start_date), end_date: new Date(end_date) }, { new: true });
        return res.status(200).json({ message: 'success', category: updatedCategory });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating category', error });
    }
}

async function deleteCategory(req, res) {
    const categoryId = req.params.id;
    try {
        // Xóa category
        const deletedCategory = await Categories.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Xóa budget liên quan
        await Budgets.findByIdAndDelete(deletedCategory.budget_id);
        // Xóa tất cả các giao dịch liên quan đến danh mục
        await Transactions.deleteMany({ category_id: deletedCategory._id });

        await Users.findByIdAndUpdate(deletedCategory.user_id, {
            $pull: {
                created_categories: deletedCategory._id, // Xóa category khỏi danh sách created_categories
                created_budgets: deletedCategory.budget_id, // Xóa budget khỏi danh sách created_budgets
                created_transactions: { category_id: deletedCategory._id } // Xóa tất cả giao dịch liên quan đến category
            }
        });
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting category', error });
    }
}

module.exports = {
    addCategory,
    viewAllCategories,
    getAll,
    getCategoryById,
    updateCategory,
    deleteCategory
}
