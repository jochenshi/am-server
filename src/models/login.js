module.exports = function (sequelize, Sequelize) {
    const login = sequelize.define('login', {
        token: {
            type: Sequelize.STRING
        },
        lastUpdate: {
            type: Sequelize.DATE
        }
    });
    return login;
};