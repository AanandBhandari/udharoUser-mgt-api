const router = require('express').Router();
const {Admin} = require('../models/Admin.js');
const _ = require('lodash');
const {auth} = require('../config/auth.js');


// handlein signup route
router.post('/signup',(req,res)=> {
    let body = _.pick(req.body,['email','password']);
    let admin = new Admin(body);
    admin.save().then((admin)=> {
        // console.log(user);
        // console.log(JSON.stringify(user,undefined,2))
        res.status(200).send(admin);
    }).catch(e => res.status(400).send('unable to register!',e));
});


// handlein signin route
router.post('/signin',(req,res) => {
    let body = _.pick(req.body,['email','password']);
    Admin.findByCredentials(body.email,body.password)
    .then((admin)=> {
        console.log(admin);
        admin.generateAuthToken().then((token) => {
            res.header('x-auth',token).send(admin);
        });
    })
    .catch((e)=> {
        res.status(400).send('no such user');        
    });
});


// using a route with auth
router.get('/me',auth,(req,res)=> {
    res.send(req.admin);
});


module.exports = router;