const express = require('express');
const route = express.Router();
const Users = require('../app/models/Users');

//  Thêm người dùng
route.get('/add', (req, res) => {
    const data = {
        name: 'Hà',  
        password: '1111',  
        email: 'h@gmail.com',  
        phone: '0965342432', 

    }
    const user = new Users(data);
    user.save()
    res.redirect('/');
})

// Xác thực người dùng
route.post('/auth', async (req, res, next) => {
    const data = req.body;
    await Users.findOne({phone: data.sdt})
    .then(user => {
        if(user.password === data.password) {
            res.json({message: 'success', user: user})
        } else {
            res.json({message: 'fail'})
        }
    })
})


module.exports = route;