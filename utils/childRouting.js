const jwt       = require('../utils/jwt');
const toastr    = require('toastr');
let POST_MODEL  = require('../models/post');
let TOPIC_MODEL = require('../models/topic');
let COMMENT_MODEL = require('../models/comment');
let USER_MODEL = require('../models/user');
let IMG_MODEL   = require('../models/img');
const moment    = require('moment');

let renderToView = async function(req, res, view, data) {

    let { token } = req.session;
    if(token){
        let user = await jwt.verify(token);
        data.infoUser = user.data;
    }else{
        data.infoUser = undefined;

    }

    let listPost = await POST_MODEL.getList();
    let listTopic = await TOPIC_MODEL.getList();
    let listUser = await USER_MODEL.getList();
    let listImg = await IMG_MODEL.getList();
    data.moment = moment;

    data.listTopic = listTopic.data;
    data.listPost = listPost.data;
    data.listUser = listUser.data;
    data.listImg = listImg.data;

    res.render(view, data);
}
exports.renderToView = renderToView;