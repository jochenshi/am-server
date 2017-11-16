// error message handle module
const formatError = (code) => {
    var txt;
    switch (code) {
        case 200:
            txt = 'request success';
            break;
        case 10000:
            txt = 'name,account,password,phone or email can not be empty!';
            break;
        case 10001:
            txt = '用户名或账户已经存在。';
            break;
        case 10002:
            txt = '该用户曾经存在但现在处于失效状态';
            break;
        case 10003:
            txt = '数据库内部错误';
            break;
        case 10004:
            txt = '目标用户信息不正确';
            break;
    }
    return txt
}

module.exports = {formatError};