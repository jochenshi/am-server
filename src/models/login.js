module.exports = function (sequelize, Sequelize) {
    const login = sequelize.define('login', {
        userId: {
            type: Sequelize.STRING
        },
        token: {
            type: Sequelize.STRING
        },
        lastUpdate: {
            type: Sequelize.DATE
        },

    });
    return login;
};