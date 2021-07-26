const {Schema, model} = require('mongoose');
const userSchema = new Schema({

    login:{
        type:String,
        required: true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})
module.exports =model('User',userSchema);