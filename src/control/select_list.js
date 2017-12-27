/**
 * Created by admin on 2017/11/17.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const selectCodeName = require('../common/selectCodeName');

/**
 * 得到所有的选项头
 * @param res
 */
const getSelectDataTitle = (res) => {
    res.send(methods.formatRespond(true, 200, '',selectCodeName));
}

/**
 * 得到某code代表的所有选项
 * @param code
 * @param res
 * @returns {Promise.<void>}
 */
const getSelectDataByCode = async (code, res) => {
    let temp, hcode,flag;
    try {
        // verify whether the user existed before but is not valid now
        let data = await model.select_list.findAll({
            where : {
                code : code
            }
        });
        res.send(methods.formatRespond(true, 200, '',data));
    } catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 得到所有选项
 * @param res
 * @returns {Promise.<void>}
 */
const getSelectData = async (res) => {
    let temp, hcode,flag;
    try {
        // verify whether the user existed before but is not valid now
        let data = await model.select_list.findAll({
            'order':[
                ['code','ASC']
            ]
        });
        res.send(methods.formatRespond(true, 200, '',data));
    } catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 验证此选项类别是否存在
 * @param code
 * @param name
 * @param res
 * @returns {Promise.<boolean>}
 */
const verifySelectExist = async ({ code, name },res) => {
    let temp, hcode, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let select = await model.select_list.findAll({
            where: {
                $or: [
                    {
                        code: code
                    },
                    {
                        name: name
                    }
                ]
            }
        });

        if (select.length) {
            flag = false;
            hcode = 13001;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res.status(400).send(temp);
        }else{
            res.send(methods.formatRespond(true, 200));
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag
}

/**
 * 验证此选项条目是否存在
 * @param code
 * @param name
 * @param value
 * @param text
 * @param res
 * @returns {Promise.<boolean>}
 */
const verifySelecItemExist = async ({id, code, name, value, text },res) => {
    let temp, hcode, flag = true;
    try {
        let param = { code : code , $or : [{ value: value}]};
        if(text){
            param['$or'].push({ text : text});
        }
        if(name){
            param['name'] = name;
        }
        if(id){
            param['$not'] = {
                id : id
            }
        }
        let select = await model.select_list.findAll({
            where: param
        });

        if (select.length) {
            flag = false;
            hcode = 13000;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return flag
}

/**
 * 添加选项条目
 * @param code
 * @param name
 * @param value
 * @param text
 * @param res
 * @returns {Promise.<void>}
 */
const addSelect = async ({ code, name, value, text ,type = ''},res) => {
    let flag = await verifySelecItemExist({ code, name, value, text },res);
    let temp,hcode;
    if(!flag){
        return;
    }
    try{
        await model.select_list.create({
            code : code,
            name : name,
            text : text,
            value : value,
            delable : true,
            type : type
        });
        res && res.send(methods.formatRespond(true, 200));
    }catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
}

/**
 * 删除选项
 * @param code
 * @param id
 * @param res
 * @returns {Promise.<void>}
 */
const deleteSelect = async ({code, id}, res) => {
    let param = { };
    if(id){
        param['id'] = id;
    }
    if(code){
        param['code'] = code;
    }
    try{
        await model.select_list.destroy({
            'where':param
        });
        res.send(methods.formatRespond(true, 200));
    }catch(err){
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp); 
    }
}

/**
 * 更新选项
 * @param id
 * @param code
 * @param name
 * @param value
 * @param text
 * @param res
 * @returns {Promise.<void>}
 */
const updateSelect = async ({ id, code, name, value, text ,type = ''},res) => {
    let flag = await verifySelecItemExist({ id, code, name, value, text },res);
    if(!flag){
        return;
    }
    try{
        await model.select_list.update({
            text : text,
            value : value,
            type : type
        },{
            'where':{ id: id }
        });
        res.send(methods.formatRespond(true, 200));
    }catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

/**
 * 获取所需特别选项的公共方法
 * @param param 特别选项的参数
 * @returns {Promise.<Array>}
 */
const getSelectByParam = async (param)=>{
    let select = [];
    try {
        select = await model.select_list.findAll({
            where: param
        });
        return select;
    } catch (err) {
        console.log(err);
        return select;
    }
}

/**
 * 添加在新增物资信息时，新增的选项数据
 */
const addSelectParam = async ({code, name, value, text, type})=>{
    text = text || value;
    name = name || selectCodeName[code];
    if(!name){
        let data = await model.select_list.findOne({
            where : {
                code : code
            }
        })
        name = data ? data['dataValues']['name'] : '';
    }
    await addSelect({code : code, name : name, value : value, text : text, type: type});
}
/**
 * 得到机器基本信息的选择项
 * @returns {Promise.<void>}
 */
const getMachineSelect = async (res) => {
    let data = {};
    data.inType = [];
    data.inOrigin = [];
    data.inTarget = [];
    data.type = [];
    data.model = [];
    data.brand = [];
    data.cpu = [];
    data.location = [];
    data.inType = await getSelectByParam({
        code : 'S0001',
        type : 'in'
    });
    data.inOrigin = await getSelectByParam({
        code : 'S0002',
        type : 'in'
    });
    data.inTarget = await getSelectByParam({
        code : 'S0003',
        type : 'in'
    });
    data.type = await getSelectByParam({
        code : 'S0004'
    });
    data.model = await getSelectByParam({
        code : 'S0005'
    });
    data.brand = await getSelectByParam({
        code : 'S0006'
    });
    data.cpu = await getSelectByParam({
        code : 'S0009'
    });
    data.location = await getSelectByParam({
        code : 'S0015'
    });
    res && res.send(methods.formatRespond(true, 200, '',data));
    return data;
}


//获取普通配件涉及到的相关选项的可选值
const getNormalEquipSelect = async (res) => {
    let data = {
        type: [],
        model: [],
        brand: [],
        origin: []
    }, code, flag,temp;
    try {
        data.type = await getSelectByParam({
            code: 'S0008'
        });
        data.model = await getSelectByParam({
            code: 'S0010'
        });
        data.brand = await getSelectByParam({
            code: 'S0011'
        });
        data.origin = await getSelectByParam({
            code: 'S0001'
        })
        flag = true;
        res.send(methods.formatRespond(flag, 200,'',data));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return data;
}

module.exports = {
    getSelectDataTitle, getSelectDataByCode,
    getSelectData, verifySelectExist, addSelect, deleteSelect, updateSelect, addSelectParam, getMachineSelect,
    getNormalEquipSelect
}