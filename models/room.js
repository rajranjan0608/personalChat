var mongoose                =require("mongoose");
var passportLocalMongoose   =require("passport-local-mongoose");

//TABLE SCHEMA
var roomSchema=new mongoose.Schema({

    username:String,
    password:String

});

roomSchema.plugin(passportLocalMongoose);

//MAKING TABLE
var rooms=new mongoose.model("rooms", roomSchema);

//EXPORTING MODULE
module.exports=rooms;