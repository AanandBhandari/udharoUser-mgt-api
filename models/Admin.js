const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let userSchema = mongoose.Schema({
    
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true,
        validate : {
            validator : validator.isEmail,
            // validator : (value) => validator.isEmail(value),
            message : '{VALUE} is not valid email'
            
        }
    },
    password : {
        type : String,
        require : true,
        minlength : 6
    },
    tokens :[{
        access : {
            type : String,
            require : true
        },
        token : {
            type : String,
            require : true
        }
    }]
});
userSchema.methods.toJSON = function () {
    let admin = this;
    let userObject = admin.toObject();
    return _.pick(userObject,['_id','email']);
};


// hashing the password just before save event
userSchema.pre('save',function (next) {
    let admin = this;
    if (admin.isModified('password')) {
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(admin.password,salt,(err,hash)=> {
             admin.password = hash;
             next();
            });
        });
    } else {
        next();
    } 
 });


userSchema.statics.findByCredentials = function (email,password) {
    Admin = this;
    return Admin.findOne({email}).then((admin) => {
        if (!admin) {
            return Promise.reject();
        }
        // here bcrypt algo doesnt use promise it only use callback
        // bt to maintain promise chain we use new promise
        return new Promise((resolve,reject)=> {
            bcrypt.compare(password,admin.password,(err,res) => {
                if (res) {
                    resolve(admin);
                } else {
                    reject();
                }
            });
        });
    });
};


// after signin user needs token to access their data
// so here we generate token just after signin and return it
userSchema.methods.generateAuthToken = function () {
    var admin = this;
    var access = 'auth';
    var token = jwt.sign({_id:admin._id.toHexString(),access},'abc123').toString();
    admin.tokens.unshift({access,token});
    return admin.save().then(()=>{
        return token;
    });
};


// finding admin by token
userSchema.statics.findByToken = function (token) {
    let Admin = this;
    let decoded;
    try {
        decoded = jwt.verify(token,'abc123')
      //   console.log(decoded)
    } catch (e) {
      //   return new Promise((resolve,reject) => {
      //       reject();
      //   });
      return Promise.reject();
    }  
    return Admin.findOne({
      '_id' : decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  };



// removing token from admin base
userSchema.methods.removeToken = function (token) {
    let admin = this;
    return admin.update({
        $pull: {
            tokens:{token}
        }
    });  
};


let Admin = mongoose.model('Admin',userSchema);

module.exports = {Admin};