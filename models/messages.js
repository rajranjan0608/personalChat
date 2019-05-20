var mongoose        =require("mongoose");

//TABLE SCHEMA
var messageSchema=new mongoose.Schema({
   message:String, 
   username:String 
});

//MAKING TABLE
var messages=new mongoose.model("messages",messageSchema);

//EXPORTING MODULE
module.exports=messages;