var Response = function(module, url, status, pageStatus, operationStatus, description)
{
    this.setModule(module);
    this.setURL(url);
    this.setStatus(status);
    this.setPageStatus(pageStatus);
    this.setOperationStatus(operationStatus);
    this.setDescription(description);
}

/* Public members starts here */

/**
 * @access public
 * @var string current module 
 */  

Response.prototype.module = '';

/**
 * @access public
 * @var string current page URL
 */  

Response.prototype.url = '';

/**
 * @access public
 * @var string status of the script, can take following values: starting, processing, finishing
 */  

Response.prototype.status = 'starting';

/**
 * @access public
 * @var string status of the page, can take following values: success, fail, unknown
 */  

Response.prototype.pageStatus = 'fail';

/**
 * @access public
 * @var string status of the current operation, can take following values: success, fail, unknown
 */  

Response.prototype.operationStatus = 'fail';

/**
 * @access public
 * @var string description of the current response
 */ 

Response.prototype.description = '';

/* Public members ends here */

/* Public set methods starts here */

Response.prototype.setModule = function(module)
{
    if (typeof module != 'string') {
        throw 'Module is not a string';        
    }  
    
    this.module = module;
}

Response.prototype.setURL = function(url)
{
    if (typeof url != 'string') {
        throw 'URL is not a string';        
    }
        
    this.url = url;
}

Response.prototype.setStatus = function(status)
{
    if (typeof status != 'string') {
        throw 'Status is not a string';
    }
    
    status = status.toLowerCase();
    
    if (status != 'starting' && status != 'processing' && status != 'finishing') {
        throw 'Unknown status: ' + status;
    }
    
    this.status = status;
}

Response.prototype.setPageStatus = function(status)
{
    if (typeof status != 'string') {
        throw 'Page status is not a string';
    }
    
    status = status.toLowerCase();
    
    if (status != 'success' && status != 'fail' && status != 'unknown') {
        throw 'Unknown page status: ' + status;
    }
    
    this.pageStatus = status;
}

Response.prototype.setOperationStatus = function(status)
{
    if (typeof status != 'string') {
        throw 'Operation status is not a string';
    }
    
    status = status.toLowerCase();
    
    if (status != 'success' && status != 'fail' && status != 'unknown') {
        throw 'Unknown operation status: ' + status;
    }
    
    this.operationStatus = status;
}

Response.prototype.setDescription = function(description)
{
    if (typeof description != 'string') {
        throw 'Description is not a string';
    }
    
    this.description = description;
}

/* Public set methods ends here */

exports.create = function create(module, url, status, pageStatus, operationStatus, description) {
    "use strict";
    
    return new Response(module, url, status, pageStatus, operationStatus, description);
};