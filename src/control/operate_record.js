//用户操作记录模块
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

const logger = require('../config/log')

//对用户在系统进行的操作进行记录,obj中的参数包含: type,userId,operatorId,machineId,fittingId,partId,comment
const handleOperateRecord = async (obj, res) => {
    let flag = true, code, temp;
    try {
        let judged = verifyDada(obj);
        if (judged.flag) {
            let addFlag = await addRecord(judged.data, res);
            if (!addFlag.flag) {
                flag = false;
                code = addFlag.code;
            }
        } else {
            flag = false;
            code = judged.code;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            logger.error('###add operate record error:###' + JSON.stringify(temp) + '###message end###');
        }
        
        //res.status(400).send(temp);
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        logger.error('###add operate record error:###' + err.message + ';' + err.name + '###message end###');
        //res.status(400).send(temp);
    };
    return flag
}

const verifyDada = (obj) => {
    let flag = true, code, data = {};
    //operatorId生成这条操作记录的人，userId当前记录涉及到的对象
    let {type, userId = [], operatorId, machineId = [], fittingId = [], number, partId = [], comment, operateStatus = true} = obj;
    if (!type || !operatorId) {
        flag = false;
        code = 13012;
    } else {
        machineId = methods.changeStringToArray(machineId);
        userId = methods.changeStringToArray(userId);
        fittingId = methods.changeStringToArray(fittingId);
        partId = methods.changeStringToArray(partId);
        data = {
            type,
            machineId: machineId.length ? JSON.stringify(machineId) : null,
            fittingId: fittingId.length ? JSON.stringify(fittingId) : null,
            partId: partId.length ? JSON.stringify(partId) : null,
            userId: userId.length ? JSON.stringify(userId) : null,
            number: number ? number : null,
            operatorId: operatorId,
            occurTime: Date.now(),
            operateStatus: operateStatus,
            comment: comment || null
        }
    };
    return {flag, data, code}
}

const addRecord = async (obj, res) => {
    let flag = true, code, temp;
    let record = await model.operation_record.create(obj);
    // let record = await model.operation_record.findAll({
    //     where: {
    //         id: recordd.dataValues.id
    //     }
    // })
    //判断传进的参数是否有machine
    if (obj.machineId) {
        let machine = await model.machine.findAll({
            where: {
                id: JSON.parse(obj.machineId)
            }
        });
        if (machine.length) {
            await record.addMachines(machine)
        } else {
            flag = false;
            code = 13008;
        }
    }
    //判断传进的数据是否有fitting
    if (flag && obj.fittingId){
        let fitting = await model.fitting.findAll({
            where: {
                id: JSON.parse(obj.fittingId)
            }
        });
        if (fitting.length) {
           await record.addFittings(fitting)
        } else {
            flag = false;
            code = 13009;
        }
    }
    //判断传进的参数是否有part
    if (flag && obj.partId) {
        let part = await model.part.findAll({
            where: {
                id: JSON.parse(obj.partId)
            }
        });
        if (part.length) {
            await record.addParts(part);
        } else {
            flag = false;
            code = 13010;
        }
    }
    //判断传进的参数是否有userId
    if (flag && obj.userId) {
        let user = await model.user.findAll({
            where: {
                id: JSON.parse(obj.userId)
            }
        });
        if (user.length) {
            await record.addUsers(user);
        } else {
            flag = false;
            code = 13011;
        }
    }
    return {flag, code};
}

//根据传进的参数判断是否需要建立关系
const judgeRelate = async (tableName, idArr) => {

}

module.exports = {
    handleOperateRecord
}