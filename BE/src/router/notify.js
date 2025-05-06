const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Reports = require('../app/models/Reports');
const Transactions = require('../app/models/Transactions');
const Budgets = require('../app/models/Budgets');
const notifyController = require('../app/controllers/notifyController');

// Tạo báo cáo
route.post('/create', notifyController.create);
route.post('/update', notifyController.updateRead);
// Lấy tất cả báo cáo hiện có ra xem
route.post('/getall', notifyController.getAll);
//đọc tất cả
route.post('/readall', notifyController.readAll);
// xóa tất cả
route.post('/deleteall', notifyController.deleteAll);


module.exports = route;