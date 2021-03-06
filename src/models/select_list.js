module.exports = function (sequelize, Sequelize) {
    const select_list = sequelize.define('select_list', {
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        },
        text: {
            type: Sequelize.STRING
        },
        delable: {
            type: Sequelize.BOOLEAN
        },
        // 表明该标签的所属的类型
        type: {
            type: Sequelize.STRING
        }
    },
    {
        comment: '选项表'
    });
    return select_list;
}