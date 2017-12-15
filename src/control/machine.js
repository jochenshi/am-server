/**
 * Created by admin on 2017/12/11.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const ascription = require('./ascription');
const selectControl = require('./select_list');

/**
 * 查询所有机器
 * @param res
 * @returns {Promise.<void>}
 */
const getMachineData = async (res) => {
    let temp;
    try {
        // verify whether the user existed before but is not valid now
        let data = await model.machine.findAll({
            'order':[
                ['name','ASC']
            ]
        });
        res.send(methods.formatRespond(true, 200, '',data));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 验证机器是否重复
 * @param param
 * @param res
 * @returns {Promise.<boolean>}
 */
verifyMachineExist = async(param,res)=>{
    let temp, hcode, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let machine = await model.machine.findAll({
            where: {
                $or: [
                    {
                        rdNumber: param.rdNumber
                    },
                    {
                        fixedNumber: param.fixedNumber
                    }
                ]
            }
        });

        if (machine.length) {
            flag = false;
            hcode = 13100;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return flag;
}

/**
 * 获取添加机器前的参数信息
 */
const getAddMachineParam = async (res)=>{
    let data = {
        rdCount : 0,
        rdbCount : 0
    }
    let rdCount = await model.machine.findAndCount({
        where : {
            rdNumber: {
                like: '%RD%'
            }
        }
    });
    data.rdCount = rdCount.count;
    let rdbCount = await model.machine.findAndCount({
        where : {
            rdNumber: {
                like: '%RDB%'
            }
        }
    });
    data.rdbCount = rdbCount.count;
    res && res.send(methods.formatRespond(true, 200, '',data));
    return data;
}

/**
 * 添加机器
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const addMachine = async (param,res) => {
    let flag = await verifyMachineExist(param,res),temp = '',hcode = '';
    if(!flag){
        return;
    }
    try{
        let machineData = await model.machine.create({
            serialNo : param.serialNo,
            name : param.name,
            rdNumber : param.rdNumber,
            fixedNumber : param.fixedNumber,
            type : param.type,
            model : param.model,
            brand : param.brand,
            location : param.location,
            useState : 'idle',
            createUser: 'id_61646d696e75736572',
            description: param.machineDesc
        });
        machineData = machineData.dataValues;
        param['relatedId'] = machineData.id;
        param['relatedType'] = 'machine';
        if(ascription.addAscription(param)){
            res && res.send(methods.formatRespond(true, 200));
            await addMachineSelect(param);
        }else{
            //删除此条machine
            flag = false;
            hcode = 13200;
            if(!await deleteMachine(param.relatedId)){
                hcode = 13101;
            }
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
        }
    }catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return flag;
}

/**
 * 添加机器相关的新增的选项信息
 */
const addMachineSelect = (param)=>{
    selectControl.addSelectParam({code : 'S0002',value: param.originObject,type: 'in'});
    selectControl.addSelectParam({code : 'S0003',value: param.targetObject,type: 'in'});
    selectControl.addSelectParam({code : 'S0005',value: param.model});
    selectControl.addSelectParam({code : 'S0006',value: param.brand});
}

/**
 *
 * @param id
 * @param res
 * @returns {Promise.<void>}
 */
const deleteMachine = async (id) => {
    let flag = true;
    try{
        await model.select_list.destroy({
            'where':{
                id: id
            }
        });
    }catch(err){
        console.log(err);
        flag = false;
    }
    return flag;
}

module.exports = {
    getMachineData, getAddMachineParam, addMachine, deleteMachine
}