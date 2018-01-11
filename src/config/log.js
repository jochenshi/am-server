const log4js = require('log4js')
const {logger_level} = require('./config')

log4js.configure({
    appenders: {
        am_erver: {
            type: 'file',
            filename: 'am-server.log'
        }
    },
    categories: {
        default: {
            appenders: ['am_server'],
            level: logger_level
        }
    }
});

const logger = log4js.getLogger('am_server');

module.exports = logger;