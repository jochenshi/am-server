
// add user module starts
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');
const {getAuthority} = require('../control/authority')
const operation = require('./operate_record')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// required params
const verifyRequired = ({name, account, password, phone, email, role}, res) => {
    let flag = true;
    if (!account || !password || !name || !role) {
        //txt = 'name,account or password can not be empty!';
        flag = false;
        const temp = methods.formatRespond(false, 10000, errorText.formatError(10000));
        res.status(400).send(temp);
    }
    return flag;
};

//验证添加用户的时候是否具有该权限
const verifyAuthority = async (authority, req, res) => {
    let flag = true, code, temp;
    try {
        let auth = await getAuthority(req);
        if (auth.flag) {
            let authFlag = auth.data.indexOf(authority) > -1;
            if (!authFlag) {
                flag = false;
                code = 10008;
                temp = methods.formatRespond(flag, code, errorText.formatError(code));
                res.status(400).send(temp);
            }
        } else {
            flag = false;
            code = 10008;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag
}

//verify whether the user is already exist
const verifyUserExist = async ({name, account}, res) => {
    let temp, code, flag = true;
    try {
        // verify whether the user existed before but is not valid now
        let formerUser = await model.user.findAll({
            where: {
                name: name,
                account: account
            }
        });
        if (formerUser.length && !formerUser[0].isValid) {
            flag = false;
            code = 10002;
            temp = methods.formatRespond(false, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
        // verify whether the info has conflicts with others
        let user = await model.user.findAll({
            where: {
                $or: [
                    {
                        name: name
                    },
                    {
                        account: account
                    }
                ]
            }
        });
        if (user.length) {
            flag = false;
            code = 10001;
            temp = methods.formatRespond(false, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
    } catch (err) {
        flag = false;
        code = 10003;
        temp = methods.formatRespond(false, code, err);
        res.status(400).send(temp);
    }
    return flag
};

// the concrete function used to execute user add operation
const executeAdd = async ({name, account, password, role, phone, email, description, userId},res) => {
    console.log('go in add');
    let temp, code, flag = true;
    try {
        let roleInfo = await model.role.findAll({
            where: {
                value: role
            }
        });
        if (roleInfo.length) {
            //let userId = methods.getUserId(req);
            let userInfo = await model.user.create({
                id: 'id_' + Buffer.from(account).toString('hex'),
                name: name,
                account: account,
                password: methods.passEncrypt(password),
                phone: phone,
                email: email,
                isValid: true,
                canLogin: false,
                createUser: userId,
                createTime: Date.now(),
                description: description
            });
            await roleInfo[0].addUser(userInfo)
            temp = methods.formatRespond(true, 200);
            let operateParam = {
                type: 'addUser',
                userId: userInfo.id,
                operatorId: userId,
                operateStatus: flag
            };
            await operation.handleOperateRecord(operateParam);
            res.send(temp)
        } else {
            flag = false;
            code = 10009;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
        
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return flag;
};

//验证用户的Id是不是有效的存在的
const verifyId = async ({userId}, res) => {
    let flag = true, code, temp;
    if (!userId) {
        flag = false;
        code = 10004;
        temp = methods.formatRespond(flag, code, errorText.formatError(code));
        res.status(400).send(temp)
    }
    try {
        const id = userId.toString();
        let users = await model.user.findAll({
            where: {
                id: id
            }
        });
        if (!users.length) {
            flag = false
        }
    } catch (err) {
        flag = false;
    }
};

//add user
const handleAdd = async (req, res) => {
    let requireFlag = verifyRequired(req.body, res);
    let authFlag = await verifyAuthority('addUser', req, res);
    if (!requireFlag || !authFlag) {
        return
    }
    const existFlag = await verifyUserExist(req.body ,res);
    if (!existFlag) {
        return
    }
    // all validation passed and execute add user operation
    let userId = methods.getUserId(req);
    let inData = Object.assign({}, req.body,{userId})
    await executeAdd(inData, res);
};

//delete user, only the user who has the
// authority of manager or the root user can execute deleting user
const deleteUser = async (req, res) => {
    //
};

//modify user
const modifyUser = (req, res) => {
    const idFlag = verifyId(req.param)
};

//inquire specific user according to search info
const inquireUser = (req, res) => {};

//get users and show user according to different page,用户列表的展示
const getUsers = async (req, res) => {
    let flag = true, code, temp, arg = {}, resData = [];
    try {
        let verifyFlag = await verifyGetAuthority(req, res);
        if (verifyFlag.flag) {
            //验证出应该获取何种类型的用户
            if (verifyFlag.retAuth === 'showIncludeRoot') {
                arg = {}
            } else {
                arg = {
                    code: {
                        [Op.notIn]: ['R0001']
                    }
                }
            }
            let queryUser = await model.user.findAll(
                {
                    attributes: ['id','name','account','createTime','description', 'createUser','phone','email','isValid','canLogin'],
                    include: [
                        {
                            model: model.role,
                            where: arg,
                            attributes: ['name','valid']
                        },
                        {
                            model: model.user,
                            as: 're_create',
                            attributes: ['name', 'isValid','account']
                        }
                    ]
                }
            );
            let parseUser = JSON.parse(JSON.stringify(queryUser));
            if (queryUser.length) {
                for (let i = 0; i < parseUser.length; i++) {
                    let tt = parseUser[i];
                    tt.key = tt.id;
                    tt.re_create ? tt.creator = tt.re_create.name : tt.creator = tt.createUser;
                    //tt.re_create && (tt.creator = tt.re_create.name);
                    let tRole = [];
                    tt.roles.forEach(val => {
                        tRole.push(val.name)
                    })
                    tt.role =  tRole.length ? tRole.join() : tRole;
                    delete tt.roles;
                    delete tt.re_create;
                }
            }
            res.send(methods.formatRespond(flag, 200, '', parseUser))
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
};


//验证用户是否有展示用户的权限(包括展示何种用户)
const verifyGetAuthority = async (req, res) => {
    let flag = true, code, temp, retAuth;
    try {
        let auth = await getAuthority(req);
        if (auth.flag) {
            if (auth.data.includes('showIncludeRoot')) {
                retAuth = 'showIncludeRoot'
            } else if (auth.data.includes('showNotRoot')) {
                retAuth = 'showNotRoot'
            }
            if (!retAuth) {
                flag = false;
                code = 10008;
                temp = methods.formatRespond(flag, code, errorText.formatError(code));
                res.status(400).send(temp);
            }
        } else {
            flag = false;
            code = 10008;
            temp = methods.formatRespond(flag, code, errorText.formatError(code));
            res.status(400).send(temp);
        }
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
    return {flag, retAuth}
}

//获取单个用户的角色的数组
const getSingleUserRole = async (userId, res) => {
    let flag = true, code, temp, userRoles = [];
    try {
        let user = await model.user.findAll(
            {
                where: {
                    id: userId
                }
            }
        );
        let a = await user[0].getRoles();
        a.length && a.forEach((val) => {
            userRoles.push(val.code)
        });
        console.log(userRoles)
        //console.log(user.length,user[0].roles[0].userRole)
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    };
    return {userRoles, flag}
}

//get user detail info
const getUserDetail = () => {};

//获取非超级管理员的用户
const getNoSuperUser = async (res)=>{
    let temp, hcode,data = [];
    let sql = `
    SELECT 
    u.* 
    FROM 
    user u, 
    userRole ur 
    WHERE 
    u.id=ur.userId && ur.roleCode!='R0001'
    ;
    `;
    try {
        // verify whether the user existed before but is not valid now
        data = await model.sequelize.query(sql);
        data = data[0];
        res && res.send(methods.formatRespond(true, 200, '',data));
    } catch (err) {
        hcode = 10003;
        temp = methods.formatRespond(false, hcode, err.message + ';' + err.name);
        res && res.status(400).send(temp);
    }
    return data;
}

//获取添加用户的时候的用户角色的选项
const getRoleOption = async (req, res) => {
    let flag = true, code ,temp, option = {};
    try {
        option.role = await model.role.findAll(
            {
                where: {
                    valid: true
                }
            }
        );
        temp = methods.formatRespond(flag, 200, '', option)
        res.send(temp)
    } catch (err) {
        code = 10003;
        flag = false;
        temp = methods.formatRespond(false, code, err.message + ';' + err.name);
        res.status(400).send(temp);
    }
}

module.exports = {
    handleAdd, deleteUser ,modifyUser,
    getNoSuperUser, getRoleOption, getUsers
};