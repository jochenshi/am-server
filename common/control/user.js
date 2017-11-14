// add user module starts
const model = require('../models');
const methods = require('../service/methods');
const errorText = require('../service/error');

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
            var user = await model.User.findAll({
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

const handleAdd = (req, res) => {
    var requireFlag = verifyRequired(req.body);
    if (requireFlag) {
        res.send()
    } else if (existFlag) {
        res.send()
    } else {
        
    }
    var existFlag = verifyUserExist(req.body)
};

module.exports = {handleAdd}