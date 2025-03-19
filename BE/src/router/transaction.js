const express = require('express');
const route = express.Router();
const Transactions = require('../app/models/Transactions');
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Budgets = require('../app/models/Budgets');
const transactionController = require('../app/controllers/transactionController');



// Thêm giao dịch
route.get('/add', transactionController.addTransaction)

// Lấy tất cả giao dịch hiện có ra xem
route.get('/view-all', transactionController.viewAllTransactions)


module.exports = route;