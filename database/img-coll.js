var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    content: String,
    avatar: String,
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'topic'
    },
    createAt: {
        type: Date,
        default: Date.now
    },
});

let IMG_COLL  = mongoose.model('img',imgSchema);
module.exports = IMG_COLL;