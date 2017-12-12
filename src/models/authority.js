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
    return authority;
}