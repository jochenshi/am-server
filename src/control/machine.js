/**
 * Created by admin on 2017/12/11.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const ascription = require('./ascription');
const selectControl = require('./select_list');
const login = require('./login');

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

/*`SELECT
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
    FROM health h
    WHERE h.createdAt = (
        SELECT MAX(h.createdAt)
        WHERE h.relatedType='machine' AND h.relatedId=machine.id)
    AND machine.id=h.relatedId AND h.relatedType='machine'),
    'noRecord') 
AS healthState , machine.name
FROM machine;`*/

const ALL_MACHINE_SQL = `
SELECT 
IFNULL((
    SELECT healthState 
    FROM health h
    WHERE machine.id=h.relatedId AND h.relatedType='machine' 
    ORDER BY createdAt ASC limit 1
    ),
    'noRecord') 
AS healthState , 
IFNULL((SELECT a.address FROM address a WHERE machine.id=a.machineId AND a.type='ip'),NULL) AS ip ,
machine.id , 
machine.serialNo , 
machine.name , 
machine.rdNumber , 
machine.fixedNumber , 
machine.type , 
machine.model , 
machine.brand , 
machine.cpu , 
machine.useState , 
machine.createdAt , 
machine.createUser , 
machine.description , 
user.name AS userName , 
(SELECT s.text FROM select_list s WHERE machine.type=s.value AND s.code='S0004') AS typeText ,
(SELECT ss.text FROM select_list ss WHERE machine.useState=ss.value AND ss.code='S0007') AS useStateText,
IFNULL((
    SELECT u.name 
    FROM use_record AS ur, user AS u 
    WHERE machine.id=ur.relatedId AND ur.relatedType='machine' AND ur.valid=true 
    AND ur.userId=u.id
    ),NULL) 
    AS user 
FROM machine,user 
WHERE 
machine.useState!='destory' AND 
machine.createUser = user.id
;
`;

const GET_MACHINE_BY_ID_SQL = `
SELECT 
machine.id , 
machine.serialNo ,
machine.name , 
machine.rdNumber , 
machine.fixedNumber ,
machine.type ,
machine.model ,
machine.brand ,
machine.location ,
machine.cpu ,
machine.useState ,
(SELECT ss.text FROM select_list ss WHERE machine.useState=ss.value AND ss.code='S0007') AS useStateText ,
machine.createUser ,
machine.description AS machineDesc,
machine.createdAt ,
user.name AS userName 
FROM 
machine,user 
WHERE 
machine.createUser=user.id AND 
machine.id=?
;
`;
/**
 * 查询所有机器
 * @param res
 * @returns {Promise.<void>}
 */
const getMachineData = async (res) => {
    let temp,code,flag;
    try {
        // verify whether the user existed before but is not valid now
        /*let data = await model.machine.findAll({
            'order':[
                ['name','ASC']
            ]
        });*/
        let data = await model.sequelize.query(ALL_MACHINE_SQL);
        res.send(methods.formatRespond(true, 200, '',data[0]));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 根据id查询某条机器的信息
 * @param id
 * @param res
 * @returns {Promise.<void>}
 */
const getMachineDataById = async (id,res) =>{
    let temp,code,flag;
    try {
        let data = await model.sequelize.query(GET_MACHINE_BY_ID_SQL,{
            replacements : [id]
        });
        data = data[0].length ? data[0][0] : {};
        let ascription = await model.ascription.findOne({
            where : {
                relatedId : id,
                relatedType : 'machine'
            },
            order : [
                ['createdAt', 'ASC']
            ],
            limit : 1
        });
        ascription = ascription['dataValues'];
        data['ascriptionId'] = ascription['id'];
        data['outInType'] = ascription['outInType'];
        data['occurTime'] = ascription['occurTime'];
        data['originObject'] = ascription['originObject'];
        data['targetObject'] = ascription['targetObject'];
        data['ascriptionDesc'] = ascription['description'];
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
const verifyMachineExist = async(param,res)=>{
    let temp, hcode, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let data = {
            $or: [
                {
                    rdNumber: param.rdNumber
                },
                /*{
                    fixedNumber: param.fixedNumber
                },*/
                {
                    serialNo: param.serialNo
                }
            ]
        }
        if(param.id){
            data['$not'] = [{ id : param.id}]
        }
        let machine = await model.machine.findAll({
            where: data
        });

        if (machine.length) {
            flag = false;
            hcode = 13100;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
        }
    } catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
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
                like: '%RD%',
                nlike: '%RDB%'
            },

        }
    });
    console.log(rdCount);
    data.rdCount = rdCount.count;
    let rdbCount = await model.machine.findAndCount({
        where : {
            rdNumber: {
                like: '%RDB%'
            }
        }
    });
    console.log(rdbCount);
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
        let createrUser = login.getUserId(res);
        let machineData = await model.machine.create({
            serialNo : param.serialNo,
            name : param.name,
            rdNumber : param.rdNumber,
            fixedNumber : param.fixedNumber,
            type : param.type,
            model : param.model,
            brand : param.brand,
            location : param.location,
            cpu : param.cpu,
            useState : 'idle',
            createUser: createrUser,
            description: param.machineDesc
        });
        machineData = machineData.dataValues;
        param['relatedId'] = machineData.id;
        param['relatedType'] = 'machine';
        param['operateUser'] = createrUser;
        if(ascription.addAscription(param)){
            res && res.send(methods.formatRespond(true, 200,'',machineData));
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
    selectControl.addSelectParam({code : 'S0009',value: param.cpu});
    selectControl.addSelectParam({code : 'S0015',value: param.location});
}

/**
 * 修改机器基本信息
 * @param id
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const modifyMachine = async (id,param,res) => {
    param.id = id;
    let flag = await verifyMachineExist(param,res),temp = '',hcode = '';
    if(!flag){
        return;
    }
    try{
        await model.machine.update({
            serialNo : param.serialNo,
            name : param.name,
            type : param.type,
            fixedNumber : param.fixedNumber,
            model : param.model,
            brand : param.brand,
            location : param.location,
            cpu : param.cpu,
            description: param.machineDesc
        },{
            'where':{ id: id }
        });
        flag = await ascription.modifyAscription(param);
        if(flag){
            res.send(methods.formatRespond(true, 200));
            await addMacineSelect(param);
        }else{
            flag = false;
            hcode = 13201;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
        }
    }catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
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
        await model.machine.destroy({
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
    getMachineData, getAddMachineParam, addMachine, getMachineDataById, modifyMachine
}