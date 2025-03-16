const express = require('express');
const app = express();
// const port = 3000;
const Users = require('./app/models/Users');
const Categories = require('./app/models/Categories')
const Transactions = require('./app/models/Transactions');
const Budgets = require('./app/models/Budgets');
const db = require('./config/dbconfig');
const cors = require('cors');
db.connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    Users.find({}).populate('created_categories')
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
// app.get('/add-user', (req, res) => {
//     const data = {
//         name: 'Nguyen Thi S',
//         password: '3333',
//         email: 's@gmail.com',
//         phone: '0965344443',
//     }
//     const user = new Users(data);
//     user.save()
//     res.redirect('/');
// })
// app.get('/add-category', (req, res) => {
//     const data = {
//         name: "Luong",
//         user_id: "67d675c05cdb352fc853b402",
//         type: "income"
        
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
// app.get('/add-budget', async (req, res) => {
//     const data = {
//         limit_amount: '3000000',
//         start_date: '2025-03-01',
//         end_date: '2025-04-01',
//         user_id: '67d675c05cdb352fc853b402',
//         category_id: '67d67700f0e20c30caae2b1f',
        
//     }
//     const budget = new Budgets(data);
//     await budget.save()
//     .then(async budget => {
//         await Users.findByIdAndUpdate(budget.user_id, {
//             $push: {created_budgets: budget._id}
//         })
//         await Categories.findByIdAndUpdate(budget.category_id, {
//             budget_id: budget._id
//         })

//     })
//     res.redirect('/');
// })
app.get('/add-transaction', async (req, res) => {
    const data = {
        name: 'Vegetable',
        amount: '20000',
        type: 'expense',
        category_id: '67d67da40fbfa99f52024f88',
        date: Date.now(),
        user_id: '67d675c05cdb352fc853b402'
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


app.post('/auth', async (req, res, next) => {
    const data = req.body;
    await Users.findOne({phone: data.sdt})
    .then(user => {
        if(user.password === data.password) {
            res.json({message: 'success', user: user})
        } else {
            res.json({message: 'fail'})
        }
    })
})

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
})

