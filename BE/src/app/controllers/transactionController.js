const Transactions = require('../models/Transactions');
const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Budgets = require('../models/Budgets');


// GET /transactions/add
async function addTransaction(req, res) {
    const data = {
        name: 'Bán 5 phân vàng',
        amount: '5500000', 
        type: 'income',
        category_id: '67f14cad568caacd62bb369a',
        date: '2025-03-20',
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
        if(transaction.type === 'expense') {
            await Budgets.findOne({category_id: transaction.category_id})
            .then(async budget => {
                budget.transactions.push(transaction._id);
                await budget.save();
            })
        }
        
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