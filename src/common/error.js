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
        case 10005:
            txt = '账号或密码不能为空';
            break;
        case 10006:
            txt = '账号或密码不正确';
            break;
        case 10007:
            txt = '用户登录无效，请重新登录';
            break;
        //配件模块的错误信息
        case 12000:
            txt = '';
            break;
        /**
         * 选项的报错文本
         */
        case 13000:
            txt = '已存在相同的选项值或选项文本';
            break;
        case 13001:
            txt = '已存在相同代号或名称的选项';
            break;
        /**
         * 机器报错文本
         */
        case 13100:
            txt = '已存在相同的机器S/N号或研发部编号';
            break;
        case 13101:
            txt = '归属信息记录错误且删除机器信息失败';
            break;
        /**
         * 归属报错文本
         */
        case 13200:
            txt = '记录归属信息时出错';
            break;
    }
    return txt
}

module.exports = {formatError};
