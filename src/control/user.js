
// add user module starts
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

// required params
const verifyRequired = ({name, account, password, phone, email}, res) => {
    let flag = true;
    if (!account || !password || !name || !phone || !email) {
        //txt = 'name,account or password can not be empty!';
        flag = false;
        const temp = methods.formatRespond(false, 10000, errorText.formatError(10000));
        res.status(400).send(temp);
    }
    return flag;
};

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
            code = 20000;
            temp = methods.formatRespond(false, code, err);
            res.status(400).send(temp);
        }
        return flag
};

const executeAdd = async ({name, account, password, role, phone, email, description},res) => {
        console.log('go in add');
        let temp, code, flag = true;
        try {
            await model.user.create({
                id: 'id_' + Buffer.from(account).toString('hex'),
                name: name,
                account: account,
                password: methods.passEncrypt(password),
                role: role,
                phone: phone,
                email: email,
                isValid: true,
                createUser: 'testuser1',
                createTime: Date.now(),
                description: description
            });
            temp = methods.formatRespond(true, 200);
            res.send(temp)
        } catch (err) {
            code = 10003;
            flag = false;
            temp = methods.formatRespond(false, code, err.message + ';' + err.name);
            res.status(400).send(temp);
        }
};

//add user
const handleAdd = async (req, res) => {
    let requireFlag = verifyRequired(req.body, res);
    if (!requireFlag) {
        return
    }
    const existFlag = await verifyUserExist(req.body ,res);
    if (!existFlaf) {
        return
    }
    // all validation passed and execute add user operation
    await executeAdd(req.body, res);
};

//delete user
const deleteUser = (req, res) => {};

//modify user
const modifyUser = (req, res) => {};

//inquire specific user according to search info
const inquireUser = () => {};

//get users and show user according to different page
const getUsers = () => {};

//get user detail info
const getUserDetail = () => {};

module.exports = {handleAdd}