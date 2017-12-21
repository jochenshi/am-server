/**
 * Created by admin on 2017/12/21.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

const getAddress = async (param, res)=>{
    let temp,code,flag;
    try {
        // verify whether the user existed before but is not valid now
        let data = await model.address.findOne({
         where : {
             machineId : param.machineId,
             type: param.type
         }
         });
        res.send(methods.formatRespond(true, 200, '',data ? data['dataValues']:{}));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

const addAddress = async(param,res) => {
    let flag = await verifyAddress(param,res),temp = '',hcode = '';
    if(!flag){
        return;
    }
    try{
        let addressData = await model.address.create({
            machineId : param.machineId,
            type : param.type,
            address : param.address,
            username : param.username,
            password : param.password,
        });
        res && res.send(methods.formatRespond(true, 200,'',addressData['dataValues']));
    }catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return flag;
}

/**
 * 验证地址是否存在
 * @param param
 * @param res
 * @returns {Promise.<boolean>}
 */
const verifyAddress = async(param,res) => {
    let temp, hcode, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let data = {
            machineId: param.machineId,
            type: param.type,
            $or: [
                {
                    address: param.address
                }
            ]
        }
        if(param.id){
            data['$not'] = [{ id : param.id}]
        }
        let address = await model.address.findAll({
            where: data
        });

        if (address.length) {
            flag = false;
            hcode = 13102;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
        }
    } catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return flag;
}

/**
 * 修改地址
 * @param param
 * @param res
 * @returns {Promise.<void>}
 */
const modifyAddress = async (param,res) => {
    let flag = await verifyAddress(param,res),hcode,temp;
    if(!flag){
        return;
    }
    try{
        await model.address.update({
            address : param.address,
            username : param.username,
            password : param.password,
        },{
            'where':{ id: param.id }
        });
        res.send(methods.formatRespond(true, 200));
    }catch (err) {
        hcode = 10003;
        flag = false;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

module.exports = { addAddress , getAddress, modifyAddress }