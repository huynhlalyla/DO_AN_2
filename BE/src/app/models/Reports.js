
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
    balance: {
        type: Number,
        required: true,
        default: 0
    },

}, {
    timestamps: true
});
    
module.exports = mongoose.model('Report', Report);