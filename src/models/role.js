module.exports = function (sequelize, Sequelize) {
    var role = sequelize.define('role', {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        authority: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    },{
        comment: '角色对照表'
    });
    return role;
}