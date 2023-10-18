const IKEY = "DI6FAC8EDCNNRY59YWC8";
const SKEY = "Xr58Poq7uD1jruudqMXZCcu83Bksib3W0wYttpo6";
const HOST = "api-3ce74ab0.duosecurity.com";

//const axios = require("axios")//.create({baseUrl: HOST});
const https = require('https')
const moment = require('moment')
const crypto = require('crypto')


// generates authorization based on request info, integration key, and secret key
function generateAuth (date, method, path, params) {
    method = method.toUpperCase();

    var passString = date + "\n" + method + "\n" + HOST + "\n" + path + "\n" + params;
    //console.log(passString);

    var sig = crypto.createHmac('sha512', SKEY).update(passString).digest('hex')
    var auth = Buffer.from([IKEY, sig].join(':')).toString('base64')
    return 'Basic ' + auth
}

// takes the headers, host, path, and body of request and makes http request to DUO
function apiCall (options, body, callback) {
    var req = https.request(options, (res) => {
        let data = ''; 
        res.on('data', (chunk) => { 
            data = data + chunk.toString(); 
        }); 

        res.on('end', () => { 
            body = JSON.parse(data); 
            statusCode = res.statusCode;
            statusMessage = res.statusMessage;

            callback(body, statusCode, statusMessage)
        }); 
    })

    req.on('error', (error) => { 
        callback(error.message, 503, 'Service Unavailable', true)
    })

    req.write(body);
    req.end();
}


// used to check if the duo request is being sent properly (esp with authorization header)
function check(callback) {
    var path = '/auth/v2/check'
    var params = ''
    var body = ''
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, 'GET', path, params)
    }

    //console.log(headers.Authorization);

    var options = {
        'host': HOST,
        'method': 'GET',
        'path': path,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


// used to check if duo is up before making any other API calls
function ping (callback) {
    var path = '/auth/v2/ping'
    var params = ''
    var body = ''
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, 'GET', path, params)
    }

    var options = {
        'host': HOST,
        'method': 'GET',
        'path': path,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


function enroll (username, callback) {
    var path = '/auth/v2/enroll'
    var params = 'username=' + encodeURIComponent(username)
    var body = params
    var method = 'POST'
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, method, path, params),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    var options = {
        'host': HOST,
        'method': method,
        'path': path,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


function enroll_status (user_id, activation_code, callback) {
    var path = '/auth/v2/enroll_status'
    var params = 'activation_code=' + encodeURIComponent(activation_code) + '&user_id=' + encodeURIComponent(user_id)
    var body = params
    var method = 'POST'
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, method, path, params),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    //console.log(headers.Authorization);

    var options = {
        'host': HOST,
        'method': method,
        'path': path,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


function preauth (username, callback) {
    var path = '/auth/v2/preauth'
    var params = 'username=' + encodeURIComponent(username)
    var body = params
    var method = 'POST'
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, method, path, params),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    //console.log(headers.Authorization);

    var options = {
        'host': HOST,
        'method': method,
        'path': path,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


// this can take additional parameters based on the factor we select, but I assume we will use auto (simplest option) which does not require any additional parameters
// this can be modified to accept additional parameters if we find we need it
function auth (username, callback) {
    var path = '/auth/v2/auth'
    var params = 'device=auto' + '&factor=auto' + '&username=' + encodeURIComponent(username)
    var body = params
    var method = 'POST'
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, method, path, params),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    //console.log(headers.Authorization);

    var options = {
        'host': HOST,
        'method': method,
        'path': path,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


function auth_status (txid, callback) {
    var path = '/auth/v2/auth_status'
    var params = 'txid=' + encodeURIComponent(txid)
    var body = ''
    var method = 'GET'
    
    var date = moment(new Date()).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    var headers = {
        'Date': date,
        'Host': HOST,
        'User-Agent': 'nouveau_nodejs/1.0.0',
        'Authorization': generateAuth(date, method, path, params),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    //console.log(headers.Authorization);

    var options = {
        'host': HOST,
        'method': method,
        'path': path + '?' + params,
        'headers': headers,
    }

    apiCall(options, body, callback);
}


module.exports = {
    check,
    ping,
    enroll,
    enroll_status,
    preauth,
    auth,
    auth_status
};
