const ObjectID = require('mongoose').Types.ObjectId;
const IMG_COLL = require('../database/img-coll');
const TOPIC_COLL = require('../database/topic-coll');
const USER_COLL = require('../database/user-coll');

module.exports = class img extends IMG_COLL {

    static insert({ content, topic, user, avatar}) {
        return new Promise(async resolve => {
            try {

                let dataInsert = { 
                    content,
                    topic,
                    user,
                    avatar
                };
                

                let infoAfterInsert = new IMG_COLL(dataInsert);
                console.log({ infoAfterInsert })
                let saveDataInsert = await infoAfterInsert.save();

                if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert_img' });


                let topicAfterUpdate = await TOPIC_COLL.findByIdAndUpdate(topic, {
                    $addToSet:{
                        imgs: infoAfterInsert._id
                    } 
                })

                let authorAfterUpdate = await USER_COLL.findByIdAndUpdate(user, {
                    $addToSet:{
                        imgs: infoAfterInsert._id
                    } 
                })

                if( !topicAfterUpdate && !authorAfterUpdate ){
                    return resolve({error: true, message:'cannot_update_data'})
                }

                resolve({ error: false, data: infoAfterInsert });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList() {
        return new Promise(async resolve => {
            try {
                let listImg = await IMG_COLL.find({})
                .populate('topic')
                .populate('user')
                .sort({ createAt: -1 })
                .sort({seen : -1})

                if (!listImg) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: listImg });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }
    
    static remove({ imgID, topicID, userID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(imgID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterRemove = await IMG_COLL.findByIdAndDelete(imgID);

                if (!infoAfterRemove)
                    return resolve({ error: true, message: 'cannot_remove_data' });

                let removeImgToTopic  = await TOPIC_COLL.findByIdAndUpdate(topicID, {
                    $pull : {
                        imgs : imgID
                    }
                }, {new : true})

                let removeImgToUser  = await USER_COLL.findByIdAndUpdate(userID, {
                    $pull : {
                        imgs : imgID
                    }
                }, {new : true})

                if(!removeImgToTopic && !removeImgToUser) return resolve({error : true, message :'cannot_remove_img_to_topic'})

                return resolve({ error: false, data: infoAfterRemove, message: "remove_data_success" });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static update({ imgID,topic, user, content}) {
        return new Promise(async resolve => {
            try {


                if (!ObjectID.isValid(imgID) ) 
                    return resolve({ error: true, message: 'params_invalid' });

                let dataUpdate = {
                    topic,
                    user,
                    content
                    
                    
                }
                
                let infoAfterUpdate = await IMG_COLL.findByIdAndUpdate(imgID, dataUpdate, { new: true });
                
                if (!infoAfterUpdate)
                    return resolve({ error: true, message: 'cannot_update_data' });

                return resolve({ error: false, data: infoAfterUpdate, message: "update_data_success" });

                
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }
}
