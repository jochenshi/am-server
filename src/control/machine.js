/**
 * Created by admin on 2017/12/11.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const ascription = require('./ascription');

const getMachineData = async (res) => {
    let temp;
    try {
        // verify whether the user existed before but is not valid now
        let data = await model.machine.findAll({
            'order':[
                ['name','ASC']
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

module.exports.getMachineData = getMachineData;

verifyMachineExist = async(param,res)=>{
    let temp, hcode, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let machine = await model.machine.findAll({
            where: {
                $or: [
                    {
                        rdNumber: param.rdNumber
                    },
                    {
                        fixedNumber: param.fixedNumber
                    }
                ]
            }
        });

        if (machine.length) {
            flag = false;
            hcode = 13100;
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

const addMachine = async (param,res) => {
    let flag = await verifyMachineExist(param,res);
    if(!flag){
        return;
    }
    try{
        let machineData = await model.machine.create({
            serialNo : param.serialNo,
            name : param.name,
            rdNumber : param.rdNumber,
            fixedNumber : param.fixedNumber,
            type : param.type,
            model : param.model,
            brand : param.brand,
            location : param.location,
            useState : 'idle',
            createUser: 'id_61646d696e75736572',
            description: param.machineDesc
        });
        machineData = machineData.dataValues;
        param['relatedId'] = machineData.id;
        param['relatedType'] = 'machine';
        if(ascription.addAscription(param)){
            res && res.send(methods.formatRespond(true, 200));
        }else{
            //删除此条machine
            flag = false;
            hcode = 13100;
            temp = methods.formatRespond(false, hcode, errorText.formatError(hcode));
            res && res.status(400).send(temp);
            deleteMachine(param.relatedId);
        }
    }catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
}

module.exports.addMachine = addMachine;

const deleteMachine = async (id, res) => {
    try{
        await model.select_list.destroy({
            'where':{
                id: id
            }
        });
        res && res.send(methods.formatRespond(true, 200));
    }catch(err){
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
}

module.exports.deleteMachine = deleteMachine;