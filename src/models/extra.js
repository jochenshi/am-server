module.exports = function (sequelize, Sequelize) {
    var extra = sequelize.define('extra', {
        relatedId: {
            type: Sequelize.STRING //关联的设备的id
        },
        relatedType: {
            type: Sequelize.STRING // 关联的设备的类型 machine ...
        },
        name: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        },
        valid: {
            type: Sequelize.BOOLEAN
        },
        createUser: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    },{
        comment: '附加信息表'
    });
    extra.associate = function (model) {
        extra.belongsTo(model.machine, {
            foreignKey: 'relatedId',
            targetKey: 'id',
            constraints: false
        });
        extra.belongsTo(model.user, {as: 'users', foreignKey: 'createUser', targetKey: 'id'});
    }
    return extra;
}