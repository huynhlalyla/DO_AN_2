const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Budget = new Schema({
    limit_amount: {type: String, default: "INFINITY",},
    start_date: {type: Date, default: new Date(),},
    end_date: {type: Date, default: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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