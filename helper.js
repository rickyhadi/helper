function helper(){
    var detectBrowser = require('browser-detect');
    var appConfig = require('appconfig');
	var redis = require('rediswrapper')(appConfig.App.Redis);
	var crypto = require('cryptowrapper')(appConfig.App.Crypto);
    
	var obj={};
    
    obj.isLogin = function isLogin(req) {
        var result = false;
        var session = obj.getSession(req);
        if(session){
            result = true;
        }
        return result;
    };
    obj.encrypt = function(input){
        return crypto.encrypt(input);
    };
    obj.decrypt = function(input){
        return crypto.decrypt(input);
    };
    obj.setRedis = function setRedis(key, value) {
        redis.set(key, value);
    };
    obj.getRedis = async function getRedis(key) {
        return await redis.get(key);
    };
    obj.delRedis = function selRedis(key) {
        redis.del(key);
    };
    obj.getMemberObject = async function getMemberObject(req) {
        var result = {};
        var session = obj.getSession(req);
        if(session){
            result = await obj.getRedis(session);
        }
        return result;
    };
    obj.getSession = function getSession(req) {
        var keysession = appConfig.App.Cookie.Key_Session;
        return req.cookies[keysession];
    };
    obj.getClientBrowser = function getClientBrowser(req) {
        var browser = '_Other'
        var browserclient = detectBrowser(req.headers['user-agent']);
        switch(browserclient.name){
            case 'chrome' : browser = '_Chrome'; break;
            case 'firefox' : browser = '_FF'; break;
            case 'ie' : 
                if(browserclient.versionNumber === 8){
                    browser = '_IE8';
                }
                else if(browserclient.versionNumber === 7){
                    browser = '_IE7';
                }
                else if(browserclient.versionNumber === 6){
                    browser = '_IE6';
                }
                else{
                    browser = '_IE';
                }
                break;
        }
        return browser;
    };
    return obj;
}

module.exports = helper;