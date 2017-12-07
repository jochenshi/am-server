const model = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');
const config = require('../config/config');

const handleLogin = async (req, res) => {
    let {account, password} = req.body;
    if (!account || !password) {
        const temp = methods.formatRespond(false, 10005, errorText.formatError(10005));
        res.status(400).send(temp);
    } else {
        await checkUser(account, password, res);
    }
};

const checkUser = async (account, password, res) => {
    let flag = true, temp, code;
    try {
        let user = await model.user.findAll({
            where: {
                account: account,
                password: methods.passEncrypt(password)
            }
        });
        if (!user.length) {
            flag = false;
            code = 10006;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            //登录时，查询到该用户是存在的
            res.send(user)
            console.log(user)
        }
    } catch (err) {}
}

//加密处理产生的token
const generateToken = (userId) => {
    let token_obj = {};
    token_obj.am_user = methods.encryptFun(userId, config.cookie_encrypt);
    let sig_str = userId + config.sig_encrypt;
    token_obj.am_sig = methods.encryptFun(sig_str, config.cookie_encrypt);
    return token_obj;
}

//验证request里面的token，并对其进行解密等相关操作
const handleToken = (token) => {
    
}

module.exports = {handleLogin, checkUser};