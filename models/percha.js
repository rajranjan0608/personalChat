var mongoose        =require("mongoose");

//TABLE SCHEMA
var messageSchema=new mongoose.Schema({
   message:String, 
   user1:String,
   reqUser:String,
   perchaId:String,
});

//MAKING TABLE
var percha=new mongoose.model("percha",messageSchema);

//EXPORTING MODULE
module.exports=percha;