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

// method used to valid whether the login session is valid
const validLogin = () => {
    return true
};

module.exports = { formatRespond, validLogin, interRespond, passEncrypt };