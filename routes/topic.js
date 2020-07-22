const route = require('express').Router();
const  TOPIC_MODEL  = require('../models/topic');
const { renderToView } = require('../utils/childRouting');

let ObjectID = require('mongoose').Types.ObjectId;

route.get('/listTopic', async (req, res) => {
    
    let listTopic = await TOPIC_MODEL.getList();
    console.log(listTopic);
    
    res.json({listTopic});
    
})

route.get('/info-topic', async (req, res) => {
    let { topicID } = req.query;
    let infoTopic = await TOPIC_MODEL.getInfo({ topicID })

    renderToView(req, res, 'pages/topic-detail', { infoTopic: infoTopic.data})

})

route.get('/info-topicdb', async (req, res) => {
    let { topicID } = req.query;
    let infoTopic = await TOPIC_MODEL.getInfo({ topicID })

    renderToView(req, res, 'pages/topic-detail-db', { infoTopic: infoTopic.data})

})


route.get('/edit-topic/:topicID', async (req, res) => {

    let {topicID} = req.params;
    
    let infoTopic = await TOPIC_MODEL.getInfo({ topicID });
    // console.log({infoTopic});
    
    renderToView(req, res, 'pages/edit-topic', {infoTopic : infoTopic.data});
});

route.get('/add-topic', (req, res) => {
    renderToView(req, res, 'pages/add-topic', {});
});

route.post('/add-topic', async (req, res) => {
    let {name, authorID} = req.body;
    //console.log({name, authorID});
    
    let infoTopic = await TOPIC_MODEL.insert({name, authorID});
    console.log(infoTopic);
    
    res.json({infoTopic});
})

route.get('/infoTopic', async (req, res) => {
    
    let infoTopic = await TOPIC_MODEL.getInfo();
    console.log(infoTopic);
    
    res.json({infoTopic});
    
})

route.post('/update-topic/:topicID', async (req, res) => {
    let {topicID} = req.params;
    //console.log({topicID});
    
    let { name} = req.body;
    console.log({name});
    
    let infoTopic = await TOPIC_MODEL.update({topicID, name});
    console.log(infoTopic);
    
    res.json({infoTopic});
})

route.post('/remove-topic/:topicID', async (req, res) => {
    let {topicID} = req.params;
    //console.log({topicID});
    
    //let { name} = req.body;
    //console.log({name});
    
    let infoTopic = await TOPIC_MODEL.remove({topicID});
    console.log(infoTopic);
    
    res.json({infoTopic});
})

module.exports = route;