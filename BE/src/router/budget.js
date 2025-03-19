const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Budgets = require('../app/models/Budgets');
const Transactions = require('../app/models/Transactions');
const budgetController = require('../app/controllers/budgetController');

// Thêm ngân sách
route.get('/add', budgetController.addBudget)

// Lấy tất cả ngân sách hiện có ra xem
route.get('/view-all', budgetController.viewAllBudgets)

module.exports = route;