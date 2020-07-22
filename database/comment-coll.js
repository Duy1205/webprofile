var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    
    author: {
        type: Schema.Types.ObjectId,
        ref : "user"
    },
    content: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    }
    
});

let COMMENT_COLL = mongoose.model('comment', commentSchema);
module.exports  = COMMENT_COLL ;
