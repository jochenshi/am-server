//用户操作记录模块
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

//对用户在系统进行的操作进行记录
const handleOperateRecord = (obj, res) => {
    let flag = true, code, temp;
    try {
        let {type, userId = [], operatorId, machineId = [], fittingId = [], partId = []} = obj;
    } catch (err) {
        
    }
}

const addRecord = (req, res) => {

}

module.exports = {
    handleOperateRecord
}