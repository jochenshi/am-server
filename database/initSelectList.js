/**
 * Created by admin on 2017/12/7.
 */
var models = require('../src/models');
const addSelect = async ({ code, name, value, text ,delable = false}) => {
    try{
        await models.select_list.create({
            code : code,
            name : name,
            text : text,
            value : value,
            delable : delable
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
    {code : 'S0001', name : '归属来源', value: 'buyin', text: '购入'},
    {code : 'S0001', name : '归属来源', value: 'borrow', text: '借入'},
    {code : 'S0001', name : '归属来源', value: 'backin', text: '还入'},
    {code : 'S0002', name : '归属去向', value: 'destory', text: '销毁'},
    {code : 'S0002', name : '归属去向', value: 'loan', text: '借出'},
    {code : 'S0002', name : '归属去向', value: 'backout', text: '还出'},
];

const initSelect = () => {
    addSelects(datas);
}

// initSelect();
module.exports.initSelect = initSelect;