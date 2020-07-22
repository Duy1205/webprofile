const ObjectID = require('mongoose').Types.ObjectId;
const USER_COLL = require('../database/user-coll');
const POST_COLL = require('../database/post-coll');
const IMG_COLL = require('../database/img-coll');


const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../utils/jwt');

module.exports = class User extends USER_COLL {

    static register(fullname, email, password, birthday, hobbies, phone, age, instagram, facebook, studyAt, description) {
        return new Promise(async resolve => {
            try {
                let checkExist = await USER_COLL.findOne({ email });
                if (checkExist)
                    return resolve({ error: true, message: 'email_existed' });
                let hashPassword = await hash(password, 8);
                let newUser = new USER_COLL({ fullname, email,birthday, hobbies, phone, age, instagram, facebook, studyAt, description, password: hashPassword });
                let infoUser = await newUser.save();
                if (!infoUser) return resolve({ error: true, message: 'cannot_insert' });
                resolve({ error: false, data: infoUser });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    static registerLove(fullname, email, password, birthday, hobbies, phone, age, instagram, facebook, studyAt, description) {
        return new Promise(async resolve => {
            try {
                let checkExist = await USER_COLL.findOne({ email });
                if (checkExist)
                    return resolve({ error: true, message: 'email_existed' });
                let newUser = new USER_COLL({ fullname, email,birthday, hobbies, phone, age, instagram, facebook, studyAt, description, password });
                let infoUser = await newUser.save();
                if (!infoUser) return resolve({ error: true, message: 'cannot_insert' });
                resolve({ error: false, data: infoUser });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static signIn(email, password) {
        return new Promise(async resolve => {
            try {
                const infoUser = await USER_COLL.findOne({ email });
                if (!infoUser)
                    return resolve({ error: true, message: 'email_not_exist' });
                const checkPass = await compare(password, infoUser.password);
                if (!checkPass)
                    return resolve({ error: true, message: 'password_not_exist' });
                await delete infoUser.password;
                let token = await sign({ data: infoUser });
                return resolve({ error: false, data: { infoUser, token } });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static insert({ email, fullname, password, avatar, birthday, hobbies, phone, age, instagram, facebook, studyAt, description }) {
        return new Promise(async resolve => {
            try {
                if (!email)
                    return resolve({ error: true, message: 'params_invalid' });

                let checkEmailExisted = await USER_COLL.findOne({ email })
                if (checkEmailExisted)
                    return resolve({ error: true, message: 'email_existed' });

                let dataInsert = {
                    email,
                    fullname,
                    password,
                    avatar,
                    birthday,hobbies,phone,age,instagram,facebook,studyAt,description
                };

                let infoAfterInsert = new USER_COLL(dataInsert);
                let saveDataInsert = await infoAfterInsert.save();

                if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert_user' });
                resolve({ error: false, data: infoAfterInsert });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList() {
        return new Promise(async resolve => {
            try {
                let listUser = await USER_COLL.find()
                .populate('imgs')
                .populate('posts')
                .sort({ createAt: -1 });

                if (!listUser) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: listUser });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getInfo({ userID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(userID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoUser = await USER_COLL.findById(userID)
                .populate('imgs')
                .populate('posts')
                .sort({createAt: -1})

                if (!infoUser) return resolve({ error: true, message: 'cannot_get_info_data' });

                return resolve({ error: false, data: infoUser });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove({ userID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(userID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterRemove = await USER_COLL.findByIdAndDelete(userID);
                let infoImgRemove = await IMG_COLL.deleteMany({user : userID});
                let infoPostRemove = await POST_COLL.deleteMany({user : userID});



                if (!infoAfterRemove)
                    return resolve({ error: true, message: 'cannot_remove_data' });

                return resolve({ error: false, data: infoAfterRemove, message: "remove_data_success" });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static update({ userID, fullname, avatar, birthday, hobbies, phone, age, instagram, facebook, studyAt, description }) {
        return new Promise(async resolve => {
            try {
                console.log(avatar);
                
                if (!ObjectID.isValid(userID)) //|| !ObjectID.isValid(userUpdate)
                    return resolve({ error: true, message: 'params_invalid' });

                let dataUpdate = {
                    fullname,
                    avatar,
                    birthday,hobbies,phone,age,instagram,facebook,studyAt,description
                }

                let infoAfterUpdate = await USER_COLL.findByIdAndUpdate(userID, dataUpdate, { new: true });

                if (!infoAfterUpdate)
                    return resolve({ error: true, message: 'cannot_update_data' });

                return resolve({ error: false, data: infoAfterUpdate, message: "update_data_success" });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

}
