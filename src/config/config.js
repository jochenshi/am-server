const mysql_config = {
    username: "root",
    password: "Unis@123",
    database: "test_asset",
    host: "192.168.232.79",
    dialect: "mysql",
    timezone: '+8:00',
    port: 3306,
    charset:'utf8',
    define: {
        freezeTableName: true
    }
};

const pass_encrypt = 'unis1234';
const session_encrypt = 'unis_session_encrypt';
const cookie_encrypt = 'unis_cookie_encrypt';
const sig_encrypt = 'unis_sig_token';
const logger_level = 'error';

module.exports = { mysql_config, pass_encrypt, session_encrypt, cookie_encrypt, sig_encrypt, logger_level}