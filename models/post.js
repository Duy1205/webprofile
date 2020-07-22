const ObjectID = require('mongoose').Types.ObjectId;
const POST_COLL = require('../database/post-coll');
const TOPIC_COLL = require('../database/topic-coll');
const COMMENT_COLL =  require('../database/comment-coll');
const USER_COLL = require('../database/user-coll');
const { resolve } = require('path');

module.exports = class Post extends POST_COLL {

    static insert({ name, content, user, avatar}) {
        return new Promise(async resolve => {
            try {

                if (!name)
                return resolve({ error: true, message: 'params_invalid' });

                let dataInsert = { 
                    name,
                    content,
                    user,
                    avatar
                };
                

                let infoAfterInsert = new POST_COLL(dataInsert);
                console.log({ infoAfterInsert })
                let saveDataInsert = await infoAfterInsert.save();

                if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert_post' });


                let authorAfterUpdate = await USER_COLL.findByIdAndUpdate(user, {
                    $addToSet:{
                        posts: infoAfterInsert._id
                    } 
                })

                if( !authorAfterUpdate ){
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
                let listPost = await POST_COLL.find({})
                .populate('user')
                .sort({ createAt: -1 })
                .sort({seen : -1})

                // console.log(listPost);
                
                
                if (!listPost) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: listPost });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }

            // try {
            //     let listComment = await COMMENT_COLL.find({}).populate('comments').sort({ createAt: -1 });

            //     if (!listComment) return resolve({ error: true, message: 'cannot_get_list_data' });

            //     return resolve({ error: false, data: listComment });

            // } catch (error) {

            //     return resolve({ error: true, message: error.message });
            // }
        })
    }
    
    static getInfo({ postID, userID }) {
        return new Promise(async resolve => {
            try {
                
                if (!ObjectID.isValid(postID, userID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoPost = await POST_COLL.findById(postID)
                .populate('subject post user')

                if (!infoPost) return resolve({ error: true, message: 'cannot_get_info_data' });

                let seenOfPost = await POST_COLL.findByIdAndUpdate(postID, {
                    $push: { seen: userID }
                }, {new: true})

                return resolve({ error: false, data: infoPost });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove({ postID, userID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(postID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterRemove = await POST_COLL.findByIdAndDelete(postID);

                if (!infoAfterRemove)
                    return resolve({ error: true, message: 'cannot_remove_data' });

                let removePostToUser  = await USER_COLL.findByIdAndUpdate(userID, {
                    $pull : {
                        posts : postID
                    }
                }, {new : true})

                if( !removePostToUser) return resolve({error : true, message :'cannot_remove_post_to_user'})

                return resolve({ error: false, data: infoAfterRemove, message: "remove_data_success" });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static update({ postID, user, name, content}) {
        return new Promise(async resolve => {
            try {


                if (!ObjectID.isValid(postID) ) //|| !ObjectID.isValid(userUpdate)
                    return resolve({ error: true, message: 'params_invalid' });

                let dataUpdate = {
                
                    user,
                    name,
                    content
                    
                    // file,
                    // userUpdate, 
                    // modifyAt: Date.now()
                }
                
                let infoAfterUpdate = await POST_COLL.findByIdAndUpdate(postID, dataUpdate, { new: true });
                
                if (!infoAfterUpdate)
                    return resolve({ error: true, message: 'cannot_update_data' });

                return resolve({ error: false, data: infoAfterUpdate, message: "update_data_success" });

                
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static likePost({ postID, userID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(postID, userID))
                    return resolve({ error: true, message: 'params_invalid' });

                let likeOfPost = await POST_COLL.findByIdAndUpdate(postID, {
                    $addToSet: { like: userID }
                }, {new: true})

                if (!likeOfPost) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: likeOfPost });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }
    
    static unLikePost({ postID, userID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(postID, userID))
                    return resolve({ error: true, message: 'params_invalid' });
                    
                let unLikeOfPost = await POST_COLL.findByIdAndUpdate(postID, {
                    $pull: { like: userID }
                }, {new: true})

                if (!unLikeOfPost) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: unLikeOfPost });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }
}
