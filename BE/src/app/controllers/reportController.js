const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Reports = require('../models/Reports');
const Transactions = require('../models/Transactions');
const Budgets = require('../models/Budgets');



// GET /api/reports
async function createReport(req, res) {
    const {user_id, day} = req.body;
    // const user_id = "67d908ef4abdd3937e27b62f";
    // const day = 90;
    // const user = await Users.findById(user_id);
    let startDate;
    let endDate;
    if(day <= 14) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const countDay = day;
        const lastSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDay === 0 ? 7 : currentDay-1));
        startDate = new Date(Date.UTC(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate() - countDay));
        endDate = new Date(lastSunday);
    } else {
        const currentDate = new Date();
        const countMonth = day / 30;
        startDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - countMonth, 1));
        endDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 0));
    }
    console.log(startDate);
    console.log(endDate);

    const data = {
        user_id: user_id,
        total_income: [],
        total_expense: [],
        transactions: [],
        startDate: startDate,
        endDate: endDate,
    }
    

    //lap qua het cac giao dich
    //tinh tong so tien cua giao dich
    const transactions = await Transactions.find({
        user_id: user_id,
        date: {
            $gte: startDate,
            $lt: endDate
        }
    }).populate('category_id', "name");
    for(let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        if(transaction.type === 'income') {
            data.total_income.push(transaction);
            data.transactions.push(transaction);
            // console.log(transaction.date);
        } else {
            data.total_expense.push(transaction);
            data.transactions.push(transaction);
        }
    }
    const report = new Reports(data);
    await report.save()
    res.json(data);
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