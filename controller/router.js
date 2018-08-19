const router = require('express').Router();
const {udharoUser} = require('../models/udharoUser.js');
const _ = require('lodash');
const {auth} = require('../config/auth.js');


router.post('/',auth, (req,res) => {
   
    let newUser = new udharoUser(
        {
            username : req.body.username,
            userlastname : req.body.userlastname,
            age : req.body.age,
            place : req.body.place,
            items :req.body.items,

            adminID : req.admin._id
        }
    );
    newUser.save().then((info) => {
        // console.log(doc)
        // console.log(JSON.stringify(info,undefined,2));
        res.send(info);
    }, (e) => {
        console.log('unable to save',e);
        res.status(400).send(e);
    });  
});


// getting all info of all customers
router.get('/',auth, (req,res) => {
    udharoUser.find({adminID: req.admin._id}).then((info)=> {
        res.send(info);
    },(e)=> {
        res.status(400).send(e);
    })
});


// getting all info of particular customer
router.get('/:id',auth,(req,res) => {
    let id = req.params.id;
    
    // if (!objectID.isValid(id)) {
    //     return res.status(404).send();
       
    // }
    udharoUser.findOne({
        _id : id,
        adminID:req.admin._id
    }).then((info) => {
        if (!info) {
            res.status(404).send();
        }
        res.send({info});
    }).catch((e) => {
        res.status(400).send();
    });
});


// updateing customer info
router.patch('/update/:id', auth,(req,res) => {
    let id = req.params.id;
   // if (!objectID.isValid(id)) {
    //    return res.status(404).send();
       
    // }
    let body = _.pick(req.body,['username','userlastname','age','place','items']);
    
    udharoUser.findOneAndUpdate({
        _id : id,
        adminID : req.admin._id
    },{$set: body},{new : true}).then((info) => {
        if (!info) {
            return res.status(404).send(); 
        }
        res.send({info});
    }).catch((e) => {
        res.status(400).send();
    });
});


// deleting allinfo of a customer
router.delete('/delete/:id',auth,(req,res) => {
    let id = req.params.id;
    
    // if (!objectID.isValid(id)) {
    //     return res.status(404).send();
       
    // }
    udharoUser.findOneAndRemove({
        _id : id,
        adminID : req.admin._id
    }).then((info) => {
        if (!info) {
            res.status(404).send();
        }
        res.send({info});
    }).catch((e) => {
        res.status(400).send();
    });
});

module.exports = router;