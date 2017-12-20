/**
 * Created by admin on 2017/12/11.
 */
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

const addAscription = async (param) => {
    try{
        await model.ascription.create({
            relatedId : param.relatedId,
            relatedType : param.relatedType,
            outInType : param.outInType,
            occurTime : param.occurTime,
            originObject : param.originObject,
            targetObject : param.targetObject,
            operateUser: param.operateUser,
            description: param.ascriptionDesc
        });
        return true;
    }catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 修改归属信息
 * @param param
 * @returns {Promise.<boolean>}
 */
const modifyAscription = async(param) => {
    try{
        await model.ascription.update({
            outInType : param.outInType,
            originObject : param.originObject,
            targetObject : param.targetObject,
            description: param.ascriptionDesc
        },{
            'where':{ id: param.ascriptionId }
        });
        return true;
    }catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {addAscription,modifyAscription}