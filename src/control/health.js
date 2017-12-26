/**
 * Created by admin on 2017/12/26.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const selectControl = require('./select_list');
const login = require('./login');

const GET_HEALTH_RECODE_BY_ID = `
SELECT 
h.reason, 
(SELECT s.text FROM select_list s WHERE h.reason=s.value AND s.code='S0012') AS reasonText, 
h.content, 
h.errorState, 
(SELECT s.text FROM select_list s WHERE h.reason=s.value AND s.code='S0013') AS errorStateText, 
h.healthState, 
(SELECT s.text FROM select_list s WHERE h.reason=s.value AND s.code='S0013') AS healthStateText,
h.repairState, 
(SELECT s.text FROM select_list s WHERE h.reason=s.value AND s.code='S0013') AS repairStateText,
h.createUser, 
h.createdAt, 
h.description,  
u.account 
FROM 
health.h , user u 
WHERE 
h.createUser=u.id AND 
h.relatedType=? AND 
h.relatedId=?
;
`;

/**
 * 获取单个物资的健康记录
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const getHealthRecordById = async (param,res)=>{
    let temp,code,flag;
    try {
        let data = await model.sequelize.query(GET_HEALTH_RECODE_BY_ID,{
            replacements : [param.relatedType,param.relatedId]
        });
        res.send(methods.formatRespond(true, 200, '',data[0]));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

const GET_RECENT_HEALTH = `
SELECT 
MAX(createdAt) AS createdAt, 
relatedType, 
relatedId 
FROM 
health 
GROUP BY 
relatedType, relatedId
;
`;

const GET_RECENT_HEALTH_BY_ID = `
SELECT 
m.name, 
m.serialNo, 
m.useState, 
h.relatedType, 
h.reason, 
(SELECT s.text FROM select_list s WHERE h.reason=s.value AND s.code='S0012') AS reasonText, 
h.errorState, 
(SELECT s.text FROM select_list s WHERE h.errorState=s.value AND s.code='S0013') AS errorStateText, 
h.healthState, 
(SELECT s.text FROM select_list s WHERE h.errorState=s.value AND s.code='S0013') AS healthStateText, 
h.repairState, 
(SELECT s.text FROM select_list s WHERE h.repairState=s.value AND s.code='S0014') AS repairStateText,
h.content, 
h.description, 
h.createUser, 
h.createdAt, 
u.account, 
FROM 
{tableName} m, health h, user u 
WHERE 
h.createUser=u.id AND 
h.relatedType='{tableName}' AND h.createdAt=? 
h.relatedId=? AND 
m.id=h.relatedId
;
`;

/**
 * 获取健康记录表中所有有记录的物资的最新健康记录
 * @returns {Promise.<void>}
 */
const getRecentHealthRecord = async (res) => {
    let temp,code,flag;
    try {
        let data = [];
        let recents = await model.sequelize.query(GET_RECENT_HEALTH);
        recents[0].forEach(async (item)=>{
            let oneData = await model.sequelize.query(GET_RECENT_HEALTH_BY_ID.replace('{tableName}',item.relatedType),{
                relacements : [item.createdAt, item.relatedId]
            });
            data = [...data,...oneData[0]];
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
 * 添加健康记录
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const addHealth = async (param, res)=>{

}
module.exports = {
    getHealthRecordById, getRecentHealthRecord
}