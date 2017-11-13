var verifyUserAdd = ({name, account}) => {
    var txt = '';
    if (!name || !account) {
        txt = 'name or account can not be empty!'
    };
    return txt;
};

// method used to format the respond in the similar format
const formatRespond = (result, code , err) => {
    return {
        result: result,
        code: code,
        err: err
    }
};

// method used to valid whether the login session is valid
const validLogin = () => {
    return true
}

module.exports = { verifyUserAdd, formatRespond, validLogin };