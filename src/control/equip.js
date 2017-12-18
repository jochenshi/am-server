const model = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');
const config = require('../config/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//添加普通类型配件的请求的方法
const handleNormalAdd = (req, res) => {
    console.log(req.body);
    //req.body为添加的参数，req.query为接在请求后面的参数
    res.send(req.body)
}

const verifyNormal = async (req, res) => {
    let {serialNo, name, type, model, brand, size, unit, description} = req.body || {},
    flag = true, code, temp;
    try {
        if (!serialNo || !name || !type || !model || !brand) {
            flag = false;
        } else {
            let findFit = await model.fitting.findAll({
                where: {
                    [Op.or]: [
                        {serialNo},
                        {name}
                    ]
                }
            });
            if (findFit.length) {
                flag = false;
            } else {
                //未检测到序列号或者名称重复的记录
            }
        }
    } catch (err) {

    }
}

const executeNormalAdd = (req, res) => {
    
}

module.exports = {
    handleNormalAdd
}