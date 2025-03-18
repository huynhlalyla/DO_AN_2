const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');
const Categories = require('../app/models/Categories');
const Budgets = require('../app/models/Budgets');
const Transactions = require('../app/models/Transactions');


// Thêm danh mục
    route.get('/add', (req, res) => {
        const data = {
            name: "mua vang",
            user_id: "67d908ef4abdd3937e27b62f",
            type: "expense"
            
        }
        const category = new Categories(data);
        category.save()
        .then(category => {
            Users.findById(category.user_id)
            .then(user => {
                user.created_categories.push(category._id);
                user.save();
            })
        })    
        res.redirect('/');
    })

module.exports = route;