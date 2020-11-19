// const mysql = require('mysql');

// async function connect_mysql() {
//     // var db = mysql.createConnection({
//     //     host    : 'localhost',
//     //     user    : 'root',
//     //     password: '',
//     //     database: 'nodejs_test'
//     // });
//     // db.connect(function (err){
//     //     if (err) {
//     //         console.log('Connect MySQL Failed');
//     //     } else {
//     //         console.log('Connect MySQL Success');
//     //         var sql = "CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))";
//     //         db.query(sql, function(err, result) {
//     //             if(err) throw err;
//     //             console.log('Tạo bảng thành công!');
//     //         });
//     //     }
//     // });
// }
// module.exports = { connect_mysql };

const Sequelize = require('sequelize');
var sequelize = new Sequelize('nodejs_test','root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
});
try {
    sequelize.authenticate();
    console.log('Kết nối thành công.');
} catch (error) {
    console.error('Kết nối thất bại');
}  

module.exports = sequelize;
global.sequelize = sequelize;