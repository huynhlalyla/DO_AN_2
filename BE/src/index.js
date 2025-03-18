const express = require('express');
const app = express();
// const port = 3000;
const Users = require('./app/models/Users');
const Categories = require('./app/models/Categories')
const Transactions = require('./app/models/Transactions');
const Budgets = require('./app/models/Budgets');
const Reports = require('./app/models/Reports');
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


//  Thêm người dùng
app.get('/add-user', (req, res) => {
    const data = {
        name: 'Kim Ngan',  
        password: 'mnop3456',  
        email: 'kimngan@gmail.com',  
        phone: '0965344415', 

    }
    const user = new Users(data);
    user.save()
    res.redirect('/');
})

// Thêm danh mục
app.get('/add-category', (req, res) => {
    const data = {
        name: "Gia dinh",
        user_id: "67d9093ac31624c45abf001d",
        type: "income"
        
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

// Thêm ngân sách
app.get('/add-budget', async (req, res) => {
    const data = {
        limit_amount: '2500000',
        start_date: '2025-03-01',
        end_date: '2025-04-01',
        user_id: '67d908ef4abdd3937e27b62f',
        category_id: '67d9408bea0c5bb824ed4e4a',
        
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

// Thêm giao dịch
app.get('/add-transaction', async (req, res) => {
    const data = {
        name: 'Ao GUCCI',
        amount: '1500000',
        type: 'expense',
        category_id: '67d9408bea0c5bb824ed4e4a',
        date: Date.now(),
        user_id: '67d908ef4abdd3937e27b62f'
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

app.get('/create-report', async (req, res) => {
    const user_id = "67d908ef4abdd3937e27b62f";
    const user = await Users.findById(user_id);
    const categories = await Categories.find({user_id: user_id});

    const data = {
        user_id: user_id,
        total_income: [],
        total_expense: [],
        balance: 0
    }

    //lap qua tung category, neu category.type === 'income' thi them vao data.total_income
    categories.forEach(category => {
        if(category.type == 'income') {
            data.total_income.push(category);
        } else {
            data.total_expense.push(category);
        }
    })

    //lap qua het cac giao dich
    //tinh tong so tien cua giao dich
    const transactions = await Transactions.find({user_id: user_id});
    for(let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        if(transaction.type === 'income') {
            data.balance += parseFloat(transaction.amount);
            console.log(parseFloat(transaction.amount));
        } else {
            data.balance -= parseFloat(transaction.amount);
            console.log(parseFloat(transaction.amount));
        }
    }
    const report = new Reports(data);
    await report.save();
    res.json(report);
})

// Xác thực người dùng
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

// Lấy tất cả giao dịch hiện có ra xem
app.post('/transactions', async (req, res, next) => {
    const data = req.body;
    await Transactions.find({user_id: data.user_id})
    .then(transactions => {
        if (transactions) {
            res.json(transactions);
        }
        else {
            res.json({message: 'fail'});
        }
    })
})
