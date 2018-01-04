const models = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');
const config = require('../config/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const ascription = require('./ascription');
const selectControl = require('./select_list');

/* 
提供的方法的说明：
1.获取配件的方法：可指定机器的ID，普通配件的类型；
2.添加普通配件的方法；
3.修改普通配件的方法(未完成)
*/

//获取普通类型的配件的方法，此方法可以指定查询的机器的ID，可以指定获取配件的类型
const handleNormalGet = async (req, res) => {
    let flag = true, code, temp, fit = [];
    try {
        let {equipType = 'all', machineId} = req.query;
        let arg = equipType === 'all' ? {} : {where: {type: equipType}};
        //先判断是否传入machineId，如果传入了则查找与该ID相关的配件的数据,machineId可以传单个也可以传多个
        if (machineId) {
            //传入了Id的情况下进行相关数据的获取
            let gFlag = await getNormalInMachine(req, res);
            if (!gFlag) {
                return
            }
        } else {
            //此处是不根据传入的机器的id进行相关配件信息的获取
            fit = await models.fitting.findAll({
                arg,
                include: [
                    {
                        model: models.user,
                        as: 'users',
                        attributes: ['name', 'id']
                    },
                    {
                        model: models.select_list,
                        as: 'selectType',
                        attributes: ['code', 'name', 'text','id']
                    },
                    {
                        model: models.select_list,
                        as: 'selectState',
                        attributes: ['code', 'name', 'text','id']
                    },
                    {
                        model: models.ascription,
                        as: 'ascription',
                        attributes: ['id','outInType','originObject','targetObject','relatedType','occurTime','description']
                    }
                ]
            });
        }
        //解除引用关系
        let temps = JSON.parse(JSON.stringify(fit));
        if (temps.length) {
            for (let i = 0; i < temps.length; i++) {
                let temp_fit = temps[i];
                temp_fit['key'] = temp_fit.id;
                temp_fit['creator'] = temp_fit.users.name;
                temp_fit['equipType'] = temp_fit.selectType.text;
                temp_fit['equipUseState'] = temp_fit.selectState.text;
                temp_fit['outInType'] = temp_fit.ascription.outInType;
                temp_fit['originObject'] = temp_fit.ascription.originObject;
                temp_fit['targetObject'] = temp_fit.ascription.targetObject;
                temp_fit['relatedType'] = temp_fit.ascription.relatedType;
                temp_fit['occurTime'] = temp_fit.ascription.occurTime;
                temp_fit['ascDesc'] = temp_fit.ascription.description;
                temp_fit['ascriptionId'] = temp_fit.ascription.id;
                delete temp_fit.selects;
                delete temp_fit.users;
                delete temp_fit.selectState;
                delete temp_fit.selectType;
            }
        }
        console.log('....', temps);
        res.send(methods.formatRespond(flag, 200, '', temps))

    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//获取指定的机器下的配件的方法，此方法需要传入机器的Id，
const getNormalInMachine = async (req, res) => {
    let flag = true, code, temp, return_res = [];
    try {
        let {equipType = 'all', machineId} = req.query;
        //machineId = [1,2];
        if (!machineId) {
            flag = false;
            code = 12002
            res.send(methods.formatRespond(flag, code, errorText.formatError(code), return_res))
        } else {
            //需要判断获取到的机器的id,根据传入的机器的Id进行相关信息的查询
            let idTag = Array.isArray(machineId);
            let arg = equipType === 'all' ? {} : {where: {type: equipType}};
            if (!idTag) {
                let tArray = new Array();
                tArray.push(machineId);
                machineId = tArray;
            };
            let result = await models.machine_fitting.findAll({
                where: {
                    machineId: machineId
                },
                include: [
                    {
                        model: models.fitting,
                        as: 'parentFitting',
                        //此处可以进行针对配件类型的筛选
                        arg,
                        include: [
                            {
                                model: models.user,
                                as: 'users',
                                attributes: ['name', 'id']
                            },
                            {
                                model: models.select_list,
                                as: 'selectType',
                                attributes: ['code', 'name', 'text','id']
                            },
                            {
                                model: models.select_list,
                                as: 'selectState',
                                attributes: ['code', 'name', 'text','id']
                            },
                            {
                                model: models.ascription,
                                as: 'ascription',
                                attributes: ['id','outInType','originObject','targetObject','relatedType','occurTime','description']
                            }
                        ]
                    }
                ]
            });
            let result_obj = JSON.parse(JSON.stringify(result));
            if (result_obj.length) {
                for (let i = 0; i < result_obj.length; i++) {
                    let tt_obj = result_obj[i].parentFitting;
                    tt_obj['key'] = tt_obj.id;
                    tt_obj['creator'] = tt_obj.users.name;
                    tt_obj['equipType'] = tt_obj.selectType.text;
                    tt_obj['equipUseState'] = tt_obj.selectState.text;
                    tt_obj['outInType'] = tt_obj.ascription.outInType;
                    tt_obj['originObject'] = tt_obj.ascription.originObject;
                    tt_obj['targetObject'] = tt_obj.ascription.targetObject;
                    tt_obj['relatedType'] = tt_obj.ascription.relatedType;
                    tt_obj['occurTime'] = tt_obj.ascription.occurTime;
                    tt_obj['ascDesc'] = tt_obj.ascription.description;
                    tt_obj['ascriptionId'] = tt_obj.ascription.id;
                    delete tt_obj.selectState;
                    delete tt_obj.selectType;
                    delete tt_obj.users;
                    return_res.push(tt_obj);
                }
            }
            console.log(result);
            res.send(methods.formatRespond(flag, 200, '', return_res));
        }
        
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag
}

//添加普通类型配件的请求的方法
const handleNormalAdd = (req, res) => {
    console.log(req.body);
    //req.body为添加的参数，req.query为接在请求后面的参数
    verifyNormal(req, res);
};

//修改普通类型的配件的方法
const handleNormalModify = (req, res) => {
    console.log(req.body);
    let flag = true, code, temp;
    let {id} = req.params;
    let {serialNo, name, type, model, brand, size, unit, useState, description} = req.body;
    if (!id ||!serialNo || !name || !type || !model || !brand) {
        //修改传过来的参数必填校验不通过
        flag = false;
        code = 12001;
        temp = methods.formatRespond(flag, code, errorText.formatError(code));
        res.status(400).send(temp);
    } else {
        //必选参数校验通过,执行查找然后修改
        // let equip = await models.equip.findAll({
        //     where: {
        //         id: id
        //     }
        // });
        executeNormalModify(req, res);

    }
}

/* 
耗材类配件的相关的方法
*/
//获取耗材类配件的方法
const handleSupplyGet = async (req, res) => {
    let flag = true, code, temp, part = [];
    try {
        part =  await models.part.findAll({
            include: [
                {
                    model: models.user,
                    as: 'users',
                    attributes: ['name', 'id']
                },
                {
                    model: models.select_list,
                    as: 'selectType',
                    attributes: ['code', 'name', 'text','id']
                },
                {
                    model: models.select_list,
                    as: 'selectState',
                    attributes: ['code', 'name', 'text','id']
                },
                {
                    model: models.ascription,
                    as: 'ascription',
                    attributes: ['id','outInType','originObject','targetObject','relatedType','occurTime','description']
                }
            ]
        });
        //解除引用关系
        let temps = JSON.parse(JSON.stringify(part));
        if (temps.length) {
            for (let i = 0; i < temps.length; i++) {
                let temp_fit = temps[i];
                temp_fit['key'] = temp_fit.id;
                temp_fit['creator'] = temp_fit.users.name;
                temp_fit['equipType'] = temp_fit.selectType.text;
                temp_fit['equipUseState'] = temp_fit.selectState.text;
                temp_fit['outInType'] = temp_fit.ascription.outInType;
                temp_fit['originObject'] = temp_fit.ascription.originObject;
                temp_fit['targetObject'] = temp_fit.ascription.targetObject;
                temp_fit['relatedType'] = temp_fit.ascription.relatedType;
                temp_fit['occurTime'] = temp_fit.ascription.occurTime;
                temp_fit['ascDesc'] = temp_fit.ascription.description;
                temp_fit['ascriptionId'] = temp_fit.ascription.id;
                temp_fit['createTime'] = temp_fit.ascription.occurTime;
                delete temp_fit.selects;
                delete temp_fit.users;
                delete temp_fit.selectState;
                delete temp_fit.selectType;
            }
        }
        console.log('....', temps);
        res.send(methods.formatRespond(flag, 200, '', temps))
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//添加耗材类配件的方法
const handleSupplyAdd = async (req, res) => {
    let flag = true, code, temp;
    try {
        let {origin, time, name, type, model, brand, number, description} = req.body || {};
        if (!origin || !time || !name || !type || !model || !brand || !number) {
            flag = false;
            code = 12001;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            let findPart = await models.part.findAll({
                where: {
                    name: name,
                    type: type
                }
            });
            if (findPart.length) {
                flag = false;
                code = 12004;
                temp = methods.formatRespond(flag, code, errorText.formatError(code));
                res.status(400).send(temp);
            } else {
                //所有参数均已获得，且同类型的不存在重复的名称，执行相关的添加的操作
                let userId = methods.getUserId(req);
                let createPart = await models.part.create({
                    name: name,
                    type: type,
                    model: model,
                    brand: brand,
                    number: number,
                    remainNumber: number,
                    useState: 'idle',
                    createUser: userId,
                    description: description || null
                });
                let addData = Object.assign({}, req.body, {userId});
                let asParam = {
                    relatedId: createPart.id,
                    relatedType: 'part',
                    outInType: origin,
                    occurTime: time,
                    originObject: addData.originObject || null,
                    targetObject: addData.targetObject || null,
                    operateUser: userId,
                    ascriptionDesc: addData.ascDesc || null
                };
                if (ascription.addAscription(asParam)) {
                    await findCreateSupplySelect(addData);
                    res.send(methods.formatRespond(true, 200));
                } else {
                    //设备归属信息添加失败，删除相应的配件的信息
                    flag = false;
                    code = 13200;
                    let deleteFlag = await executeSupplyDelete(createPart.id, res);
                    deleteFlag && res.status(400).send(methods.formatRespond(flag, code, errorText.formatError(code)));
                }
            }
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//修改耗材类配件的方法

//关于普通类型的配件的添加的验证
const verifyNormal = async (req, res) => {
    let {sourceType, serialNo, name, type, model, brand, size, unit, description} = req.body || {},
    flag = true, code, temp;
    try {
        if (!serialNo || !name || !type || !model || !brand) {
            flag = false;
            code = 12001;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            let findFit = await models.fitting.findAll({
                where: {
                    [Op.or]: [
                        {serialNo},
                        {name}
                    ]
                }
            });
            if (findFit.length) {
                flag = false;
                code = 12000;
                temp = methods.formatRespond(flag, code, errorText.formatError(code));
                res.status(400).send(temp);
            } else {
                //未检测到序列号或者名称重复的记录
                let userId = methods.getUserId(req, res);
                let addData = Object.assign({}, req.body, {userId});
                let equip_add = await executeNormalAdd(addData);
                if (equip_add.flag) {
                    let add_equip = equip_add.data;
                    let param = {
                        relatedId: add_equip.id,
                        relatedType: 'fitting',
                        outInType: addData.origin,
                        occurTime: add_equip.createTime,
                        originObject: addData.originObject || '',
                        targetObject: addData.targetObject || '',
                        operateUser: userId,
                        ascriptionDesc: addData.originDes || ''
                    };
                    if (ascription.addAscription(param)) {
                        await findCreateNormalSelect(addData);
                        res.send(methods.formatRespond(true, 200));
                    } else {
                        //设备归属信息添加失败，删除相应的配件的信息
                        flag = false;
                        code = 13200;
                        executeNormalDelete(add_equip.id);
                        res.status(400).send(methods.formatRespond(flag, code, errorText.formatError(code)));
                    }
                }
            }
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
};

//获取到正确格式的普通配件的数据的时候执行普通类型的数据的添加
//执行添加操作的时候，需要先判断类型，型号，品牌是否存在于选项表中，否则需要先执行在选项表中添加型号，品牌的操作
//此处是已经进行过重复性验证之后
const executeNormalAdd = async (obj, res) => {
    let flag = true, code, temp, data = {};
    try {
        data = await models.fitting.create({
            serialNo: obj.serialNo,
            name: obj.name,
            type: obj.type,
            model: obj.model,
            brand: obj.brand,
            size: obj.size || null,
            unit: obj.unit,
            useState: 'idle',
            createUser: obj.userId,
            createTime: Date.now(),
            description: obj.description || ''
        });
        // temp = methods.formatRespond(true, 200);
        // res.send(temp);
    } catch (err) {
        data = {};
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return {flag, data};
};

//判断添加配件的时候的型号，品牌是否存在，不存在则执行创建操作，存在则继续执行
const findCreateNormalSelect = async (param) => {
    await selectControl.addSelectParam({code : 'S0010',value: param.model});
    await selectControl.addSelectParam({code : 'S0011',value: param.brand});
}

//判断添加耗材类配件的时候的型号，品牌是否存在，不存在则执行创建操作，存在则继续执行
const findCreateSupplySelect = async (param) => {
    await selectControl.addSelectParam({code : 'S0017',value: param.model});
    await selectControl.addSelectParam({code : 'S0018',value: param.brand});
}

//执行数据库的因添加相关依赖失败，而删除普通类型的配件的方法
const executeNormalDelete = async (id) => {
    let flag = true;
    try {
        await models.fitting.destroy({
            where: {
                id: id
            }
        })
    } catch (err) {
        flag = false;
    }
}

//执行修改普通配件的操作
const executeNormalModify = async (req, res) => {
    let flag = true,code,temp;
    try {
        let {id} = req.params;
        let {serialNo, name, type, model, brand, size, unit, useState, description, originDes, ascriptionId} = req.body;
        let findFit = await models.fitting.findAll({
            where: {
                [Op.or]: [
                    {serialNo},
                    {name}
                ],
                [Op.not]: [
                    {id}
                ]
            }
        });
        if (findFit.length) {
            flag = false;
            code = 12003;
            res.status(400).send(methods.formatRespond(flag, code, errorText.formatError(code)));
        } else {
            let userId = methods.getUserId(req, res);
            let addData = Object.assign({}, req.body, {userId});
            await models.fitting.update({
                serialNo: serialNo,
                name: name,
                type: type,
                model: model,
                brand: brand,
                size: size || null,
                unit: unit,
                description: description || ''
            },{
                where: {
                    id: id
                }
            });
            let param = {
                outInType: addData.origin,
                occurTime: addData.time,
                originObject: addData.originObject || '',
                targetObject: addData.targetObject || '',
                ascriptionDesc: addData.originDes || '',
                ascriptionId: addData.ascriptionId
            };
            flag = await ascription.modifyAscription(param);
            if (flag) {
                await findCreateNormalSelect(addData);
                res.send(methods.formatRespond(true, 200));
            } else {
                flag = false;
                code = 13201;
                temp = methods.formatRespond(false, code, errorText.formatError(code));
                res.status(400).send(temp);
            }
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//执行数据库的因添加相关依赖失败，而删除耗材类型的配件的方法
const executeSupplyDelete = async (id, res) => {
    let flag = true;
    try {
        await models.fitting.destroy({
            where: {
                id: id
            }
        })
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag
}

module.exports = {
    handleNormalGet, handleNormalAdd, handleNormalModify,
    getNormalInMachine, handleSupplyAdd, handleSupplyGet
};