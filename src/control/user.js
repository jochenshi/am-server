// add user module starts
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

// required params
const verifyRequired = ({name, account, password}, res) => {
    let flag = true;
    if (!account || !password || !name) {
        //txt = 'name,account or password can not be empty!';
        flag = false;
        const temp = methods.formatRespond(false, 10000, errorText.formatError(10000));
        res.status(400).send(temp);
    }
    return flag;
};

//verify whether the user is already exist
const verifyUserExist = ({name, account}, res) => {
    (async () => {
        let temp, code, flag = true;
        try {
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
        return flag;
    })();
};

//add user
const handleAdd = (req, res) => {
    let requireFlag = verifyRequired(req.body, res);
    if (!requireFlag) {
        return
    }
    let existFlag = verifyUserExist(req.body, res);
    if (!existFlag) {
        return
    }
    // execute add user operation
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