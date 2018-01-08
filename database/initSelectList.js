/**
 * Created by admin on 2017/12/7.
 */
var models = require('../src/models');
const addSelect = async ({ code, name, value, text ,delable = false, type = '' }) => {
    try{
        let select = await models.select_list.create({
            code : code,
            name : name,
            text : text,
            value : value,
            delable : delable,
            type : type
        });
        return true;
    }catch (err) {
        console.log(err)
        return false;
    }
}

const addSelects = async (datas)=>{
    for(let i in datas){
        let item = datas[i];
        await addSelect(item);
    }
}

const datas = [
    {code : 'S0001', name : '归属类型', value: 'buyin', text: '购入',delable: false,type: 'in'},
    {code : 'S0001', name : '归属类型', value: 'borrow', text: '借入',delable: false,type: 'in'},
    {code : 'S0001', name : '归属类型', value: 'backin', text: '还入',delable: false,type: 'in'},
    {code : 'S0001', name : '归属类型', value: 'destory', text: '销毁',delable: false,type: 'out'},
    {code : 'S0001', name : '归属类型', value: 'loan', text: '借出',delable: false,type: 'out'},
    {code : 'S0001', name : '归属类型', value: 'backout', text: '还出',delable: false,type: 'out'},
    {code : 'S0003', name : '归属对象', value: 'R&D', text: '研发部',delable: false,type: 'in'},
    {code : 'S0004', name : '机器类型', value: 'server', text: '服务器',delable: false},
    {code : 'S0004', name : '机器类型', value: 'switchboard', text: '交换机',delable: false},
    {code : 'S0007', name : '物资状态', value: 'using', text: '使用中',delable: false,type:'normal'},
    {code : 'S0007', name : '物资状态', value: 'idle', text: '库存中',delable: false,type:'normal'},
    {code : 'S0007', name : '物资状态', value: 'destory', text: '不存在',delable: false,type:'normal'},
    {code : 'S0007', name : '物资状态', value: 'fixedusing', text: '固定使用中',delable: false,type:'fitting'},
    {code : 'S0007', name : '物资状态', value: 'partusing', text: '部分使用中',delable: false,type:'part'},
    {code : 'S0008', name: '普通配件类型', value: 'disk', text : '硬盘', delable: false},
    {code : 'S0008', name: '普通配件类型', value: 'netcard', text : '网卡', delable: false},
    {code : 'S0008', name: '普通配件类型', value: 'memory', text : '内存', delable: false},
    {code : 'S0012', name: '健康出错原因', value: 'manmade', text : '人为损坏', delable: false},
    {code : 'S0012', name: '健康出错原因', value: 'noreason', text : '无故损坏', delable: false},
    {code : 'S0012', name: '健康出错原因', value: 'accident', text : '意外损坏', delable: false},
    {code : 'S0012', name: '健康出错原因', value: 'aging', text : '机器老化', delable: false},
    {code : 'S0012', name: '健康出错原因', value: 'defect', text : '机器缺陷', delable: false},
    {code : 'S0013', name: '健康状态', value: 'health', text : '健康', delable: false,type:'right'},
    {code : 'S0013', name: '健康状态', value: 'minor', text : '轻伤', delable: false,type:'error'},
    {code : 'S0013', name: '健康状态', value: 'damage', text : '损坏', delable: false,type:'error'},
    {code : 'S0013', name: '健康状态', value: 'fault', text : '故障', delable: false,type:'error'},
    {code : 'S0014', name: '健康修复状态', value: 'norepair', text : '未修复', delable: false},
    {code : 'S0014', name: '健康修复状态', value: 'repaired', text : '已修复', delable: false},
    {code : 'S0014', name: '健康修复状态', value: 'notrepair', text : '不修复', delable: false},
    {code : 'S0014', name: '健康修复状态', value: 'partrepair', text : '不修复', delable: false},
    {code : 'S0014', name: '健康修复状态', value: 'autorepair', text : '自动修复', delable: false},
    {code : 'S0016', name: '耗材类配件的类型', value: 'cable', text : '网线', delable: false},
    {code : 'S0016', name: '耗材类配件的类型', value: 'diskTray', text : '硬盘托架', delable: false}
];

const initSelect = async () => {
    await addSelects(datas);
}

/**
 * test findOne
 * @returns {Promise.<void>}
 */
const getOne = async ()=>{
    let data = await models.select_list.findOne({
        where :{
            code : 'S0008'
        }
    });
    console.log(data);
}
/**
 * test count method
 * @returns {Promise.<void>}
 */
const getCount = async ()=>{
    let rdCount = await models.machine.findAndCount({
        where : {
            rdNumber: {
                like: '%01%'
            }
        }
    })
    console.log(rdCount);
}
const testMachine = async ()=>{
    const ALL_MACHINE_SQL = `
SELECT 
IFNULL((
    SELECT healthState 
    FROM health h
    WHERE machine.id=h.relatedId AND h.relatedType='machine' 
    ORDER BY createdAt DESC limit 1
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
user.account AS account , 
(SELECT s.text FROM select_list s WHERE machine.type=s.value AND s.code='S0004') AS typeText ,
(SELECT ss.text FROM select_list ss WHERE machine.useState=ss.value AND ss.code='S0007') AS useStateText
FROM machine,user 
WHERE 
machine.useState!='destory' AND 
machine.createUser = user.id
;
`;
    let result = await models.sequelize.query(ALL_MACHINE_SQL);
    console.log(result[0][0]);
}

const getAddMachineParam = async ()=>{
    let data = {
        rdCount : 0,
        rdbCount : 0
    }
    let rdCount = await models.machine.findAndCount({
        where : {
            rdNumber: {
                like: '%RD%',
                nlike: '%RDB%'
            }
        }
    });
    console.log(rdCount);
    data.rdCount = rdCount.count;
    let rdbCount = await models.machine.findAndCount({
        where : {
            rdNumber: {
                like: '%RDB%'
            }
        }
    });
    data.rdbCount = rdbCount.count;
    return data;
}
const testAscription = async ()=>{
    let result = await models.ascription.findOne({
        where : {
            relatedId : 1,
            relatedType : 'machine'
        },
        order : [
            ['createdAt', 'DESC']
        ],
        limit : 1
    });
    console.log(result.dataValues);
}
const testSelectNull = async ()=>{
    let fitting = await models.fitting.findAll({
        where : {
            type : 'disk',
            $not : [
                { useState : 'destory'}
            ]
        }
    });
    console.log(fitting);
}
// initSelect();
// getOne();
// getCount();
// testMachine();
// getAddMachineParam();
// testAscription();
// testSelectNull();
module.exports.initSelect = initSelect;