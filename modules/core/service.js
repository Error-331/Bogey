// Modules include
var page = require('webpage');
var response = require('../io/response');

var Service = function(usrSystemKey, usrModuleName)
{
    /* Private members starts here */
    
    var systemKey = '';
    var curPage = page.create();
    var moduleName = 'service';
    
    /* Private members ends here */
    
    /* Privileged core methods starts here */
    
    this.logProcess = function(url, status, pageStatus, operationStatus, description)
    {
        var resp = response.create(moduleName, url, status, pageStatus, operationStatus, description);
        console.log(JSON.stringify(resp));   
    }
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    this.getSystemKey = function()
    {
        return systemKey;
    }
    
    this.getPage = function()
    {
        return curPage;
    }

    this.getModuleName = function()
    {
        return moduleName;
    }
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    this.setSystemKey = function(usrSystemKey)
    {
        if (typeof usrSystemKey != 'string') {
            throw 'System key is not a string'
        }
        
        systemKey = usrSystemKey;
    }
    
    this.setModuleName = function(usrModuleName)
    {
        if (typeof usrModuleName != 'string') {
            throw 'Module name is not a string';
        }
        
        if (usrModuleName.length <= 0) {
            throw 'Module name length cannot be zero';
        }
        
        moduleName = usrModuleName;        
    }
    
    /* Privileged set methods ends here */  
    
    this.setSystemKey(usrSystemKey); 
    this.setModuleName(usrModuleName);
}

exports.constFunc = Service;
exports.create = function create(systemKey, moduleName) {
    "use strict";
    
    return new Service(systemKey, moduleName);
};