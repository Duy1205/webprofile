var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: String,
    content: String,
    avatar: String,
    seen: [{
        type: Schema.Types.ObjectId,
        ref: "user",
        default: []
    }],
    
    like : [{
        type: Schema.Types.ObjectId,
        ref: "user",
        default: []
    }],

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment',
        default: []
    }],
    createAt: {
        type: Date,
        default: Date.now
    },
    modifyAt: {
        type: Date,
        default: Date.now
    }
});

let POST_COLL  = mongoose.model('post',postSchema);
module.exports = POST_COLL;