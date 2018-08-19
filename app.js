const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
let db = require('./config/db.js');
let admin = require('./controller/admin.js');
let router = require('./controller/router.js');
let app = express();

// bodyParser middleware
app.use(bodyParser.json());

// mongoose setup
mongoose.Promise = global.Promise;
mongoose.connect(db.mongouri, { useNewUrlParser: true }).then(()=> {
    console.log('successfully connected to the database');
}).catch((e) =>{
    console.log('unable to connect to the database');
});

// adding controller to the express
app.use('/admin',admin);
app.use('/admin/router',router);




app.listen(port,()=> {
    console.log(`The app is running on port>>${port}`);
});