
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Report = new Schema({


    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total_income: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: []
        }
    ],
    total_expense: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: []
        }
    ],
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transactions',
            default: []
        }
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

}, {
    timestamps: true
});
    
module.exports = mongoose.model('Report', Report);