const model = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');
const config = require('../config/config');

// 处理登录请求 /login
const handleLogin = async (req, res) => {
    console.log('login')
    let {account, password} = req.body;
    //validRequest(req, res);
    if (!account || !password) {
        const temp = methods.formatRespond(false, 10005, errorText.formatError(10005));
        res.status(400).send(temp);
    } else {
        console.log(req.cookies);
        await checkUser(account, password, res);
    }
};

//获取当前用户具备的权限
const getUserAuthority = (req, res) => {
    try {
        let userId = getUserId(req, res);
        
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

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
            //登录时，查询到该用户是存在的,生成相关token，并将相关信息插入或更新到login信息表中,只将token中的am_sig存入到数据库中;
            let now_time = new Date().getTime();
            let user_id = user[0].id;
            let user_token = generateToken(user_id, now_time);
            flag = await tokenLogin(user_id, user_token.am_sig, now_time, res);
            if (flag) {
                res.cookie('am_user', user_token.am_user,{maxAge: 60 * 60 * 1000});
                res.cookie('am_sig', user_token.am_sig, {maxAge: 60 * 60 * 1000});
                res.cookie('am_val', user_token.am_val, {maxAge: 60 * 60 * 1000})
                res.send({text: 'login success'});
            }
            //console.log(user)
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
const tokenLogin = async (userId, token_sig, time, res) => {
    let code, flag = true, temp;
    try {
        let history = await model.login.findOrCreate({where: {userId: userId}, defaults: {token: token_sig, updateTime: time}});
        if (!history[1]) {
            await model.login.update({token: token_sig, updateTime: time}, {where: {userId: userId}});
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
    let sig_str = time + '&' + userId;
    token_obj.am_sig = methods.encryptFun(sig_str, config.cookie_encrypt);
    token_obj.am_val = Buffer.from(time.toString()).toString('base64');
    return token_obj;
};

//验证request里面的token，并对其进行解密等相关操作，flag表示这个token是否有效，true表示token未被更改
const handleToken = (token) => {
    let {am_user, am_sig, am_val} = token, de_obj = {}, flag = true;
    try {
        de_obj.am_user = methods.decryptFun(am_user, config.cookie_encrypt);
        let de_sig = methods.decryptFun(am_sig, config.cookie_encrypt).split('&');
        de_obj.am_val = Buffer.from(am_val, 'base64').toString();
        //|| (de_sig[0] !== de_obj.am_val) 暂时不对时间验证，由数据库验证
        if ((de_obj.am_user !== de_sig[1])) {
            flag = false;
        };
    } catch (err) {
        flag = false;
    }
    return {flag: flag, data: de_obj};
};

//根据解析出来的token，去查询登录token记录表，来验证是否存在以及是否有效
const validLoginToken = async (req, res, cookie) => {
    let flag = true, code, temp, data_token, userId, res_token;
    try {
        //解密token
        let get_token = handleToken(cookie);
        if (get_token.flag) {
            userId = get_token.data.am_user;
            let login_record = await model.login.findAll({
                where: {
                    userId: userId
                }
            });
            if (login_record.length) {
                data_token = login_record[0];
                let result = await compareToken(data_token, req.cookies.am_sig);
                let {flag, code} = result;
            } else {
                flag = false;
                code = 10007;
            }
        } else {
            code = 10007;
            flag = false;
        }
        if (!flag) {
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    };
    if (data_token && data_token.token) {
        res_token = data_token.token;
    }
    return {flag: flag, token: res_token, userId: userId};
};

//比较接收到的token信息以及查询到的token的信息
const compareToken = async (sqlData, reqToken) => {
    let flag = true, code;
    try {
        //两个token是一样的
        if (sqlData.token == reqToken) {
            let now_time = new Date().getTime();
            if (now_time - new Date(sqlData.updateTime).getTime() > 60 * 60 * 1000) {
                //token存在但是上次更新时间距今已经超过1小时
                flag = false;
                code = 10007;
            } else {
                //token存在并且token还是有效状态
                await model.login.update({updateTime: new Date().getTime()}, {where: {userId: sqlData.userId}});
            }
        } else {
            //token不一致
            flag = false;
            code = 10007;
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return {flag: flag, code: code};
}

//验证用户的请求，验证此时用户是否是登陆状态（，以及当前用户是否有权限进行相关操作）
const validRequest = async (req, res) => {
    let cookie_get = req.cookies || {}, flag = true, code, temp;
    let {am_user, am_sig, am_val} = cookie_get;
    console.log('cookie',cookie_get);
    if (!am_user || !am_sig || !am_val) {
        flag = false;
        code = 10007;
        temp = methods.formatRespond(flag, code, errorText.formatError(code));
        res.status(401).send(temp)
    } else {
        //请求存在cookie,且token需要的三个值都存在
        let valid_res = await validLoginToken(req, res, cookie_get);
        if (valid_res.flag) {
            //验证token有效后，需要更新token的有效期,此处生成了新的token，但是只是更新了token当中的am_val字段
            let new_cookie = generateToken(valid_res.userId, new Date().getTime());
            new_cookie.am_sig = valid_res.token;
            res.cookie('am_user', new_cookie.am_user,{maxAge: 60 * 60 * 1000});
            res.cookie('am_sig', new_cookie.am_sig, {maxAge: 60 * 60 * 1000});
            res.cookie('am_val', new_cookie.am_val, {maxAge: 60 * 60 * 1000});
        } else {
            //验证cookie无效之后需要将标识置为false
            flag = false;
        }
    };
    return flag;
};

//根据请求的相关信息，获取当前用户ID的操作
const getUserId = (req, res) => {
    let {am_user} = handleToken(req.cookies).data;
    return am_user;
};
module.exports = {handleLogin, checkUser, getUserId, validRequest};