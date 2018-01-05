//用户权限管理模块
const model = require('../models');
const methods = require('../common/methods');

//查询当前用户所具有的权限，根据识别出来的用户的ID查询出用户的角色，然后根据用户的角色查询出所对应的权限
const getAuthority = async (req, res) => {
    let data = [], flag = true, code, temp;
    try {
        let userId = methods.getUserId(req, res);
        //let userId = 'id_61646d696e75736572';
        let user = await model.user.findAll({
            where: {
                id: userId
            },
            include: [
                {
                    model: model.role,
                    attributes: ['name', 'code', 'value'],
                    through: {
                        attributes: ['name', 'code', 'value']
                    }
                },
            ]
        })
        if (user.length) {
            data = await getAuthorityFromBase(user[0].roles);
        }
        res && res.send(methods.formatRespond(flag, 200, '', data));
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return {
        flag,
        data
    }
};

//根据查询到的角色查询对应的角色对应的所有权限
const getAuthorityFromBase = async (role = [], res) => {
    let authArr = [];
    try {
        if (role.length) {
            for (let i = 0; i < role.length; i++) {
                let temp = await model.role.findAll({
                    where: {
                        code: role[i].code
                    },
                    include: [
                        {
                            model: model.authority,
                            attributes: ['id', 'name', 'value'],
                            through: {
                                attributes: ['id', 'name', 'value']
                            }
                        }
                    ]
                });
                if (temp.length && temp[0].authorities && temp[0].authorities.length) {
                    let temp_auth = temp[0].authorities;
                    temp_auth.forEach((val) => {
                        authArr.push(val.value)
                    });
                }
            }
        }
        return Array.from(new Set(authArr))
    } catch (err) {
        console.log(err)
        return [];
    }
}
//从数据库查询相关数据
// const getFromBase = (req, res) => {

//     model.authority.findAll({})
// };

module.exports = { getAuthority }