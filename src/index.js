const express = require('express');
const app = express();
const Users = require('./app/models/Users');
const Categories = require('./app/models/Categories')
const Transactions = require('./app/models/Transactions');
const Budgets = require('./app/models/Budgets');
const db = require('./config/dbconfig');
const mongoose = require('mongoose');
const { count } = require('console');
db.connect();


app.get('/', (req, res) => {
    Users.find({}).populate('created_categories', 'name user_id',)
    .populate('created_transactions')
    .then(users => {
        // res.send(`Ngân sach: ${budgets.limit_amount} - Của: ${budgets.user_id.name}`)
        res.json(users)
    })
    // Users.find({})
    // .then(users => {
    //     res.json(users)
    // })
})
app.get('/add-user', (req, res) => {
    const data = {
        name: 'Nguyen Van B',
        password: '24689',
        email: 'b@gmail.com',
        phone: '0987987678',
    }
    const user = new Users(data);
    user.save()
    res.redirect('/');
})
// app.get('/add-category', (req, res) => {
//     const data = {
//         name: "Food",
//         user_id: "67d53d9812e7efe1e290728e",
//     }
//     const category = new Categories(data);
//     category.save()
//     .then(category => {
//         Users.findById(category.user_id)
//         .then(user => {
//             user.created_categories.push(category._id);
//             user.save();
//         })
//     })    
//     res.redirect('/');
// })
// app.get('/add-transaction', (req, res) => {
//     const data = {
//         name: 'Chicken',
//         amount: '200000',
//         type: 'expense',
//         category_id: '67d53dc83bb0ea9cff466dbe',
//         date: Date.now(),
//         user_id: '67d53d9812e7efe1e290728e'
//     }
//     const transaction = new Transactions(data);
//     transaction.save()
//     .then(transaction => {
//         Users.findById(transaction.user_id)
//         .then(user => {
//             user.created_transactions.push(transaction._id);
//             user.save();

//         })
//     })
//             res.redirect('/');


// })

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})