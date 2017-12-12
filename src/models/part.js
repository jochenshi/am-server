module.exports = function (sequelize, Sequelize) {
    var part = sequelize.define('part', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
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
        number: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        unit: {
            type: Sequelize.STRING
        },
        remainNumber: {
            type: Sequelize.INTEGER
        },
        useState: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createUser: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '零件信息表'
    });
    return part
}