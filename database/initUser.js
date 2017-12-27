const model = require('../src/models');
const methods = require('../src/common/methods');

const initUser = async (obj) => {
    try {
        let role = await model.role.findAll({
            where: {
                code: obj.role
            }
        });
        console.log(role);
        let user = await model.user.create(obj);
        await role[0].addUser(user);
        /*let temp = await model.user.create(obj);
        await model.role.addUser(obj);*/
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const userData = [
    {
        id: 'id_' + Buffer.from('adminuser').toString('hex'),
        name: '管理员', 
        account: 'adminuser', 
        password: methods.passEncrypt('unis@1234'),
        role: 'R0002',
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
        role: 'R0001',
        email: 'super@unis.com',
        isValid: true,
        createUser: 'system',
        createTime: Date.now(),
        description: '系统默认超级管理员账户'
    }
];

const executeUser = async () => {
    for (var i = 0; i < userData.length; i++) {
        await initUser(userData[i])
    }
}

module.exports = executeUser;