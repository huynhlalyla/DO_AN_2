const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
}, {
    timestamps: true
});
    
module.exports = mongoose.model('User', User);