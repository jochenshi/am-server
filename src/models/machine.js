module.exports = function (sequelize, Sequelize) {
    var machine = sequelize.define('machine', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        serialNo: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rdNumber: {
            type: Sequelize.STRING
        },
        fixedNumber: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        model: {
            type: Sequelize.STRING
        },
        brand: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        cpu: {
            type: Sequelize.STRING
        },
        useState: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createUser: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '机器信息表'
    });
    machine.associate = function (model) {
        machine.belongsTo(model.user, {as: 'users', foreignKey: 'createUser', targetKey: 'id'});
        machine.hasMany(model.use_record, {
            foreignKey: 'relatedId', 
            sourceKey: 'id', 
            constraints: false, 
            scope: {
                relatedType: 'machine'
            }
        })
    }
    //需要将machine以及fitting通过自动关系建立联系
    return machine
}