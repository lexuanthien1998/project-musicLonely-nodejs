const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test_nodejs_basic', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('Connect Success');
    } catch (error) {
        console.log('Connect Failed');
    }
}
module.exports = { connect };