module.exports = function (sequelize, Sequelize) {
    const authority = sequelize.define('authority',{
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
    },
    {
        comment: '权限表'
    });
    return authority;
}