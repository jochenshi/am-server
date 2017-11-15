module.exports = function (sequelize, Sequelize) {
    const extension = sequelize.define('extension', {
        tableName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        source: {
            type: Sequelize.STRING
        },
        select: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        edit: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        dataType: {
            type: Sequelize.STRING
        }
    },
    {
        comment:'扩展附表'
    });
    return extension;
}