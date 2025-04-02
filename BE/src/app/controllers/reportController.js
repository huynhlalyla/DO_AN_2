const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Reports = require('../models/Reports');
const Transactions = require('../models/Transactions');
const Budgets = require('../models/Budgets');



// GET /api/reports
async function createReport(req, res) {
    // const {user_id, count} = req.body;
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

    const currentDate = new Date();
    let test = new Date();
    test.setMonth(currentDate.getMonth() - 4);
    console.log(currentDate);
    console.log(test);

    //lap qua het cac giao dich
    //tinh tong so tien cua giao dich
    const transactions = await Transactions.find({user_id: user_id});
    for(let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        if(transaction.type === 'income') {
            data.balance += parseFloat(transaction.amount);
            // console.log(transaction.date);
        } else {
            data.balance -= parseFloat(transaction.amount);
            // console.log(transaction.date);
        }
    }
    const report = new Reports(data);
    res.json(report);
    // await report.save()
    // .then(report => {
    //     Reports.findById(report._id)
    //     .populate({
    //         path: 'total_income',
    //         populate: {
    //             path: 'transactions'
    //         }
    //     })
    //     .populate({
    //         path: 'total_expense',
    //         populate: {
    //             path: 'transactions'
    //         }
    //     })
    //     .then(report => {
    //         res.json(report)
    //     })
    // })
    // res.json(data);
}



// GET /api/reports
async function viewAllReports(req, res) {
    Reports.find({})
    .populate('user_id')
    .then(reports => {
        res.json(reports)
    })
}


module.exports = {
    createReport,
    viewAllReports
};