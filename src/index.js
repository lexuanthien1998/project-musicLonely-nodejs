const express = require('express');
const app = express();

const path = require('path');
const handlebars = require('express-handlebars');
const helpers = require('handlebars-helpers')();

require('dotenv').config({ path: '.env'})

app.use(express.static(path.join(__dirname, 'public'))); //http://localhost:3000/img/anh.jpg -- các link tĩnh

app.use(express.urlencoded({ extended: true })); //sử dụng cho route POST
app.use(express.json()); //sử dụng cho route POST với dữ liệu Json (trong js)

const morgan = require('morgan');
app.use(morgan('combined'));

//Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: helpers
}));

//Express session
const MongoStore = require('connect-mongo')(session);
const session = require('express-session');
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 1*60*60*1000},
  store: new MongoStore(options),
}))

app.set('view engine', 'hbs'); //đặt ứng dụng là dùng handlebars
//Khi đặt extname là gì thì phần set và tên tên engine phải giống
app.set('views', path.join(__dirname, 'resources','views'));

//Kết nối DB MonggoDB
const db = require('./config/db');
db.connect();

//Kết nối DB MySQL
// const mysql = require('./config/db/mysql');
// mysql.connect_mysql();

//Kết nối DB MySQL use "sequelize"
// const db = require('./config/db/mysql');

//Khởi tạo passport (Post Login C2)
const Passport = require('passport');
app.use(Passport.initialize());
app.use(Passport.session()); 

//File route
const router = require('./routes');
router(app);

var moment = require('moment');
moment().format(); 

//require('handlebars') KHÁC VỚI require('express-handlebars')
var Handlebars = require('handlebars');
Handlebars.registerHelper('formatDate', function(dateString) {
  return moment(new Date(dateString)).format('LL');
});

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
 
// Node js
// 1: Create và Install ExpressJs
// - Tạo forder chứa Project
// - npm init
// - npm install express --save (cài experssjs)
// - npm install nodemon --save-dev (cài nodemon)
// - vào package.json chèn vào mục scripts:
//   "start": "nodemon --inspect index.js"
// Để chạy nodemon, --inspect để chèn thêm phần debug ở trình duyệt, ko có cũng đc.
// - npm start (run project with nodemon)
// - npm istall morgan --save-dev (cài morgan)
// - npm install express-handlebars (template engines)
// - tạo các file main.js trong forder layouts của project

// 2. Form
// Sử dụng name input
// - GET: Query Faramater (req.query)
// - POST: Form Data (req.body)
//   app.use(express.urlencoded()); (sử dụng cho post url)
//   app.use(express.json()); (sử dụng cho post json - trong js)

// 3. Select
// - Khi chỉ lấy 1 (first)
// show(req, res, next) {
//   Post.findOne({slug: req.params.slug})    
//       .then(post => res.render('post/show', {post: post.toObject()}))
//       .catch(next);
// }
// - Khi lấy danh sách (list - get)
// list(req, res, next) {
  // Course.find({})
  //   .then(course => {
  //       course = course.map(course => course.toObject())
  //       res.render('home', {course});
  //   })
  //   .catch(next);
// }