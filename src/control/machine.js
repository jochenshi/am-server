/**
 * Created by admin on 2017/12/11.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const ascription = require('./ascription');
const selectControl = require('./select_list');

const MACHINE_HEALTHSTATE_SQL = `SELECT 
health.healthState,machine.name 
FROM 
machine , health 
INNER JOIN (SELECT 
    MAX(h.createdAt) AS c FROM health h, machine m 
    WHERE 
    m.id = h.relatedId AND h.relatedType = 'machine'
    ) A on health.createdAt = A.c
;`;

`SELECT 
machine.name, 
IFNULL((SELECT MAX(h.createdAt) FROM health h,machine m WHERE m.id=h.relatedId),'noRecord') AS healthState
FROM 
health , machine
;`

`SELECT health.healthState FROM health,machine WHERE machine.id=health.relatedId ORDER BY health.createdAt LIMIT 1;
`
`SELECT 
IFNULL((
    SELECT healthState 
    FROM health h,machine m 
    WHERE h.createdAt = (
        SELECT MAX(hh.createdAt) 
        FROM health hh,machine mm 
        WHERE hh.relatedType='machine' AND hh.relatedId=mm.id) 
    AND m.id=h.relatedId AND h.relatedType='machine'),
    'noRecord') 
AS healthState , machine.name
FROM machine;`

const ALL_MACHINE_SQL = `SELECT 
IFNULL((SELECT a.address FROM address a, machine m WHERE m.id=a.machineId AND a.type='ip'),NULL) AS ip ,
machine.serialNo , 
machine.name , 
machine.rdNumber , 
machine.fixedNumber , 
machine.type , 
machine.model , 
machine.brand , 
machine.cpu , 
machine.createdAt , 
machine.description , 
user.account as account , 
select_list.text as type_text 
FROM machine,user,select_list 
WHERE 
machine.useState!='destory' AND 
machine.createUser = user.id AND 
machine.type = select_list.value AND select_list.code = 'S0004'
;`
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

module.exports.getMachineData = getMachineData;
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

module.exports.getAddMachineParam = getAddMachineParam;

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

module.exports.addMachine = addMachine;

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

module.exports.deleteMachine = deleteMachine;