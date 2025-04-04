const { Int32 } = require('bson');
const mongoose = require('mongoose');
const { float } = require('webidl-conversions');
const Schema = mongoose.Schema;

const Budget = new Schema({
    limit_amount: {type: String, required: true},
    start_date: {type: Date, required: true},
    end_date: {type: Date, required: true},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: []
        }
    ],

}, {
    timestamps: true
});
    
module.exports = mongoose.model('Budget', Budget);