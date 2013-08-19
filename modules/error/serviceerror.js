/**
 * Bogey
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
 * Module ServiceError is a part of PhantomJS framework - Bogey.
 *
 * @package Bogey
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Modules responsible for handling different errors.
 *
 * @subpackage error
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the Service class.
 *
 * Class that represents service error.
 *
 * @subpackage ServiceError
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

var ServiceError = function(code, message)
{
    this.setCode(code);
    this.setMessage(message);
}

/* Public members starts here */

/**
 * @access public
 * @var bool value that indicates that this object represents error
 */  

ServiceError.prototype.isError = true;

/**
 * @access public
 * @var int error code, can be one of following: 
 * 
 * 0 - unknown error
 * 1 - timeout
 * 2 - parse error
 * 3 - cannot open page
 * 4 - dummy schema error
 * 5 - service error
 * 
 */  

ServiceError.prototype.code = 0;

/**
 * @access public
 * @var string error message
 * 
 */  

ServiceError.prototype.message = '';

/* Public members ends here */

/* Public set methods starts here */

/**
 * Method that sets current error code.
 *
 * Simple method that sets current error code.
 *
 * @access public
 * 
 * @param int code of the error
 * 
 * @throws string 
 * 
 */ 

ServiceError.prototype.setCode = function(code)
{
    if (typeof code != 'number') {
        throw 'Code is not an integer';
    }
    
    if (code < 0) {
        throw 'Error code cannot be less than zero';
    }
    
    this.code = code;
}

/**
 * Method that sets current error message.
 *
 * Simple method that sets current error message.
 *
 * @access public
 * 
 * @param string message of the error
 * 
 * @throws string 
 * 
 */ 

ServiceError.prototype.setMessage = function(message)
{
    if (typeof message != 'string') {
        throw 'Message is not a string';        
    }
        
    this.message = message;
}

/* Public set methods ends here */

exports.create = function create(code, message) {
    "use strict";

    return new ServiceError(code, message);
};