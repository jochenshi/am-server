// add user module starts
const model = require('../models');
const methods = require('../common/methods');
const errorText = require('../common/error');

// required params
const verifyRequired = ({name, account, password}) => {
    var txt = '';
    if (!account || !password || !name) {
        txt = 'name,account or password can not be empty!'
    }
    return txt;
};

//verify whether the user is already exist
const verifyUserExist = ({name, account}) => {
    (async () => {
        try {
            let user = await model.User.findAll({
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
                return {
                    result: false,
                    code: 10001,
                    error: 'username or account has already exist'
                }
            } else {
                return {
                    result: true,
                    code: 200,
                    error: ''
                }
            }
        } catch (err) {
            return {
                result: false,
                code: 101,
                error: err
            }
        }
    })();
};

//add user
const handleAdd = (req, res) => {
    let requireFlag = verifyRequired(req.body);
    if (requireFlag) {
        res.send()
    } else if (existFlag) {
        res.send()
    } else {
        
    }
    let existFlag = verifyUserExist(req.body)
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