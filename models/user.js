const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,    
        required:true,
        // unique:true
    },
    
});
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose); //adds username,password,hashing and salting fields and methods to userSchema

module.exports=mongoose.model('User',userSchema);