/**
 * Created by admin on 2017/11/17.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

/**
 * 得到所有选项
 * @param res
 * @returns {Promise.<void>}
 */
const getSelectData = async (res) => {
    let temp, hcode;
    try {
        // verify whether the user existed before but is not valid now
        let data = await model.select_list.findAll({
            'order':[
                ['code','ASC']
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

module.exports.getSelectData = getSelectData;

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

module.exports.verifySelectExist = verifySelectExist;

/**
 * 验证此选项条目是否存在
 * @param code
 * @param name
 * @param value
 * @param text
 * @param res
 * @returns {Promise.<boolean>}
 */
const verifySelecItemExist = async ({ code, name, value, text },res) => {
    let temp, hcode, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let select = await model.select_list.findAll({
            where: {
                name: name,
                code: code,
                $or: [
                    {
                        value: value
                    },
                    {
                        text: text
                    }
                ]
            }
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
const addSelect = async ({ code, name, value, text },res) => {
    let flag = await verifySelecItemExist({ code, name, value, text },res);
    if(!flag){
        return;
    }
    try{
        await model.select_list.create({
            code : code,
            name : name,
            text : text,
            value : value,
            delable : true
        });
        res && res.send(methods.formatRespond(true, 200));
    }catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
}

module.exports.addSelect = addSelect;

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

module.exports.deleteSelect = deleteSelect;

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
const updateSelect = async ({ id, code, name, value, text },res) => {
    let flag = await verifySelecItemExist({ code, name, value, text },res);
    if(!flag){
        return;
    }
    try{
        await model.select_list.update({
            text : text,
            value : value
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

module.exports.updateSelect = updateSelect;

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
    res.send(methods.formatRespond(true, 200, '',data));
}
module.exports.getMachineSelect = getMachineSelect;