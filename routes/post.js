const route = require('express').Router();
const jwt       = require('../utils/jwt');
const POST_MODEL  = require('../models/post');
const { renderToView } = require('../utils/childRouting');
const { uploadMulter } = require('../utils/config-multer');

route.get('/listPost', async (req, res) => {
    let listPost = await POST_MODEL.getList();
    //console.log({listPost});
    
    res.json({listPost});
})

route.get('/edit-post/:postID', async (req, res) => {

    let {postID} = req.params;
    
    let infoPost = await POST_MODEL.getInfo({ postID });
    // console.log({infoPost});
    
    renderToView(req, res, 'pages/edit-post', {infoPost : infoPost.data});
    console.log({infoPost});
    
});

route.get('/add-post', (req, res) => {
    renderToView(req, res, 'pages/add-post', {});
});

route.post('/add-post',uploadMulter.single('avatar') ,async (req , res) => {
    let {name, content, user } = req.body;
    //console.log({name, content, comment});
    let infoFile = req.file;
    
    let infoPost = await POST_MODEL.insert({ name, content, user, avatar: infoFile.originalname });
    //console.log(infoPost);
    
    res.json({infoPost});
})

route.get('/info-post', async (req, res) => {
    let { postID } = req.query;
    let infoPost = await POST_MODEL.getInfo({ postID })

    renderToView(req, res, 'pages/post-detail', { infoPost: infoPost.data})

})


route.post('/update-post/:postID', async (req, res) => {
        let {postID} = req.params;
        //console.log({postID});
        
        let { user,name,content} = req.body;
        
        
        
        let infoPost = await POST_MODEL.update({postID, user, name, content});
        //console.log(infoPost);
        
        res.json({infoPost});
    
})

route.post('/remove-post', async (req, res) => {
    let {postID, userID} = req.query;

    let infoPost = await POST_MODEL.remove({postID, userID});

    res.json({infoPost});
})

route.get('/like-post', async (req, res) => {

    let { token } = req.session;
    let infoUser = await jwt.verify(token) ;
    let { postID } = req.query;

    let infoPostAfterUpdate = await POST_MODEL.likePost({ postID, userID: infoUser.data._id })

    res.json(infoPostAfterUpdate)
})

route.get('/un-like-post', async (req, res) => {
    let { token } = req.session;
    let infoUser = await jwt.verify(token);
    let { postID } = req.query;
    let infoPostAfterUpdate = await POST_MODEL.unLikePost({ postID, userID: infoUser.data._id })
    res.json(infoPostAfterUpdate)
})




module.exports = route;