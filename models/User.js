const {Schema,modal, model}=require('mongoose');

const UserSchema=new Schema({
    name:{
      type:String,
      required:true
    },
    email:{
        type:String,
        required:true
      },
      role:{
        type:String,
        default:"user",
        enum:['user','admin','super-admin']
      },
      username:{
        type:String,
        required:true
      },
      password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:20    
    }
},{timestamps:true});


module.exports=model('users',UserSchema);