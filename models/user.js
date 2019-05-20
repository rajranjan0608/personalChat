var mongoose                =require("mongoose");
var passportLocalMongoose   =require("passport-local-mongoose");

//TABLE SCHEMA
var userSchema=new mongoose.Schema({

    username:String,
    password:String

});

userSchema.plugin(passportLocalMongoose);

//MAKING TABLE
var users=new mongoose.model("users", userSchema);

//EXPORTING MODULE
module.exports=users;