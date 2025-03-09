const express = require('express');
const app = express();
const Users = require('./app/models/Users');
const Budgets = require('./app/models/Budgets');
const db = require('./config/dbconfig');
const mongoose = require('mongoose');
const { count } = require('console');
db.connect();


app.get('/', (req, res) => {
    Budgets.find({}).populate('user_id')
    .then(budgets => {
        // res.send(`Ngân sach: ${budgets.limit_amount} - Của: ${budgets.user_id.name}`)
        res.json(budgets)
    })
    // Users.find({})
    // .then(users => {
    //     res.json(users)
    // })
})
app.get('/add-user', (req, res) => {
    const data = {
        name: 'Nguyen Van A',
        password: '123456',
        email: 'a@gmail.com',
        phone: '0123456789',
    }
    const user = new Users(data);
    user.save()
    res.redirect('/');
})
app.get('/add-budget', (req, res) => {
    const user_id = '67cb1d3a477bf8ff71d5a8fa'; // cai id nay nua dang nhap vao la biet - viet tam
    const data = {
        limit_amount: 2500000,
        period: 1,
        start_date: 2021-10-10,
        end_date: 2021-11-10,
        user_id: user_id,
    }

    const budget = new Budgets(data);
    budget.save() 
    .then(budget_saved => {
        return Users.findByIdAndUpdate(user_id, {
            $push: {created_budgets: budget_saved._id}
        })
    })
    res.redirect('/');
})

app.get('/find', (req, res) => {
    
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})