var models = require('../src/models');
var selectList = require('./initSelectList');
const initDataBase = async ()=>{
    await models.sequelize.sync({force: true});
    await selectList.initSelect();
}

initDataBase();
