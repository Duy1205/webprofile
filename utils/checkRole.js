const { sign, verify } = require('../utils/jwt')
module.exports = async function (req, res, next) {
    // let token = req.cookies['token'];
    let { token } = req.session;
    if (!token)
        res.redirect('/user/dang-nhap');
    let checkRole = await verify(token);
    if (checkRole.data.role !== 1)
        res.redirect('/');
    next();
}