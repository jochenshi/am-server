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
        return false;
    }
}

const addSelects = (datas)=>{
    for(let i in datas){
        let item = datas[i];
        addSelect(item);
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
    {code : 'S0007', name : '物资状态', value: 'fixedusing', text: '固定使用中',delable: false,type:'nomachine'},
    {code : 'S0007', name : '物资状态', value: 'partusing', text: '部分使用中',delable: false,type:'part'},
    {code : 'S0008', name: '普通配件类型', value: 'disk', text : '硬盘', delable: false, type: 'part'},
    {code : 'S0008', name: '普通配件类型', value: 'netcard', text : '网卡', delable: false, type: 'part'},
    {code : 'S0008', name: '普通配件类型', value: 'memory', text : '内存', delable: false, type: 'part'},
    {code : 'S0011', name : '配件归属类型', value: 'buyin', text: '购入', delable: false, type: 'in'},
    {code : 'S0011', name : '配件归属类型', value: 'borrow', text: '借入', delable: false, type: 'in'},
    {code : 'S0011', name : '配件归属类型', value: 'backin', text: '还入', delable: false, type: 'in'}
];

const initSelect = () => {
    addSelects(datas);
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
// initSelect();
// getOne();
// getCount();
// testMachine();
// getAddMachineParam();
testAscription();
module.exports.initSelect = initSelect;