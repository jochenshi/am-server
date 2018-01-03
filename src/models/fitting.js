module.exports = function (sequelize, Sequelize) {
    var fitting = sequelize.define('fitting', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
            type: Sequelize.STRING,
            allowNull: false
        },
        createTime: {
            type: Sequelize.DATE,
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
        fitting.belongsTo(model.user,{as: 'users',foreignKey: 'createUser', targetKey: 'id'});
        fitting.belongsTo(model.select_list, {as: 'selectType', foreignKey: 'type', targetKey: 'value'});
        fitting.belongsTo(model.select_list, {as: 'selectState', foreignKey: 'useState', targetKey: 'value'});
        fitting.belongsTo(model.ascription, {as: 'ascription', foreignKey: 'id', targetKey: 'relatedId',constraints: false, scope: {relatedType: 'fitting'}})
    }
    return fitting
}