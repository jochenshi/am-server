const model = require('../src/models');
const methods = require('../src/common/methods');

const initUser = async (obj) => {
    try {
        await model.user.create(obj);
        return true;
    } catch (err) {
        return false;
    }
};

const userData = [
    {
        id: 'id_' + Buffer.from('adminuser').toString('hex'),
        name: '管理员', 
        account: 'adminuser', 
        password: methods.passEncrypt('unis@1234'),
        role: 9,
        email: 'admin@unis.com',
        isValid: true,
        createUser: 'system',
        createTime: Date.now(),
        description: '系统默认管理员账户'
    },
    {
        id: 'id_' + Buffer.from('superuser').toString('hex'),
        name: '超级管理员', 
        account: 'superuser', 
        password: methods.passEncrypt('super@unis123'),
        role: 10,
        email: 'super@unis.com',
        isValid: true,
        createUser: 'system',
        createTime: Date.now(),
        description: '系统默认超级管理员账户'
    }
]

const executeUser = () => {
    userData.forEach((val) => {
        initUser(val);
    })
}

module.exports = executeUser;