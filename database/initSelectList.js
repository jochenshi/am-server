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
// initSelect();
// getOne();
// getCount();
module.exports.initSelect = initSelect;