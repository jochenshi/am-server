module.exports = function (sequelize, Sequelize) {
    var extra = sequelize.define('extra', {
        relatedId: {
            type: Sequelize.STRING
        },
        relatedType: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        }
    });
    return extra;
}