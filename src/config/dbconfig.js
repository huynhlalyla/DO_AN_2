const mongoose = require('mongoose');

async function connect() {
    try {
        const databaseUrl = 'mongodb+srv://ptthuynhcntt2211017:WdS95PxlQnbvrFlj@doan01.nstcg.mongodb.net/DoAn02-database?retryWrites=true&w=majority&appName=DoAn01';
        await mongoose.connect(databaseUrl);
        console.log('Kết nối database thành công!');
    } catch (error) {
        console.log(`Lỗi: ${error}`);
    }
}


module.exports = { connect };
