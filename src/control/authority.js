//用户权限管理模块
const model = require('../models');

const getAuthority = (req, res) => {

};

const getFromBase = () => {
    model.authority.findAll({})
};