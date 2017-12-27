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
        description: '超级管理员拥有所有权限，超级管理员仅用于对用户进行相关操作'
    },
    {
        code: 'R0002',
        name: '管理员',
        value: 'adminuser',
        description: '管理员拥有除了对管理员进行的相关操作的所有权限',
    },
    {
        code: 'R0003',
        name: '机器管理员',
        value: 'machineadmin',
        description: ''
    },
    {
        code: 'R0004',
        name: '普通用户',
        value: 'simpleuser',
        description: ''
    }
];

const executeRole = async () => {
    for (var i = 0; i < roleData.length; i++) {
        await initRole(roleData[i]);
    }
};

module.exports = executeRole;