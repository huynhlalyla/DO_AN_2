const Transactions = require('../models/Transactions');
const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Budgets = require('../models/Budgets');


// GET /transactions/add
async function addTransaction(req, res) {
    const data = {
        name: '5 phân vàng',
        amount: '4000000',
        type: 'expense',
        category_id: '67d98e61a56b08c003098b83',
        date: Date.now(),
        user_id: '67d908ef4abdd3937e27b62f'
    }
    const transaction = new Transactions(data);
    await transaction.save()
    .then(async transaction => {
        await Users.findByIdAndUpdate(transaction.user_id, {
            $push: {created_transactions: transaction._id}
        })
        await Categories.findByIdAndUpdate(transaction.category_id, {
            $push: {transactions: transaction._id}
        })
        await Budgets.findOne({category_id: transaction.category_id})
        .then(async budget => {
            budget.transactions.push(transaction._id);
            await budget.save();
        })
    })
            res.redirect('/');
}

// GET /transactions/view-all
async function viewAllTransactions(rep, res) {
    //    const transactions = await Transactions.find({})
    //         .populate('user_id')
    //         .populate('category_id')
    //     res.json(transactions)
    
        Transactions.find({})
        .populate('user_id')
        .populate('category_id')
        .then(transactions => {
            // res.send(`Ngân sach: ${budgets.limit_amount} - Của: ${budgets.user_id.name}`)
            res.json(transactions)
        })
} 

module.exports = {
    addTransaction,
    viewAllTransactions
};