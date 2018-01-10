module.exports = function (sequelize, Sequelize) {
    var part = sequelize.define('part', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
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
    part.associate = function (model) {
        part.belongsTo(model.user,{as: 'users',foreignKey: 'createUser', targetKey: 'id'});
        part.belongsTo(model.select_list, {as: 'selectType', foreignKey: 'type', targetKey: 'value',constraints: false, scope: {code: 'S0016'}});
        part.belongsTo(model.select_list, {as: 'selectState', foreignKey: 'useState', targetKey: 'value',constraints: false, scope: {code: 'S0007'}});
        part.belongsTo(model.ascription, {as: 'ascription', foreignKey: 'id', targetKey: 'relatedId',constraints: false, scope: {relatedType: 'part'}});
        part.belongsTo(model.use_record, { 
            foreignKey: 'id', 
            targetKey: 'relatedId', 
            constraints: false, 
            scope: {
                relatedType: 'part'
            }
        })
    }
    return part
}