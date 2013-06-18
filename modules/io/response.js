var response = function(module, url, status, pageStatus, operationStatus, description)
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

response.prototype.module = '';

/**
 * @access public
 * @var string current page URL
 */  

response.prototype.url = '';

/**
 * @access public
 * @var string status of the script, can take following values: starting, processing, finishing
 */  

response.prototype.status = 'starting';

/**
 * @access public
 * @var string status of the page, can take following values: success, fail
 */  

response.prototype.pageStatus = 'fail';

/**
 * @access public
 * @var string status of the current operation, can take following values: success, fail
 */  

response.prototype.operationStatus = 'fail';

/**
 * @access public
 * @var string description of the current response
 */ 

response.prototype.description = '';

/* Public members ends here */

/* Public set methods starts here */

response.prototype.setModule = function(module)
{
    if (typeof module != 'string') {
        throw 'Module is not a string';        
    }  
    
    this.module = module;
}

response.prototype.setURL = function(url)
{
    if (typeof url != 'string') {
        throw 'URL is not a string';        
    }
    
    if (url.length <= 0) {
        throw 'URL length is equal or less than zero';
    }
    
    this.url = url;
}

response.prototype.setStatus = function(status)
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

response.prototype.setPageStatus = function(status)
{
    if (typeof status != 'string') {
        throw 'Page status is not a string';
    }
    
    status = status.toLowerCase();
    
    if (status != 'success' && status != 'fail') {
        throw 'Unknown page status: ' + status;
    }
    
    this.pageStatus = status;
}

response.prototype.setOperationStatus = function(status)
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

response.prototype.setDescription = function(description)
{
    if (typeof description != 'string') {
        throw 'Description is not a string';
    }
    
    this.description = description;
}

/* Public set methods ends here */

exports.response = response;