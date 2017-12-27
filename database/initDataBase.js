let models = require('../src/models');
let selectList = require('./initSelectList');
const initUser = require('./initUser');
const initRole = require('./initRole');
const initAuthority = require('./initAuthority');


const initDataBase = async ()=>{
    //设置相关关联表的联系，并自动创建关联表
    models.user.belongsToMany(models.role, {through: 'userRole'});
    models.role.belongsToMany(models.user, {through: 'userRole'});
    models.role.belongsToMany(models.authority, {through: 'roleAuthority'});
    models.authority.belongsToMany(models.role, {through: 'roleAuthority'});
    console.log('======================');
    await models.sequelize.sync({force: true});
    await selectList.initSelect();
    await initRole();
    await initUser();
    initAuthority();
};

initDataBase();
