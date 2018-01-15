module.exports = function (sequelize, Sequelize) {
    var operate = sequelize.define('operation_record', {
        type: {
            type: Sequelize.STRING
        },
        machineId: {
            type: Sequelize.STRING
        },
        fittingId: {
            type: Sequelize.STRING
        },
        partId: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        },
        operatorId: {
            type: Sequelize.STRING
        },
        operateStatus: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        number: {
            type: Sequelize.FLOAT
        },
        occurTime: {
            type: Sequelize.DATE
        },
        comment: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '操作记录表'
    });
    operate.associate = function (model) {
        operate.belongsTo(model.authority, {
            foreignKey: 'type',
            targetKey: 'value',
            constraints: false
        });
        operate.belongsTo(model.user, {
            as: 'operateUser',
            foreignKey: 'operatorId',
            targetKey: 'id',
            constraints: false
        });
        operate.belongsToMany(model.machine, {
            through: 'operateMachine'
        });
        operate.belongsToMany(model.fitting, {
            through: 'operateFitting'
        });
        operate.belongsToMany(model.part, {
            through: 'operatePart'
        });
        operate.belongsToMany(model.user, {
            through: 'operateTarget'
        });
    }
    return operate;
}