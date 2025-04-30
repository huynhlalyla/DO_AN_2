const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const User = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    created_budgets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Budget',
            default: []
        }
    ],
    created_transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            default: []
        }
    ],
    created_categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: []
        }
    ],
    notifies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notify',
            default: []
        }
    ],
    resetPasswordToken: {type: String, default: null},
    resetPasswordExpires: {type: Date, default: null},
}, {
    timestamps: true
});
    
module.exports = mongoose.model('User', User);