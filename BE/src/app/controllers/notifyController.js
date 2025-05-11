const Notify = require('../models/Notifies');
const Users = require('../models/Users');

async function create (req, res) {
    try {
        const { message, type, user_id } = req.body;
        const notify = new Notify({ message, type, user_id });
        await notify.save();
        res.status(201).json({ message: 'success', notify });
    } catch (error) {
        res.status(500).json({ message: 'failed', error });
    }
}
async function updateRead (req, res) {
    try {
        const notify_id = req.body.notify_id;
        const notify = await Notify.findById(notify_id);
        if (notify) {
            notify.is_read = true;
            await notify.save();
            res.status(200).json({ message: 'success', notify });
        } else {
            res.status(404).json({ message: 'Notify not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'failed', error });
    }
}
async function getAll (req, res){
    try {
        const user_id = req.body.user_id;
        const notifies = await Notify.find({ user_id }).populate('user_id');
        res.status(200).json({notifies, message: 'success'});
    } catch (error) {
        res.status(500).json({ message: 'failed', error });
    }
}

async function readAll (req, res) {
    try {
        const user_id = req.body.user_id;
        const notifies = await Notify.find({ user_id });
        for (let i = 0; i < notifies.length; i++) {
            notifies[i].is_read = true;
            await notifies[i].save();
        }
        res.status(200).json({ message: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'failed', error });
    }
}

async function deleteAll (req, res) {
    try {
        const user_id = req.body.user_id;
        await Notify.deleteMany({ user_id });
        //xoá notify khỏi user
        await Users.findByIdAndUpdate(user_id, {
            $set: { notifies: [] }
        });
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        return res.status(500).json({ message: 'failed', error });
    }
}

module.exports = {
    create,
    getAll,
    updateRead,
    readAll,
    deleteAll
}