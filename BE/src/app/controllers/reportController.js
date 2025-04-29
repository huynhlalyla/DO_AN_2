const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Reports = require('../models/Reports');
const Transactions = require('../models/Transactions');
const Budgets = require('../models/Budgets');
const Notifies = require('../models/Notifies');



// GET /api/reports
async function createReport(req, res) {
    const {user_id, day} = req.body;
    // const user_id = "67d908ef4abdd3937e27b62f";
    // const day = 90;
    // const user = await Users.findById(user_id);
    let startDate;
    let endDate;
    let transactions;
    if(day == 0) {
        transactions = await Transactions.find({
            user_id: user_id,
        }).populate('category_id', "name type");
    } else if(day > 0 && day <= 14) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const countDay = day;
        const lastSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDay === 0 ? 7 : currentDay-1));
        startDate = new Date(Date.UTC(lastSunday.getFullYear(), lastSunday.getMonth(), lastSunday.getDate() - countDay));
        endDate = new Date(lastSunday);
        transactions = await Transactions.find({
            user_id: user_id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('category_id', "name type");
    } else {
        const currentDate = new Date();
        const countMonth = day / 30;
        startDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - countMonth, 1));
        endDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 0));
        transactions = await Transactions.find({
            user_id: user_id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate('category_id', "name type");
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
    // Tính tổng thu nhập và chi tiêu
    const totalIncome = data.total_income.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
    const totalExpense = data.total_expense.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
    const balance = totalIncome - totalExpense;

    // Kiểm tra nếu số dư âm, tạo thông báo cảnh báo
    if (balance < 0) {
        const notify = new Notifies({
            user_id: user_id,
            message: `Số dư của bạn đang âm: ${new Intl.NumberFormat('vi-VN').format(balance)} VND. Vui lòng kiểm tra lại chi tiêu.`,
            type: 'warning',
            date: new Date()
        });
        await notify.save();
        await Users.findByIdAndUpdate(user_id, {
            $push: { notifies: notify._id }
        });
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