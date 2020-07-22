module.exports = async function (req, res, next) {
    let { token } = req.session;
    if (!token)
        return res.redirect('/');
    next();
}