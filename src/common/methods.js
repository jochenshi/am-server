const crypto = require('crypto');
const config = require('../config/config');
// method used to format the respond in the similar format
const formatRespond = (resFlag, code, err = '', data = []) => {
    return {
        result: resFlag,
        code: code,
        error: err,
        data: data,
        msg: code === 200 ? '操作成功' : '操作失败'
    };
};

const interRespond = (result, code , error) => {
    return {
        result: result,
        code: code,
        error: error
    }
};

const passEncrypt = (data) => {
    const ciper = crypto.createCipher('aes192', config.pass_encrypt);
    let encrypted = ciper.update(data, 'utf-8', 'hex');
    return encrypted + ciper.final('hex');
};

const passDecrypt = (data) => {
    const decipher = crypto.createDecipher('aes192', config.pass_encrypt);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decrypted.final('utf8');
    return decrypted;
};

const sessionEncrypt = (data) => {
    const cipher = crypto.createCipher('aes192', config.session_encrypt);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const sessionDecrypt = (data) => {
    const decipher = crypto.createDecipher('aes192', config.session_encrypt);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decrypted.final('utf8');
    return decrypted;
};

const encryptFun = (data, password) => {
    const cipher = crypto.createCipher('aes192', password);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decryptFun = (data, password) => {
    const decipher = crypto.createDecipher('aes192', password);
    //decipher.setAutoPadding(false);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// method used to valid whether the login session is valid
const validLogin = (req) => {
    return true
};

//验证request里面的token，并对其进行解密等相关操作，flag表示这个token是否有效，true表示token未被更改
const handleToken = (token) => {
    let {am_user, am_sig, am_val} = token, de_obj = {}, flag = true;
    try {
        de_obj.am_user = decryptFun(am_user, config.cookie_encrypt);
        let de_sig = decryptFun(am_sig, config.cookie_encrypt).split('&');
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

//根据请求的相关信息，获取当前用户ID的操作
const getUserId = (req, res) => {
    let {am_user} = handleToken(req.cookies).data;
    return am_user;
};

module.exports = { 
    formatRespond, validLogin, interRespond,
    passEncrypt, passDecrypt, sessionEncrypt, 
    sessionDecrypt,encryptFun, decryptFun, getUserId
};