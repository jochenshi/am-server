/**
 * Created by admin on 2017/11/17.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

const getSelectData = async (res) => {
    let temp, hcode;
    try {
        // verify whether the user existed before but is not valid now
        let select = await model.select_list.findAll({
            'order':[
                ['code','ASC']
            ]
        });
        res.send(methods.formatRespond(true, 200, '',select));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

module.exports.getSelectData = getSelectData;

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
            res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag
}

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
            value : value
        });
        res.send(methods.formatRespond(true, 200));
    }catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

module.exports.addSelect = addSelect;

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