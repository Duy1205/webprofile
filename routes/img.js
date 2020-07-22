const route = require('express').Router();
const jwt       = require('../utils/jwt');
const IMG_MODEL  = require('../models/img');
const TOPIC_MODEL = require('../models/topic');
const { renderToView } = require('../utils/childRouting');
const { uploadMulter } = require('../utils/config-multer');

route.get('/listImg', async (req, res) => {
    let listImg = await IMG_MODEL.getList();
    res.json({listImg});
})


route.get('/edit-img/:imgID', async (req, res) => {

    let {imgID} = req.params;
    
    let infoImg = await IMG_MODEL.getInfo({ imgID });

    renderToView(req, res, 'pages/edit-img', {infoImg : infoImg.data});
    console.log({infoImg});
    
});

route.get('/add-img', (req, res) => {
    renderToView(req, res, 'pages/add-img', {});
});

route.post('/add-img',uploadMulter.single('avatar') ,async (req , res) => {
    let { content, topic, user } = req.body;
    let infoFile = req.file;
    
    let infoImg = await IMG_MODEL.insert({ content, topic, user, avatar: infoFile.originalname });
    res.json({infoImg});
})

route.get('/info-img', async (req, res) => {
    let { imgID } = req.query;
    let infoImg = await IMG_MODEL.getInfo({ imgID })

    renderToView(req, res, 'pages/img-detail', { infoImg: infoImg.data})

})

route.get('/info-hot', async (req, res) => {
    let { imgID } = req.query;
    let infoImg = await IMG_MODEL.getInfo({ imgID })

    renderToView(req, res, 'pages/hot-detail', { infoImg: infoImg.data})


})


route.post('/update-img/:imgID', async (req, res) => {
        let {imgID} = req.params;
        //console.log({imgID});
        
        let { topic, user,content} = req.body;
        
        
        
        let infoImg = await IMG_MODEL.update({imgID, topic, user, content});
        //console.log(infoImg);
        
        res.json({infoImg});
    
})

route.post('/remove-img', async (req, res) => {
    let {imgID, topicID, userID} = req.query;

    let infoImg = await IMG_MODEL.remove({imgID, topicID, userID});

    res.json({infoImg});
})

module.exports = route;