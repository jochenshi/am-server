module.exports = function (sequelize, Sequelize) {
    const apply = sequelize.define('applying',{
        applicantId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        targetId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reason: {
            type: Sequelize.TEXT
        },
        occurTime: {
            type: Sequelize.DATE,
            allowNull: false
        }
    },
    {
        comment: '申请记录表'
    });
    return apply;
}