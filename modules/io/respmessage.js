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
 * Module respmessage is a part of PhantomJS framework - Phantasm.
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
 * Documents the RespMessage class.
 *
 * Following class realises serializable response message which can be sent from scenario to identify the completion of its work
 *
 * @subpackage RespMessage
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

var RespMessage = function(scenario, isError, data)
{
    this.setScenario(scenario);
    this.setIsError(isError);
    this.setData(data);
}

/* Public members starts here */

/**
 * @access public
 * @var string value that indicates that this object represents response message
 */  

RespMessage.prototype.type = 'resp_message';

/**
 * @access public
 * @var string current scenario
 */  

RespMessage.prototype.scenario = '';

/**
 * @access public
 * @var bool property that indicates whether scenario finished with error or not
 */  

RespMessage.prototype.isError = false;

/**
 * @access public
 * @var object data returned from the scenario
 */  

RespMessage.prototype.data = null;

/* Public members ends here */

/* Public set methods starts here */

/**
 * Method that sets current scenario name.
 *
 * Simple method that sets current scenario name.
 *
 * @access public
 * 
 * @param string scenario name
 * 
 * @throws string 
 * 
 */  

RespMessage.prototype.setScenario = function(scenario)
{
    if (typeof scenario != 'string') {
        throw 'Scenario name is not a string';        
    }  
    
    this.scenario = scenario;
}

/**
 * Method that sets parameter value which indicates whether scenario finished with error or not.
 *
 * Simple method that sets parameter value which indicates whether scenario finished with error or not.
 *
 * @access public
 * 
 * @param bool isError parameter value
 * 
 * @throws string 
 * 
 */  

RespMessage.prototype.setIsError = function(isError)
{
    if (typeof isError != 'boolean') {
        throw '"isError" value is not boolean'; 
    }
    
    this.isError = isError;
}

/**
 * Method that sets current response data.
 *
 * Simple method that sets current response data.
 *
 * @access public
 * 
 * @param object data response data
 * 
 * @throws string 
 * 
 */  

RespMessage.prototype.setData = function(data)
{
    if (typeof data != 'object') {
        throw 'Data is not an object';
    }
    
    this.data = data;
}

/* Public set methods ends here */

exports.create = function create(scenario, isError, data) {
    "use strict";

    return new RespMessage(scenario, isError, data);
};