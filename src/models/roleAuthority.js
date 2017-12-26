module.exports = function (sequelize, Sequelize) {
    let roleAuthority = sequelize.define('roleAuthority', {
        roleCode: {
            type: Sequelize.STRING,
            allowNull: false
        },
        authorityId: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return roleAuthority;
};