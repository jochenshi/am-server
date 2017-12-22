module.exports = function (sequelize, Sequelize) {
    var health = sequelize.define('health', {
        relatedId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        relatedType: {
            type: Sequelize.STRING
        },
        reason: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        healthState: {
            type: Sequelize.STRING,
            allowNull: false
        },
        errorState: {
            type: Sequelize.STRING,
            allowNull: false
        },
        repairState: {
            type: Sequelize.STRING,
        },
        createUser: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '健康记录表(只针对机器和配件)'
    });
    return health;
}