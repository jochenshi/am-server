/**
 * Created by admin on 2018/1/4.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const user = require('./user');
const select = require('./select_list');

const operation = require('./operate_record');
/**
 * 得到分配使用的选项参数
 */
const getAssignParam = async (res)=>{
    let temp,code;
    try {
        let data = await select.getAssignSelect();
        let users = await user.getNoSuperUser();
        users = users.map((item)=>{
            return {value : item.id, text : item.name}
        });
        data['users'] = users;
        res.send(methods.formatRespond(true, 200, '',data));
    } catch (err) {
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 添加使用记录
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const addUseRecord = async (param,res)=>{
    let flag = true;
    try {
        await model.use_record.create({
            relatedId : param.relatedId,
            relatedType : param.relatedType,
            userId : param.userId,
            purpose : param.purpose || null,
            project : param.project,
            lendTime : new Date(),
            lendNumber : param.lendNumber,
            lendDetail : param.lendDetail,
            valid : param.valid
        });
        addAssignParamSelect(param);
    } catch (err) {
        flag = false;
    }
    return flag;
}

/**
 * 分配机器或普通配件
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const assign = async (param, res)=>{
    let temp,code,flag,operateType;
    try {
        switch(param.relatedType){
            case 'machine':
                operateType = 'assignMachine';
                await model.machine.update({
                    useState : 'using'
                },{
                    'where':{ id: param.relatedId }
                });
                /*let fitIds = await model.machine_fitting.findAll({
                    where : {
                        machineId : param.relatedId
                    }
                })
                for(let k=0;k<fitIds.length;k++){
                    await addUseRecord({
                        relatedId : fitIds[k]['fittingId'],
                        relatedType : 'fitting',
                        userId : param.userId,
                        purpose : param.purpose,
                        project : param.project,
                        lendTime : new Date(),
                        lendNumber : 1,
                        lendDetail : '关联的机器被分配'
                    });
                }*/
                break;
            case 'fitting':
                operateType = 'assignNormalEquip';
                await model.fitting.update({
                    useState : 'using'
                },{
                    'where':{ id: param.relatedId }
                });
                break;
        }
        param['lendNumber'] = 1;
        param['valid'] = true;
        flag = await addUseRecord(param);
        if(flag){
            let operateParam = {
                type: operateType,
                operatorId: methods.getUserId(res),
                userId: param.userId,
                number: param.lendNumber,
                operateStatus: flag
            };
            if (param.relatedType === 'machine') {
                operateParam.machineId = param.relatedId
            } else if (param.relatedType === 'fitting') {
                operateParam.fittingId = param.relatedId
            }
            await operation.handleOperateRecord(operateParam);
            res.send(methods.formatRespond(true, 200));
        }else{
            code = 13301;
            temp = methods.formatRespond(false, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 添加生成的选项
 * @param param
 */
const addAssignParamSelect = (param)=>{
    select.addSelectParam({code : 'S0019',value: param.project});
}

/**
 * 收回机器或普通配件
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const withdraw = async (param,res)=>{
    let temp,code,operateType,flag = true;
    try {
        switch(param.relatedType){
            case 'machine':
                operateType = 'assignMachine';
                await model.machine.update({
                    useState : 'idle'
                },{
                    'where':{ id: param.relatedId }
                });
                /*let fitIds = await model.machine_fitting.findAll({
                    where : {
                        machineId : param.relatedId
                    }
                })
                for(let k=0;k<fitIds.length;k++){
                    await model.use_record.update({
                        returnTime : new Date(),
                        returnNumber : 1,
                        returnDetail : '关联的机器被收回'
                    },{
                        'where':{
                            relatedId: fitIds[k]['fittingId'],
                            relatedType: 'fitting',
                            returnTime: null
                        }
                    });
                }*/
                break;
            case 'fitting':
                operateType = 'assignNormalEquip';
                await model.fitting.update({
                    useState : 'idle'
                },{
                    'where':{ id: param.relatedId }
                });
                break;
        }
        await model.use_record.update({
            returnTime : new Date(),
            returnNumber : 1,
            valid : false,
            returnDetail : param.returnDetail
        },{
            'where':{
                relatedId: param.relatedId,
                relatedType: param.relatedType,
                returnTime: null
            }
        });
        let operateParam = {
            type: operateType,
            operatorId: methods.getUserId(res),
            userId: param.userId,
            number: 1,
            operateStatus: flag
        };
        if (param.relatedType === 'machine') {
            operateParam.machineId = param.relatedId
        } else if (param.relatedType === 'fitting') {
            operateParam.fittingId = param.relatedId
        }
        await operation.handleOperateRecord(operateParam);
        res.send(methods.formatRespond(true, 200));
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 分配耗材
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const assignEquip = async (param, res)=>{
    let temp,code,useState,flag;
    try {
        let part = await model.part.findOne({
            where : {
                id : param.relatedId
            }
        });
        part = part ? part['dataValues']:'';
        if(!part) return;
        if(param.lendNumber>part.remainNumber){
            code = 13300;
            temp = methods.formatRespond(false, code,  errorText.formatError(code));
            res.status(400).send(temp);
            return;
        }else if(param.lendNumber==part.remainNumber){
            useState = 'using';
        }
        else if(param.lendNumber<part.remainNumber){
            useState = 'partusing';
        }
        await model.part.update({
            remainNumber : part.remainNumber - param.lendNumber,
            useState : useState
        },{
            where :{
                id : param.relatedId
            }
        });
        param['valid'] = true;
        flag = await addUseRecord(param);
        if(flag){
            let operateParam = {
                type: 'assignSupplyEquip',
                operatorId: methods.getUserId(res),
                partId: param.relatedId,
                userId: param.userId,
                number: param.lendNumber,
                operateStatus: flag
            };
            await operation.handleOperateRecord(operateParam);
            res.send(methods.formatRespond(true, 200));
        }else{
            code = 13301;
            temp = methods.formatRespond(false, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 收回耗材
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const withdrawEquip = async(param, res)=>{
    let temp,code,useState,record = param.record,validFlag;
    let returnNumber = record.returnNumber||0;
    try {
        let part = await model.part.findOne({
            where : {
                id : record.relatedId
            }
        });
        part = part ? part['dataValues']:'';
        if(!part) return;
        let remainNumber = param.returnNumber+part.remainNumber;
        let realReturnNumber = returnNumber+param.returnNumber;
        if(realReturnNumber>record.lendNumber){
            code = 13302;
            temp = methods.formatRespond(false, code,  errorText.formatError(code));
            res.status(400).send(temp);
            return;
        }else if(realReturnNumber==record.lendNumber){
            validFlag = false;
        }else if(realReturnNumber<record.lendNumber){
            validFlag = true;
        }
        if(remainNumber>part.number){
            code = 13303;
            temp = methods.formatRespond(false, code,  errorText.formatError(code));
            res.status(400).send(temp);
            return;
        }else if(remainNumber==part.number){
            useState = 'idle';
        }
        else if(remainNumber<part.number){
            useState = 'partusing';
        }
        await model.part.update({
            remainNumber : remainNumber,
            useState : useState
        },{
            where :{
                id : record.relatedId
            }
        });

        await model.use_record.update({
            returnTime : new Date(),
            returnNumber : returnNumber + param.returnNumber,
            returnDetail : param.returnDetail,
            valid: validFlag
        },{
            'where':{
                id : record.id
            }
        });
        let operateParam = {
            type: 'withdrawSupplyEquip',
            operatorId: methods.getUserId(res),
            partId: record.relatedId,
            userId: record.userId,
            number: param.returnNumber,
            operateStatus: true
        };
        await operation.handleOperateRecord(operateParam);
        res.send(methods.formatRespond(true, 200));
    } catch (err) {
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 得到耗材没有完全归还的使用记录
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const getPartNotAllReturn = async (param, res)=>{
    let temp,code;
    try {
        let sql = `
        SELECT 
        use_record.* ,
        users.name AS name 
        FROM use_record AS use_record 
        LEFT OUTER JOIN user AS users ON use_record.userId = users.id
        WHERE relatedType='part' AND relatedId=? AND 
        (lendNumber!=returnNumber OR returnNumber is NULL) 
        ;
        `;
        let data = await model.sequelize.query(sql,{
            replacements : [param.partId]
        });
        res.send(methods.formatRespond(true, 200, '',data[0]));
    } catch (err) {
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 获取使用记录
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const getUseRecord = async (param,res)=>{
    switch(param.action){
        case 'partNoReturn':
            getPartNotAllReturn(param,res);
            break;
    }
}
module.exports = {
    getAssignParam,assign,withdraw,
    assignEquip,withdrawEquip,
    getPartNotAllReturn,getUseRecord
}