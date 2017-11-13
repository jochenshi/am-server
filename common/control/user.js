const handleLogin = (data) => {
    console.log(data)
}

// add user module
const verifyUserAdd = ({account, password, name, role, phone, mail}) => {
    var txt = '';
    if (!account || !password) {
        txt = 'name or account can not be empty!'
    };

    return txt;
};

const handleAdd = () => {};

module.exports = {verifyUserAdd}