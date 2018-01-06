const models = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');

//将机器跟配件进行关联，此处的关联只对普通类型的配件跟机器进行关联
const addRelate = async (obj, res) => {
    let {machineId, fittingId} = obj, flag = true, code, temp;
    try {
        if (!machineId || !fittingId) {
            flag = false;
            code = 13002;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            let machine = await models.machine.findAll({
                where: {
                    id: machineId
                }
            });
            let fit = await models.fitting.findAll({
                where: {
                    id: fittingId
                }
            });
            if (machine.length && fit.length) {
                //传入的ID均为真实有效的ID,valid为true表示为有效的记录，false表示历史的记录
                await models.machine_fitting.create({
                    machineId,
                    fittingId,
                    valid: true
                });
            } else {
                //根据传入的ID，查询不到相关信息
                flag = false;
                code = 13002;
                temp = methods.formatRespond(flag, code, errorText.formatError(code));
                res.status(400).send(temp);
            }
        }
    } catch (err) {
        code = 13004;
        flag = false;
        temp = methods.formatRespond(flag, code, errorText.formatError(code));
        res.status(400).send(temp);
    };
    return flag;
}

//取消机器与普通配件的关联
const deleteRelate = async (obj, res) => {

}

module.exports = {
    addRelate, deleteRelate
}