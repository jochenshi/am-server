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
module.exports = { mysql_config, pass_encrypt }