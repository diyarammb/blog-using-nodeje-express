var mongoose =require("mongoose");
var BlogSchema=mongoose.Schema({
    title:String,
    description:String,
    author:String,
    image:String,
    createdDate:Date,
    category:String

});

module.exports=mongoose.model("post",BlogSchema);