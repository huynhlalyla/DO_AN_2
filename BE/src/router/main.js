const userRouter = require('./user');
const categoryRouter = require('./category');
const transactionRouter = require('./transaction');
const budgetRouter = require('./budget');
const reportRouter = require('./report');
const Users = require('../app/models/Users');
function Router(app) {
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
    
    app.use('/user', userRouter);
    app.use('/transaction', transactionRouter);
    app.use('/category', categoryRouter);
    app.use('/budget', budgetRouter);
    app.use('/report', reportRouter);
    
    
    
    
    
    
    
    
}
module.exports = Router;