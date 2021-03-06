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
        format: {
            type: Sequelize.STRING
        },
        useState: {
            type: Sequelize.STRING,
            allowNull: false
        },
        linkState: {
            type: Sequelize.BOOLEAN
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
        fitting.belongsTo(model.select_list, {as: 'selectType', foreignKey: 'type', targetKey: 'value',constraints: false, scope: {code: 'S0008'}});
        fitting.belongsTo(model.select_list, {as: 'selectState', foreignKey: 'useState', targetKey: 'value',constraints: false, scope: {code: 'S0007'}});
        fitting.belongsTo(model.ascription, {as: 'ascription', foreignKey: 'id', targetKey: 'relatedId',constraints: false, scope: {relatedType: 'fitting'}});
        fitting.hasMany(model.use_record, {
            foreignKey: 'relatedId',
            sourceKey: 'id',
            constraints: false,
            scope: {
                relatedType: 'fitting'
            }
        });
        fitting.belongsToMany(model.operation_record, {
            through: 'operateFitting'
        })
    }
    return fitting
}