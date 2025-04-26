const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notify = new Schema({
    message: {type: String, required: true},
    type: {
        type: String,
        enum: ['danger', 'warning', 'info', 'success'],
        required: true,
        default: 'expense'
    },
    date: {type: Date, default: new Date()},
    is_read: {type: Boolean, default: false},
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, {
    timestamps: true
});
    
module.exports = mongoose.model('Notify', Notify);