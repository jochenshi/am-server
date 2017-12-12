const model = require('../src/models');

const initRole = async (obj) => {
    try {
        await model.role.create(obj);
    } catch (err) {
        return false;
    }
};

const roleData = [
    {
        code: 'R0001',
        name: '超级管理员',
        value: 'superuser',
        authority: '',
        description: ''
    },
    {
        code: 'R0002',
        name: '管理员',
        value: 'adminuser',
        authority: '',
        description: '',
    },
    {
        code: 'R0003',
        name: '机器管理员',
        value: 'machineadmin',
        authority: '',
        description: ''
    },
    {
        code: 'R0004',
        name: '普通用户',
        value: 'simpleuser',
        authority: '',
        description: ''
    }
];

const executeRole = () => {
    roleData.forEach((val) => {
        initRole(val);
    })
};

module.exports = executeRole;