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
        description: '超级管理员拥有所有权限'
    },
    {
        code: 'R0002',
        name: '管理员',
        value: 'adminuser',
        authority: '',
        description: '管理员拥有除了对管理员进行的相关操作的所有权限',
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