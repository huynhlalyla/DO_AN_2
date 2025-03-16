const { Int32 } = require('bson');
const mongoose = require('mongoose');
const { float } = require('webidl-conversions');
const Schema = mongoose.Schema;

const Transaction = new Schema({
    name: {type: String, required: true},
    amount: {type: String, required: true},
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
        default: 'expense'
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    date: {type: Date, required: true},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    timestamps: true
});
    
module.exports = mongoose.model('Transaction', Transaction);