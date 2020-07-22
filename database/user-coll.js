var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    email: { 
        type: String,
        required: true,
        trim: true
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post',
        default: []
    }], 
    imgs: [{
        type: Schema.Types.ObjectId,
        ref: 'img',
        default: []
    }], 
    fullname: String,
    password: String,
    avatar: String,
    birthday : String,
    hobbies : String,
    phone : Number,
    age : Number,
    instagram : String,
    facebook : String,
    studyAt : String,
    description : String,
    role: {
        type: Number,
        default: 0
    },
    createAt: Date
});

let USER_COLL  = mongoose.model('user',userSchema);
module.exports = USER_COLL;