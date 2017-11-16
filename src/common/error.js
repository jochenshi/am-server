// error message handle module
const formatError = (code) => {
    var txt;
    switch (code) {
        case 200:
            txt = 'request success';
            break;
        case 10000:
            txt = 'name,account or password can not be empty!';
            break;
        case 10001:
            txt = '用户名或账户已经存在。';
            break;
    }
    return txt
}

module.exports = {formatError};