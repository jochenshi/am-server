module.exports = function (sequelize, Sequelize) {
    var use_record = sequelize.define('use_record', {
        relatedId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        relatedType: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        },
        valid: {
            type: Sequelize.BOOLEAN
        },
        purpose: {
            type: Sequelize.STRING
        },
        project: {
            type: Sequelize.STRING
        },
        lendTime: {
            type: Sequelize.DATE
        },
        lendNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lendDetail: {
            type: Sequelize.TEXT
        },
        returnTime: {
            type: Sequelize.DATE
        },
        returnNumber: {
            type: Sequelize.INTEGER
        },
        returnDetail: {
            type: Sequelize.TEXT
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '使用记录表'
    });
    use_record.associate = function (model) {
        use_record.belongsTo(model.user, {
            foreignKey: 'userId',
            targetKey: 'id',
            constraints: false
        })
    }
    return use_record;
}