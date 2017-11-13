const User = require('./user_info');
module.exports = function (sequelize, Sequelize) {
    var fitting = sequelize.define('fitting', {
        serialNo: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        model: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        size: {
            type: Sequelize.FLOAT
        },
        unit: {
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
        freezeTableName: true,
        comment: '配件基本信息表'
    });
    fitting.associate = function (model) {
        fitting.belongsTo(model.User,{as: 'users',foreignKey: 'createUser', targetKey: 'id'})
    }
    return fitting
}