const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Budgets = require('../app/models/Budgets');
const Transactions = require('../app/models/Transactions');

const categoryController = require('../app/controllers/categoryController');
// Thêm danh mục
route.post('/add', categoryController.addCategory);
// Lấy tất cả danh mục hiện có ra xem
route.get('/view-all', categoryController.viewAllCategories);
//get all categories
route.post('/getall', categoryController.getAll);
route.get('/:id', categoryController.getCategoryById);
route.put('/update/:id', categoryController.updateCategory);
route.delete('/delete/:id', categoryController.deleteCategory);

module.exports = route;