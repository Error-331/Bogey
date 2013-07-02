/**
 * Phantasm
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the GNU GENERAL PUBLIC LICENSE (Version 3)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to red331@mail.ru so we can send you a copy immediately.
 *
 * Module logmessage is a part of PhantomJS framework - Phantasm.
 *
 * @package Phantasm
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Input/Output modules of the framework.
 *
 * @subpackage io
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the LogMessage class.
 *
 * Following class realises serializable log message which can be used to monitor status of the current service.
 *
 * @subpackage LogMessage
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

var LogMessage = function(service, url, status, pageStatus, operationStatus, description)
{
    this.setService(service);
    this.setURL(url);
    this.setStatus(status);
    this.setPageStatus(pageStatus);
    this.setOperationStatus(operationStatus);
    this.setDescription(description);
}

/* Public members starts here */

/**
 * @access public
 * @var string current service
 */  

LogMessage.prototype.service = '';

/**
 * @access public
 * @var string current page URL
 */  

LogMessage.prototype.url = '';

/**
 * @access public
 * @var string status of the script, can take following values: starting, processing, finishing
 */  

LogMessage.prototype.status = 'starting';

/**
 * @access public
 * @var string status of the page, can take following values: success, fail, unknown
 */  

LogMessage.prototype.pageStatus = 'fail';

/**
 * @access public
 * @var string status of the current operation, can take following values: success, fail, unknown
 */  

LogMessage.prototype.operationStatus = 'fail';

/**
 * @access public
 * @var string description of the current log message
 */ 

LogMessage.prototype.description = '';

/* Public members ends here */

/* Public set methods starts here */

LogMessage.prototype.setService = function(service)
{
    if (typeof service != 'string') {
        throw 'Service is not a string';        
    }  
    
    this.service = service;
}

LogMessage.prototype.setURL = function(url)
{
    if (typeof url != 'string') {
        throw 'URL is not a string';        
    }
        
    this.url = url;
}

LogMessage.prototype.setStatus = function(status)
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

LogMessage.prototype.setPageStatus = function(status)
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

LogMessage.prototype.setOperationStatus = function(status)
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

LogMessage.prototype.setDescription = function(description)
{
    if (typeof description != 'string') {
        throw 'Description is not a string';
    }
    
    this.description = description;
}

/* Public set methods ends here */

exports.create = function create(service, url, status, pageStatus, operationStatus, description) {
    "use strict";

    return new LogMessage(service, url, status, pageStatus, operationStatus, description);
};