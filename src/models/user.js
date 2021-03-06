module.exports = function (sequelize, Sequelize) {
    var User =  sequelize.define('user', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        account: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        /*role: {
            type: Sequelize.STRING,
            defaultValue: 0
        },*/
        phone: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        isValid: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        canLogin: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        createUser: {
            type: Sequelize.STRING
        },
        createTime: {
            type: Sequelize.DATE
        },
        updateTime: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        description: {
            type: Sequelize.TEXT
        },
        partsExtra: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
        comment: '用户信息表'
    });
    // User.associate = function (models) {
    //     User.hasMany(models.machines, {as:'user'})
    // };
    User.associate = function (model) {
        User.belongsToMany(model.role, {through: 'userRole'});
        User.belongsTo(model.user, {as: 're_create', foreignKey: 'createUser', targetKey: 'id', constraints: false});
        User.hasMany(model.use_record, {
            foreignKey: 'id',
            targetKey: 'userId',
            constraints: false
        });
        User.belongsToMany(model.operation_record, {
            through: 'operateTarget'
        })
    }
    return User;
}