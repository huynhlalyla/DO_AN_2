const Budgets = require('../models/Budgets');
const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Transactions = require('../models/Transactions');


// GET /budget/add
async function addBudget(req, res) {
    const data = {
        limit_amount: '100000000',
        start_date: '2025-03-01',
        end_date: '2025-04-01',
        user_id: '67d908ef4abdd3937e27b62f',
        category_id: '67d98e61a56b08c003098b83',
        
    }
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