require('./check-versions')()

var config  = require('../config')
if(!process.env.NODE_ENV) {
    console.log(config)
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var express = require('express')

var port = process.env.PORT || config.dev.port
var autoOpenBrowser = !!config.dev.autoOpenBrowser
var app = express()
var uri = 'http://localhost:' + port

module.exports = app.listen(port, function(err) {
    console.log(port)
    if(err) {
        console.log(err)
        return
    }

    if(autoOpenBrowser && process.env.NODE_ENV !== 'production') {
        opn(uri, {app: 'chrome'})
    }
})