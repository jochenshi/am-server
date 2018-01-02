module.exports = function (sequelize, Sequelize) {
    const authority = sequelize.define('authority',{
        value: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        }
    },
    {
        comment: '权限对照表'
    });
    authority.associate = function (model) {
        authority.belongsToMany(model.role, {through: 'roleAuthority'});
    }
    return authority;
}