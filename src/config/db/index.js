const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URL, {
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