// method used to format the respond in the similar format
const formatRespond = (res, resFlag, code, err, data = []) => {
    const respond = {
        result: resFlag,
        code: code,
        error: err,
        data: data,
        msg: code === 200 ? '请求成功' : '请求失败'
    };

};

const interRespond = (result, code , error) => {
    return {
        result: result,
        code: code,
        error: error
    }
};

// method used to valid whether the login session is valid
const validLogin = () => {
    return true
};

module.exports = { formatRespond, validLogin, interRespond };