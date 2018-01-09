const models = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const handleRelateAdd = async (req, res) => {
    let {machineId, fittingId = []} = req.body, flag = true;
    let ret = await addRelate({machineId, fittingId}, res);
    if (ret) {
        res.send(methods.formatRespond(flag, 200 , ''))
    }
};

//将机器跟配件进行关联，此处的关联只对普通类型的配件跟机器进行关联,建立关联关系的时候机器与配件是一对多的关系
//可以同时为多个配件建立关系
const addRelate = async (obj, res) => {
    let {machineId, fittingId = []} = obj, flag = true, code, temp;
    try {
        if (Object.prototype.toString.call(fittingId) !== '[object Array]') {
            let arr = [];
            arr.push(fittingId);
            fittingId = arr;
        };
        if (!machineId || !fittingId.length) {
            flag = false;
            code = 13002;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            let existRelate = await models.machine_fitting.findAll({
                where: {
                    fittingId: fittingId,
                    valid: true
                }
            });
            if (existRelate.length) {
                flag = false;
                code = 13007;
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
                if (machine.length && fit.length && (fit.length === fittingId.length)) {
                    //传入的ID均为真实有效的ID,valid为true表示为有效的记录，false表示历史的记录
                    let createData = [];
                    fittingId.forEach((val) => {
                        createData.push(
                            {
                                machineId,
                                fittingId: val,
                                valid: true
                            }
                        )
                    })
                    await models.machine_fitting.bulkCreate(createData);
                    flag = await modifyNormalLinkState({fittingId, linkState: true}, res);
                    //flag = await modifyNormalUseState({fittingId, useState: 'fixedusing'}, res)
                } else {
                    //根据传入的ID，查询不到相关信息
                    flag = false;
                    code = 13002;
                    temp = methods.formatRespond(flag, code, errorText.formatError(code));
                    res.status(400).send(temp);
                }
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

//执行取消关联的操作的入口的方法
const handleDelete = async (req, res) => {
    let flag = true, code, temp;
    try {
        let {target, data = []} = req.body;
        if (Object.prototype.toString.call(data) !== '[object Array]') {
            let arr = [];
            arr.push(data);
            data = arr;
        };
        if (!target || !data.length) {
            flag = false;
            code = 13005;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            await deleteRelate({target, data}, res);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//取消机器与普通配件的关联
//入参的格式{target: 'machine/fitting', data: []}
const deleteRelate = async ({target = 'fitting', data = []}, res) => {
    let flag = true, code, temp;
    try {
        if (data.length) {
            let dataType;
            switch (target) {
                case 'machine':
                    dataType = 'machineId'
                    break;
                case 'fitting':
                default:
                    dataType = 'fittingId'
                    break;
            };
            let result = await handleDeleteData(dataType, data);
            flag = result.flag;
            code = result.code;
            if (flag) {
                flag = await modifyNormalLinkState({fittingId: data}, res)
            }
        } else {
            //传入的数据为空
            flag = false;
            code = 13005;
        };
        if (!flag) {
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            res.send(methods.formatRespond(flag, 200, ''));
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    };
    return flag;
}

//具体的修改数据表中配件机器关联状态的操作
const handleDeleteData = async (target, data) => {
    let flag = true, code;
    let find_list = await models.machine_fitting.findAll({
        where: {
            [target]: {
                [Op.or]: [data]
            },
            valid: true
        }
    });
    if (find_list.length === data.length) {
        //查询到的更改数目一致，执行更改数据的操作
        let lists = await models.machine_fitting.update(
            {
                valid: false
            },
            {
                where: {
                    fittingId: {
                        [Op.or]: [data]
                    }
                }
            }
        );
    } else {
        //两个数据不一致
        flag = false;
        code = 13006;
    };
    return {flag, code}
}

//修改普通配件的使用状态为
const modifyNormalUseState = async (obj, res) => {
    let flag = true, code, temp;
    try {
        let {fittingId = [], useState = 'fixedusing'} = obj;
        if (Object.prototype.toString.call(fittingId) !== '[object Array]') {
            let arr = [];
            arr.push(fittingId);
            fittingId = arr;
        };
        await models.fitting.update(
            {
                useState: useState
            },
            {
                where: {
                    id: [fittingId]
                }
            }
        );
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    };
    return flag;
}

//修改普通配件的关联状态
const modifyNormalLinkState = async (obj, res) => {
    let flag = true, code, temp;
    try {
        let {fittingId = [], linkState = false} = obj;
        if (Object.prototype.toString.call(fittingId) !== '[object Array]') {
            let arr = [];
            arr.push(fittingId);
            fittingId = arr;
        };
        await models.fitting.update(
            {
                linkState: linkState
            },
            {
                where: {
                    id: [fittingId]
                }
            }
        );
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    };
    return flag;
}

module.exports = {
    handleRelateAdd,addRelate, deleteRelate, handleDelete
}