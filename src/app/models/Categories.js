const { Int32 } = require('bson');
const mongoose = require('mongoose');
const { float } = require('webidl-conversions');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {type: String, required: true},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction',
            default: []
        }
    ],
    budget_id: {
        type: Schema.Types.ObjectId,
            ref: 'Budget',
            default: null
    }
}, {
    timestamps: true
});
    
module.exports = mongoose.model('Category', Category);