const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Budgets = require('../app/models/Budgets');
const Transactions = require('../app/models/Transactions');
// Thêm ngân sách
route.get('/add', async (req, res) => {
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
})

module.exports = route;