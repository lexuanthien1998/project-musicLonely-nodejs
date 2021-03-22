const homeRoute = require('./home');
const userRoute = require('./user'); //export file router user
const postRoute = require('./post');

//route index.js là file chung (file cha) của các file route khác
function routerOfProject(app) {
    //Route Home
    app.use('/', homeRoute);
    //Route User
    app.use('/user', userRoute); //user.js
    //Route Post
    app.use('/post', postRoute);
}
module.exports = routerOfProject;
