module.exports = function (sequelize, Sequelize) {
    var role = sequelize.define('role', {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
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
        description: {
            type: Sequelize.STRING
        }
    },{
        comment: '用户角色对照表'
    });
    return role;
};