const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
//const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'async-node',
    entry: path.resolve(__dirname, '../bin/www'),
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'am-server.js'
    },
    // externals: fs.readdirSync('node_modules').filter((x) => {
    //     return x !== '.bin'
    // })
    //externals: [nodeExternals(),['tedious', 'pg-hstore', 'pg', 'sqlit3']]
}