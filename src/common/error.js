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
            txt = '内部错误';
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
        case 10008:
            txt = '您不具备该权限，请联系管理员';
            break;
        case 10009:
            txt = '所传参数不正确或者操作非法';
            break;
        //配件模块的错误信息
        case 12000:
            txt = '配件S/N号或名称已经存在';
            break;
        case 12001:
            txt = '必填参数不能为空';
            break;
        case 12002:
            txt = '未传入机器的ID';
            break;
        case 12003:
            txt = '已经存在相同名称或S/N号的配件';
            break;
        case 12004:
            txt = '已经存在相同名称的配件';
            break;
        /**
         * 其余模块的报错
         * 选项的报错文本
         */
        case 13000:
            txt = '已存在相同的选项值或选项文本';
            break;
        case 13001:
            txt = '已存在相同代号或名称的选项';
            break;
        case 13002:
            txt = '机器或配件参数不正确';
            break;
        case 13004:
            txt = '机器配件关联添加失败';
            break;
        case 13005:
            txt = '所传参数为空或者非法';
            break;
        case 13006:
            txt = '解除配件机器关联关系失败';
            break;
        /**
         * 机器报错文本
         */
        case 13100:
            txt = '已存在相同的机器S/N号、研发部编号或固定资产编号';
            break;
        case 13101:
            txt = '归属信息记录错误且删除机器信息失败';
            break;
        case 13102:
            txt = '该机器的地址信息已存在';
            break;
        /**
         * 归属报错文本
         */
        case 13200:
            txt = '记录归属信息时出错';
            break;
        case 13201:
            txt = '修改归属信息时出错';
            break;
        case 13300:
            txt = '使用数量已大于剩余数量';
            break;
    }
    return txt
}

module.exports = {formatError};
