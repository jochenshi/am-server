const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const operation = require('../control/operate_record');

//添加机器的附加信息的请求
const addExtra = async (req, res) => {
    let flag = true, code, temp;
    try {
        let {title, content, targetId, type} = req.body;
        if (!title || !content || !targetId || !type) {
            flag = false;
            code = 13104;
            temp = errorText.formatError(code);
            res.status(400).send(methods.formatRespond(flag, code, temp))
        } else {
            flag = await verifyExtraExist({targetId, content, type}, res);
            if (flag) {
                let userId = methods.getUserId(req);
                let extraAdd = await model.extra.create({
                    relatedId: targetId,
                    relatedType: type,
                    name: title,
                    value: content,
                    valid: true,
                    createUser: userId
                });
                let operateParam = {
                    type: 'addMachineExtra',
                    operatorId: userId,
                    machineId: extraAdd.id,
                    number: 1,
                    operateStatus: flag
                };
                await operation.handleOperateRecord(operateParam);
                res.send(methods.formatRespond(flag, 200, ''))
            }
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//获取附加信息的请求
const getExtra = async (req, res) => {
    let flag = true, code, temp;
    try {
        let {type, relatedId} = req.query, arg = {};
        if (type) {
            arg['relatedType'] = type
        };
        if (relatedId) {
            arg['relatedId'] = relatedId
        }
        let data = await model.extra.findAll({
            where: arg,
            include: [
                {
                    model: model.user,
                    as: 'users'
                }
            ]
        });
        let returnData = JSON.parse(JSON.stringify(data));
        if (returnData.length) {
            returnData.forEach(val => {
                val['key'] = val.id;
                val['title'] = val.name;
                val['content'] = val.value;
                val.createUser = val.users.name;
                val.createTime = val.createdAt;
                delete val.users;
            })
        }
        res.send(methods.formatRespond(flag, 200, '', returnData))
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//修改附加信息的请求
const modifyExtra = async (req, res) => {
    let flag = true, code, temp;
    try {
        let {id} = req.params;
        let {title, content} = req.body;
        if (!id || !title || !content) {
            flag = false;
            return
        }
        let select = await model.extra.findAll({
            where: {
                id: id
            }
        });
        // if (select.length = 0) {
        //     flag = false;
        //     code = 13105;
        //     temp = errorText.formatError(code);
        //     res.status(400).send(methods.formatRespond(flag, code, temp))
        // }
        let updated = await model.extra.update({
            name: title,
            value: content
        },{
            where: {
                id: id
            }
        });
        if (updated[0] === 0) {
            flag = false;
            code = 13105;
            temp = errorText.formatError(code);
            res.status(400).send(methods.formatRespond(flag, code, temp))
        } else {
            let userId = methods.getUserId(req);
            let operateParam = {
                type: 'modifyMachineExtra',
                operatorId: userId,
                machineId: select[0].relatedId,
                number: 1,
                operateStatus: flag
            };
            await operation.handleOperateRecord(operateParam);
            res.send(methods.formatRespond(flag, 200, ''))
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

const verifyExtraExist = async ({targetId, content, type},res) => {
    let flag = true, code, temp;
    try {
        let extra = await model.extra.findAll({
            where: {
                relatedId: targetId,
                value: content,
                relatedType: type
            }
        });
        if (extra.length) {
            flag = false;
            code = 13103;
            temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
            res.status(400).send(temp);
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag
}

module.exports = {
    addExtra, getExtra, modifyExtra
}