module.exports = function (sequelize, Sequelize) {
    var relates = sequelize.define('machine_fitting',{
        machineId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fittingId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        valid: {
            type: Sequelize.BOOLEAN
        }
    },
    {
        comment: '机器配件关联表'
    });
    relates.associate = function (model) {
        relates.belongsTo(model.machine, {as: 'parentMachine', foreignKey: 'machineId', targetKey: 'id'});
        relates.belongsTo(model.fitting, {as: 'parentFitting', foreignKey: 'fittingId', targetKey: 'id'})
    };
    return relates;
}