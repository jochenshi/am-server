/**
 * Created by admin on 2017/12/7.
 */
var models = require('../src/models');
const addSelect = async ({ code, name, value, text ,delable = false, type = '' }) => {
    try{
        await models.select_list.create({
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
];

const initSelect = () => {
    addSelects(datas);
}

initSelect();
module.exports.initSelect = initSelect;