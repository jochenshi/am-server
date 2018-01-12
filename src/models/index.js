var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var sql_config = require(path.join(__dirname, '../config/config.js'));

const config = sql_config.mysql_config;

var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};
console.log('start index');

const user = require('./user');
const role = require('./role');
const authority = require('./authority');
//const roleAuthority = require('./roleAuthority');
// const User = require('./user_info');
// const machine = require('./machine_info')

fs.readdirSync(__dirname).filter(
    (file) => {
        return (file.indexOf('.js') > 0) && (file !== 'index.js')&& (file !== 'roleAuthority.js')
    }
).forEach(
    (file) => {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    }
);

Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
        console.log('modelname',modelName);
        db[modelName].associate(db)
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;