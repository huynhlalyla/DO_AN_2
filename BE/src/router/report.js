const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Reports = require('../app/models/Reports');
const Transactions = require('../app/models/Transactions');
const Budgets = require('../app/models/Budgets');
const reportController = require('../app/controllers/reportController');

// Tạo báo cáo
route.post('/create', reportController.createReport);
route.get('/create', reportController.createReport);

// Lấy tất cả báo cáo hiện có ra xem
route.get('/view-all', reportController.viewAllReports);



module.exports = route;