var models = require('../src/models');
var selectList = require('./initSelectList');
const initUser = require('./initUser');
const initDataBase = async ()=>{
    await models.sequelize.sync({force: true});
    await selectList.initSelect();
    await initUser();
}

initDataBase();
