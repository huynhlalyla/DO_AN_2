const express = require('express');
const route = express.Router();
const Transactions = require('../app/models/Transactions');
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Budgets = require('../app/models/Budgets');



// Thêm giao dịch
route.get('/add', async (req, res) => {
    const data = {
        name: 'Quà sinh nhật',
        amount: '15000',
        type: 'expense',
        category_id: '67d9408bea0c5bb824ed4e4a',
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
})

// Lấy tất cả giao dịch hiện có ra xem
route.get('/view-all', async (req, res, next) => {
//     const transactions = await Transactions.find({})
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
})


module.exports = route;