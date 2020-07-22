const ObjectID = require('mongoose').Types.ObjectId;
const TOPIC_COLL = require('../database/topic-coll');
const POST_COLL = require('../database/post-coll');
const IMG_COLL = require('../database/img-coll');

module.exports = class Topic extends TOPIC_COLL {

    static insert({ name, authorID }) {
        return new Promise(async resolve => {
            try {

                // if (!name || !ObjectID.isValid(authorID))
                // return resolve({ error: true, message: 'params_invalid' });

                let dataInsert = { 
                    name,
                
                    author: authorID
                };
                

                let infoAfterInsert = new TOPIC_COLL(dataInsert);
                let saveDataInsert = await infoAfterInsert.save();

                if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert_topic' });
                resolve({ error: false, data: infoAfterInsert });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList() {
        return new Promise(async resolve => {
            try {
                let listTopic = await TOPIC_COLL.find().populate('imgs').sort({ createAt: -1 });

                if (!listTopic) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: listTopic });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getInfo({ topicID }) {
        return new Promise(async resolve => {
            try {
                
                if (!ObjectID.isValid(topicID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoTopic = await TOPIC_COLL.findById(topicID)
                .populate('imgs').sort({ createAt: -1 })
                if (!infoTopic) return resolve({ error: true, message: 'cannot_get_info_data' });

                return resolve({ error: false, data: infoTopic });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove({ topicID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(topicID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterRemove = await TOPIC_COLL.findByIdAndDelete(topicID);
                let infoImgRemove = await IMG_COLL.deleteMany({topic : topicID});


                if (!infoAfterRemove  || !infoImgRemove)
                    return resolve({ error: true, message: 'cannot_remove_data' });

                return resolve({ error: false, data: infoAfterRemove, message: "remove_data_success" });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static update({ topicID, name }) {
        return new Promise(async resolve => {
            try {

                //console.log({ topicID, name, userUpdate });
                
                if (!ObjectID.isValid(topicID) ) //|| !ObjectID.isValid(userUpdate)
                    return resolve({ error: true, message: 'params_invalid' });

                let dataUpdate = {
                    name
                    
                }
                
                let infoAfterUpdate = await TOPIC_COLL.findByIdAndUpdate(topicID, dataUpdate, { new: true });
                
                if (!infoAfterUpdate)
                    return resolve({ error: true, message: 'cannot_update_data' });

                return resolve({ error: false, data: infoAfterUpdate, message: "update_data_success" });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }
}
