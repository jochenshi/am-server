module.exports = function (sequelize, Sequelize) {
    var ascription = sequelize.define('ascription', {
        relatedId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        relatedType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        outInType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        occurTime: {
            type: Sequelize.DATE
        },
        originObject: {
            type: Sequelize.STRING
        },
        targetObject: {
            type: Sequelize.STRING
        },
        operateUser: {
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
        comment: '设备归属表'
    });
    // ascription.associate = function (model) {
    //     ascription.belongsTo(model)
    // }
    return ascription;
}