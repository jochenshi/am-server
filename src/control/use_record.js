/**
 * Created by admin on 2018/1/4.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const user = require('./user');
const select = require('./select_list');
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
 * 分配机器或普通配件
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const assign = async (param, res)=>{
    let temp,code;
    try {
        switch(param.relatedType){
            case 'machine':
                await model.machine.update({
                    useState : 'using'
                },{
                    'where':{ id: param.relatedId }
                });
                break;
            case 'fitting':
                await model.fitting.update({
                    useState : 'using'
                },{
                    'where':{ id: param.relatedId }
                });
                break;
        }
        await model.use_record.create({
            relatedId : param.relatedId,
            relatedType : param.relatedType,
            userId : param.userId,
            purpose : param.purpose,
            project : param.project,
            lendTime : new Date(),
            lendNumber : 1,
            lendDetail : param.lendDetail
        });
        res.send(methods.formatRespond(true, 200));
        addAssignParamSelect(param);
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
    let temp,code;
    try {
        switch(param.relatedType){
            case 'machine':
                await model.machine.update({
                    useState : 'idle'
                },{
                    'where':{ id: param.relatedId }
                });
                break;
            case 'fitting':
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
            returnDetail : param.returnDetail
        },{
            'where':{
                relatedId: param.relatedId,
                relatedType: param.relatedType,
                returnTime: null
            }
        });
        res.send(methods.formatRespond(true, 200));
    } catch (err) {
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
    let temp,code,useState;
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
        await model.use_record.create({
            relatedId : param.relatedId,
            relatedType : param.relatedType,
            userId : param.userId,
            purpose : param.purpose,
            project : param.project,
            lendTime : new Date(),
            lendNumber : param.lendNumber,
            lendDetail : param.lendDetail
        });
        res.send(methods.formatRespond(true, 200));
        addAssignParamSelect(param);
    } catch (err) {
        code = 10003;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

module.exports = {
    getAssignParam,assign,withdraw,
    assignEquip
}