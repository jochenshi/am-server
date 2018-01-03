/**
 * Created by admin on 2017/12/11.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

const GET_IN_ASCRIPTION = `
SELECT 
MAX(createdAt) AS createdAt, 
relatedId, 
relatedType 
FROM 
ascription 
GROUP BY 
relatedId, 
relatedType
;
`;

const GET_MATERIAL_INFO = `
SELECT 
a.outInType,
(SELECT ss.text FROM select_list ss WHERE a.outInType=ss.value AND ss.code='S0001') AS outInTypeText, 
a.originObject, 
a.occurTime, 
a.description AS ascriptionDesc, 
m.*, 
(SELECT ss.text FROM select_list ss WHERE m.type=ss.value AND ss.code=?) AS typeText, 
(SELECT ss.text FROM select_list ss WHERE m.useState=ss.value AND ss.code='S0007') AS useStateText 
FROM 
{table} AS m, 
ascription AS a 
WHERE 
a.relatedType=? AND a.relatedId=? AND a.createdAt=? 
AND a.relatedId=m.id
;
`;

/**
 * 添加出入记录信息
 * @param param
 * @returns {Promise.<boolean>}
 */
const addAscription = async (param) => {
    try{
        await model.ascription.create({
            relatedId : param.relatedId,
            relatedType : param.relatedType,
            outInType : param.outInType,
            occurTime : param.occurTime,
            originObject : param.originObject,
            targetObject : param.targetObject,
            operateUser: param.operateUser,
            description: param.ascriptionDesc
        });
        return true;
    }catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 修改归属信息
 * @param param
 * @returns {Promise.<boolean>}
 */
const modifyAscription = async(param) => {
    try{
        await model.ascription.update({
            outInType : param.outInType,
            originObject : param.originObject,
            targetObject : param.targetObject,
            description: param.ascriptionDesc
        },{
            'where':{ id: param.ascriptionId }
        });
        return true;
    }catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 得到所有还在库存中的设备归属信息
 * @param res
 * @returns {Promise.<void>}
 */
const getInAscription = async(res) => {
    let flag = true,temp = '',hcode = '';
    try{
        let data = await model.sequelize.query(GET_IN_ASCRIPTION);
        data = data[0];
        let datas = [];
        for(let i = 0;i<data.length;i++){
            let item = data[i],typeCode = '';
            switch(item.relatedType){
                case 'machine':
                    typeCode = 'S0004';
                    break;
                case 'fitting':
                    typeCode = 'S0008';
                    break;
                case 'part':
                    typeCode = 'S0016';
                    break;
            }
            let material = await model.sequelize.query(GET_MATERIAL_INFO.replace('{table}',item.relatedType),{
                replacements : [typeCode,item.relatedType, item.relatedId, item.createdAt]
            });
            material = material[0];
            if(material.length){
                datas.push(material[0]);
            }
        }
        res && res.send(methods.formatRespond(true, 200,'',datas));
    }catch(err){
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
}

const getBriefInfo = async(res) => {
    let flag = true,temp = '',hcode = '',data = [];
    try{
        let machine = await model.machine.findAll({
            where : {
                type : 'server',
                $not : [
                    { useState : 'destory'}
                ]
            }
        });
        let countMachine = {typeText: '服务器',total: machine.length, remainder: 0}
        machine.forEach((item)=>{
            if(item.useState==='idle'){
                countMachine.remainder++;
            }
        })
        data.push(countMachine);
        let fitting = await model.fitting.findAll({
            where : {
                type : 'disk',
                $not : [
                    { useState : 'destory'}
                ]
            }
        });
        let countFitting = {typeText: '硬盘',total: fitting.length, remainder: 0}
        fitting.forEach((item)=>{
            if(item.useState==='idle'){
                countFitting.remainder++;
            }
        })
        data.push(countFitting);
        res && res.send(methods.formatRespond(true, 200,'',data));
    }catch(err){
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
}

module.exports = { addAscription, modifyAscription,
        getInAscription, getBriefInfo
}