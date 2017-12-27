const models = require('../models')
const methods = require('../common/methods');
const errorText = require('../common/error');
const config = require('../config/config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const ascription = require('./ascription');

//获取普通类型的配件的方法
const handleNormalGet = async (req, res) => {
    let flag = true, code, temp, fit = [];
    try {
        let {equipType = 'all'} = req.query;
        let arg = equipType === 'all' ? {} : {where: {type: equipType}};
        try {
            fit = await models.fitting.findAll();
            res.send(methods.formatRespond(flag, 200, '', []))
        } catch (err) {
            console.log(err)
        }
        
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

//添加普通类型配件的请求的方法
const handleNormalAdd = (req, res) => {
    console.log(req.body);
    //req.body为添加的参数，req.query为接在请求后面的参数
    verifyNormal(req, res);
};

//修改普通类型的配件的方法
const handleNormalModify = (req, res) => {
    console.log(req.body);
    let flag = true, code, temp;
    let {id, serialNo, name, type, model, brand, size, unit, useState, description} = req.body;
    if (!id ||!serialNo || !name || !type || !model || !brand) {
        //修改传过来的参数必填校验不通过
        flag = false;
        code = 12001;
        temp = methods.formatRespond(flag, code, errorText.formatError(code));
        res.status(400).send(temp);
    } else {
        //必选参数校验通过,执行查找然后修改
        // let equip = await models.equip.findAll({
        //     where: {
        //         id: id
        //     }
        // });

    }
}

//关于普通类型的配件的添加的验证
const verifyNormal = async (req, res) => {
    let {sourceType, serialNo, name, type, model, brand, size, unit, description} = req.body || {},
    flag = true, code, temp;
    try {
        if (!serialNo || !name || !type || !model || !brand) {
            flag = false;
            code = 12001;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        } else {
            let findFit = await models.fitting.findAll({
                where: {
                    [Op.or]: [
                        {serialNo},
                        {name}
                    ]
                }
            });
            if (findFit.length) {
                flag = false;
                code = 12000;
                temp = methods.formatRespond(flag, code, errorText.formatError(code));
                res.status(400).send(temp);
            } else {
                //未检测到序列号或者名称重复的记录
                let userId = methods.getUserId(req, res);
                let addData = Object.assign({}, req.body, {userId});
                let equip_add = await executeNormalAdd(addData);
                if (equip_add.flag) {
                    let add_equip = equip_add.data;
                    let param = {
                        relatedId: add_equip.id,
                        relatedType: 'fitting',
                        outInType: '',
                        occurTime: add_equip.createTime,
                        originObject: '',
                        targetObject: '',
                        operateUser: userId,
                        createTime: '',
                        description: ''
                    };
                    if (ascription.addAscription(param)) {
                        res.send(methods.formatRespond(true, 200));
                    } else {
                        //设备归属信息添加失败，删除相应的配件的信息
                        flag = false;
                        code = 13200;
                        executeNormalDelete(add_equip.id);
                        res.status(400).send(methods.formatRespond(flag, code, errorText.formatError(code)));
                    }
                }
            }
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
};

//获取到正确格式的普通配件的数据的时候执行普通类型的数据的添加
//执行添加操作的时候，需要先判断类型，型号，品牌是否存在于选项表中，否则需要先执行在选项表中添加相关参数
const executeNormalAdd = async (obj, res) => {
    let flag = true, code, temp, data = {};
    try {
        let data = await models.fitting.create({
            serialNo: obj.serialNo,
            name: obj.name,
            type: obj.type,
            model: obj.model,
            brand: obj.brand,
            size: obj.size,
            unit: obj.unit,
            useState: obj.useState,
            createUser: obj.userId,
            createTime: Date.now(),
            description: obj.description
        });
        // temp = methods.formatRespond(true, 200);
        // res.send(temp);
    } catch (err) {
        data = {};
        flag = false;
        code = 10003;
        temp = methods.formatRespond(flag, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return {flag, data};
};

//执行数据库的因添加相关依赖失败，而删除普通类型的配件的方法
const executeNormalDelete = async (id) => {
    let flag = true;
    try {
        await models.fitting.destroy({
            where: {
                id: id
            }
        })
    } catch (err) {
        flag = false;
    }
}

//执行修改普通配件的操作
const executeNormalModify = (req, res) => {

}

module.exports = {
    handleNormalGet, handleNormalAdd, handleNormalModify
};