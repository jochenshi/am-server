const model = require('../models');

// add user module
// required params
const verifyRequired = ({name, account, password}) => {
    var txt = '';
    if (!account || !password || !name) {
        txt = 'name,account or password can not be empty!'
    }
    return txt;
};

//verify whether the user is already exist
verifyUserExist = () => {
    try {
        var user = model.User.findAll({})
    }
};

const handleAdd = () => {};

module.exports = {verifyRequired}