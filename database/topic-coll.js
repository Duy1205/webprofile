var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var topicSchema = new Schema({
    
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    imgs: [{
        type: Schema.Types.ObjectId,
        ref: 'img',
        default: []
    }],
    name: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
    modifyAt: {
        type: Date,
        default: Date.now()
    }
});

let TOPIC_COLL =mongoose.model('topic', topicSchema);
module.exports  = TOPIC_COLL ;