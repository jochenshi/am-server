const User = require('./user_info');
module.exports = function (sequelize, Sequelize) {
    var machine = sequelize.define('machine', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        serialNo: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rdNumber: {
            type: Sequelize.STRING
        },
        fixedNumber: {
            type: Sequelize.STRING
        },
        model: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        cpu: {
            type: Sequelize.STRING
        },
        useState: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        createUser: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '机器信息表'
    });
    machine.associate = function (model) {
        machine.belongsTo(model.User, {as: 'users', foreignKey: 'createUser', targetKey: 'id'})
    }
    return machine
}