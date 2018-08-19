const {Admin} = require('../models/Admin.js');

let auth = (req,res,next)=> {
    let token = req.header('x-auth');
    // console.log(token)
    Admin.findByToken(token).then((admin)=> {
        if (!admin) {
            // res.status(401).send();
            return Promise.reject();
        }

        req.admin = admin;
        req.token = token;
        next();
    }).catch((e)=> {
        res.status(401).send();
    });
};
module.exports = {auth};