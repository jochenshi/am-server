// method used to format the respond in the similar format
const formatRespond = (resFlag, code, err, data = []) => {
    return {
        result: resFlag,
        code: code,
        error: err,
        data: []
    }
};

const interRespond = (result, code , error) => {
    return {
        result: result,
        code: code,
        error: error
    }
}

// method used to valid whether the login session is valid
const validLogin = () => {
    return true
}

module.exports = { verifyUserAdd, formatRespond, validLogin, interRespond };