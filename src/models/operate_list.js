module.exports = function (sequelize, Sequelize) {
    const oprate_list = sequelize.define('operate_list', {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        }
    },{
        comment: '操作表'
    });
    return oprate_list
}