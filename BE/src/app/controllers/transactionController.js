const Transactions = require('../models/Transactions');
const Users = require('../models/Users');
const Categories = require('../models/Categories');
const Budgets = require('../models/Budgets');
const Notifies = require('../models/Notifies');


// GET /transaction/add
async function addTransaction(req, res) {
    const data = req.body;
    const transaction = new Transactions(data);
    await transaction.save()
    .then(async transaction => {
        await Users.findByIdAndUpdate(transaction.user_id, {
            $push: {created_transactions: transaction._id}
        })
        const updateCategory = await Categories.findByIdAndUpdate(transaction.category_id, {
            $push: {transactions: transaction._id}
        })
        if(transaction.type === 'expense') {
            await Budgets.findOne({_id: updateCategory.budget_id})
            .then(async budget => {
                budget.transactions.push(transaction._id);
                await budget.save();


                const category = await Categories.findOne({_id: transaction.category_id}).populate("transactions", "amount");
                const currentBudget = await Budgets.findOne({_id: category.budget_id});

                const transactions = category.transactions;
                let total = 0;
                transactions.forEach(transaction => {
                    total += parseFloat(transaction.amount);
                })
                console.log({
                    total: total,
                    limit_amount: currentBudget.limit_amount,
                    category: category.name
                });
                if (total > parseFloat(currentBudget.limit_amount)) {
                    // const formattedLimit = new Intl.NumberFormat('vi-VN').format(currentBudget.limit_amount); // Định dạng số tiền
                    const notify = new Notifies({
                        user_id: transaction.user_id,
                        message: `Bạn đã vượt quá ngân sách ${currentBudget.limit_amount} VND của ${category.name}`,
                        type: 'warning',
                        date: new Date()
                    });
                    await notify.save();
                    await Users.findByIdAndUpdate(transaction.user_id, {
                        $push: { notifies: notify._id }
                    });
                }
                else if (total > parseFloat(currentBudget.limit_amount) * 0.8) {
                    const formattedLimit = new Intl.NumberFormat('vi-VN').format(currentBudget.limit_amount); // Định dạng số tiền
                    const notify = new Notifies({
                        user_id: transaction.user_id,
                        message: `Bạn đã vượt quá 80% ngân sách ${formattedLimit} VND của ${category.name}`,
                        type: 'danger',
                        date: new Date()
                    });
                    await notify.save();
                    await Users.findByIdAndUpdate(transaction.user_id, {
                        $push: { notifies: notify._id }
                    });
                }
            })
        }
        
    })
    return res.status(200).json({message: 'success'});
}

// GET /transactions/view-all
async function viewAllTransactions(rep, res) {
    //    const transactions = await Transactions.find({})
    //         .populate('user_id')
    //         .populate('category_id')
    //     res.json(transactions)
    
        Transactions.find({})
        .populate('user_id')
        .populate('category_id')
        .then(transactions => {
            // res.send(`Ngân sach: ${budgets.limit_amount} - Của: ${budgets.user_id.name}`)
            res.json(transactions)
        })
} 
// PUT: /transactions/edit/:transaction_id
async function editTransaction(req, res) {
    const transactionId = req.params.transaction_id;
    const { name, amount, type, category_id, date } = req.body;

    const transaction = await Transactions.findById(transactionId);
    if (!transaction) {
        return res.status(404).json({ message: 'Khum tim thay giao dich' });
    }

    // Nếu category_id thay đổi, cập nhật Categories và Budgets
    if (transaction.category_id.toString() !== category_id) {
        // Xóa transaction khỏi category cũ
        await Categories.findByIdAndUpdate(transaction.category_id, {
            $pull: { transactions: transaction._id }
        });

        // Xóa transaction khỏi budget cũ (nếu là expense)
        if (transaction.type === 'expense') {
            await Budgets.findOneAndUpdate(
                { category_id: transaction.category_id },
                { $pull: { transactions: transaction._id } }
            );
        }

        // Thêm transaction vào category mới
        await Categories.findByIdAndUpdate(category_id, {
            $push: { transactions: transaction._id }
        });

        // Thêm transaction vào budget mới (nếu là expense)
        if (type === 'Thu nhập' ? 'income' : 'expense' === 'expense') {
            await Budgets.findOneAndUpdate(
                { category_id: category_id },
                { $push: { transactions: transaction._id } }
            );
        }
    }

    // Cập nhật thông tin transaction
    transaction.name = name;
    transaction.amount = amount;
    transaction.type = type === 'Thu nhập' ? 'income' : 'expense';
    transaction.category_id = category_id;
    transaction.date = date;
    await transaction.save();

    return res.status(200).json({ message: 'Da cap nhat giao dich' });
}

async function deleteTransaction(req, res) {
    const transactionId = req.params.transaction_id;

    const transaction = await Transactions.findById(transactionId);
    if (!transaction) {
        return res.status(404).json({ message: 'Khum tim thay giao dich' });
    }

    // Xóa transaction khỏi category
    await Categories.findByIdAndUpdate(transaction.category_id, {
        $pull: { transactions: transaction._id }
    });

    // Xóa transaction khỏi budget (nếu là expense)
    if (transaction.type === 'expense') {
        await Budgets.findOneAndUpdate(
            { category_id: transaction.category_id },
            { $pull: { transactions: transaction._id } }
        );
    }
    //xoá transaction khỏi user
    await Users.findByIdAndUpdate(transaction.user_id, {
        $pull: { created_transactions: transaction._id }
    });

    // Xóa transaction
    await Transactions.findByIdAndDelete(transactionId);

    return res.status(200).json({ message: 'Da xoa giao dich' });
}

async function searchTransaction(req, res) {
    try {
        const { user } = req.body;
        const searchData = req.query.q;
        console.log(user, searchData);
        const categories = await Categories.find({$text: { $search: searchData }, user_id: user })
        const transactions = await Transactions.find({ $text: { $search: searchData }, user_id: user })
            .populate('user_id')
            .populate('category_id');
        if (!transactions && !categories) {
            return res.status(404).json({ message: 'failed' });
        }
        console.log(categories, transactions);
        let result = [];
        if (transactions.length > 0) {
            result = transactions;
        } else if (categories.length > 0) {
            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];
                const categoryTransactions = await Transactions.find({ category_id: category._id })
                    .populate('user_id')
                    .populate('category_id');
                result.push(...categoryTransactions);
            }
        }
        console.log(result);
        return res.status(200).json({result, message: 'success'});
    } catch (error) {
        return res.status(500).json({ message: 'failed', error: error.message });
    }
}
module.exports = {
    addTransaction,
    viewAllTransactions,
    editTransaction,
    deleteTransaction,
    searchTransaction
};