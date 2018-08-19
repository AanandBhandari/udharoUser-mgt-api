const mongoose = require('mongoose');

let udharoSchema = mongoose.Schema({
    username : {
        type:String,
        required:true
    },
    userlastname: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true,
        min: 18, 
        max: 65
    },
    place : {
        type: String,
        required: true
    },
    date: {
        type:Date,
        default:Date.now
    },
    items : [{
        item : {
            type: String,
            required: true
        },
        itemprice : {
            type:Number,
            required:true
        },
        noofitem : {
            type: Number,
            required:true
        }
    }],
    adminID: {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
    
});
let udharoUser = mongoose.model('udharoUser',udharoSchema);
module.exports = {udharoUser};