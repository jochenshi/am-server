module.exports = function (sequelize, Sequelize) {
    var address = sequelize.define('address', {
        machineId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    },
    {
        comment: 'IP/IPMI关联表'
    });
    address.associate = function (model) {
        address.belongsTo(model.machine, {as: 'machine', foreignKey: 'machineId', targetKey: 'id'})
    }
    return address
}