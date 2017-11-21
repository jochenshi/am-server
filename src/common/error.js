//error code range
/*1.用户模块: 10000-10999
2.机器模块: 11000-11999
3.配件模块: 12000-12999
4.其余模块：13000-13999 */
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
        case 13000:
            txt = '已存在相同的选项值或选项文本';
            break;
        case 13001:
            txt = '已存在相同代号或名称的选项';
            break;
    }
    return txt
}

module.exports = {formatError};
