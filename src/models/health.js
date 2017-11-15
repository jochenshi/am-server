module.exports = function (sequelize, Sequelize) {
    var health = sequelize.define('health', {
        relatedId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        relatedType: {
            type: Sequelize.STRING
        },
        healthState: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reason: {
            type: Sequelize.TEXT
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