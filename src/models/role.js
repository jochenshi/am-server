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
        valid: {
            type: Sequelize.BOOLEAN
        },
        description: {
            type: Sequelize.STRING
        }
    },{
        comment: '用户角色对照表'
    });
    role.associate = function (model) {
        role.belongsToMany(model.user, {through: 'userRole'});
        role.belongsToMany(model.authority, {through: 'roleAuthority'});
    }
    return role;
};