//用户权限管理模块
const model = require('../models');

const getAuthority = (req, res) => {

};

//从数据库查询相关数据
const getFromBase = () => {
    
    model.authority.findAll({})
};