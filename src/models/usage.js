module.exports = function (sequelize, Sequelize) {
    var usage = sequelize.define('usage', {
        relateId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        relatedType: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        },
        purpose: {
            type: Sequelize.STRING
        },
        project: {
            type: Sequelize.STRING
        },
        lendTime: {
            type: Sequelize.DATE
        },
        lendNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lendDetail: {
            type: Sequelize.TEXT
        },
        returnTime: {
            type: Sequelize.DATE
        },
        returnNumber: {
            type: Sequelize.INTEGER
        },
        returnDetail: {
            type: Sequelize.TEXT
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '使用记录表'
    });
    return usage;
}