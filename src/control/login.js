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

// 验证账号，密码是否有效
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
            //登录时，查询到该用户是存在的,生成相关token，并将相关信息插入或更新到login信息表中;
            let now_time = new Date().getTime();
            let user_id = user[0].id;
            let user_token = generateToken(user_id, now_time);
            flag = await tokenLogin(user_id, user_token, now_time, res);
            if (flag) {
                res.cookie(user_token, {maxAge: 5000}).send({text: 'login success'});
            }
            console.log(user)
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag;
};

//执行登录请求的时候对login表的处理


const addLogin = (userId, token) => {};

// 处理用户登录保持，写入login表

//执行登录请求的时候对login表的处理
const tokenLogin = async (userId, token, time, res) => {
    let code, flag = true, temp;
    try {
        let history = await model.login.findOrCreate({where: {id: userId}, defaults: {token: token, updateTime: time}});
        if (!history[1]) {
            await model.login.update({token: token, updateTime: time}, {where: {id: userId}});
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag;
};

//加密处理产生的token,am_sig保存的是用户的ID以及生成token更新的时间,time是时间戳的格式
const generateToken = (userId, time) => {
    let token_obj = {};
    token_obj.am_user = methods.encryptFun(userId, config.cookie_encrypt);
    let sig_str = userId + '&' + time;
    token_obj.am_sig = methods.encryptFun(sig_str, config.cookie_encrypt);
    token_obj.am_val = Buffer.from(time.toString()).toString('base64');
    return token_obj;
};

//验证request里面的token，并对其进行解密等相关操作
const handleToken = (token) => {
    
};

//验证用户的请求，验证此时用户是否是登陆状态（，以及当前用户是否有权限进行相关操作）
const validRequest = (req, res) => {
    let cookie_get = req.cookie;
};

module.exports = {handleLogin, checkUser};