const Budgets = require('../models/Budgets');
const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Transactions = require('../models/Transactions');


// GET /budget/add
async function addBudget(req, res) {
    try {
        // Lấy dữ liệu từ người dùng gửi lên
        const data = req.body;
        // Kiểm tra xem budget đã tồn tại chưa
        const allBudgets = await Budgets.find({user_id: data.user_id});
        const budget = allBudgets.find(budget => budget.name === data.name);
        // Nếu đã tồn tại thì trả về thông báo lỗi
        if(budget) {
            return res.status(400).json({message: "Budget already exists"});
        } else {
            // Nếu chưa tồn tại thì tạo mới
            const budget = new Budgets(data);
            await budget.save()
            .then(async budget => {
                await Users.findByIdAndUpdate(budget.user_id, {
                    $push: {created_budgets: budget._id}
                })
                await Categories.findByIdAndUpdate(budget.category_id, {
                    budget_id: budget._id
                })

            })
            res.redirect('/');
        }
    } catch (error) {
        // Nếu việc đó lỗi chạy ở đây
        res.status(500).json({message: 'Lỗi server:', error});
    }
    
    
}

// GET /budget/view-all
async function viewAllBudgets(req, res) {
    Budgets.find({})
    .populate('user_id')
    .populate('category_id')
    .then(budgets => {
        res.json(budgets)
    })
}


module.exports = {
    addBudget,
    viewAllBudgets
}