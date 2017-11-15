module.exports = function (sequelize, Sequelize) {
    var operate = sequelize.define('operation_record', {
        type: {
            type: Sequelize.STRING
        },
        machineId: {
            type: Sequelize.STRING
        },
        fittingId: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        },
        operatorId: {
            type: Sequelize.STRING
        },
        occurTime: {
            type: Sequelize.DATE
        },
        comment: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '操作记录表'
    });
    return operate;
}