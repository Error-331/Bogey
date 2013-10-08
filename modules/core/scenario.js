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
 * Module scenario is a part of PhantomJS framework - Bogey.
 *
 * @package Bogey
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Core modules of the framework.
 *
 * @subpackage core
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the Scenario class.
 *
 * Following class is a base class for all scenarios (e.q. check proxy, scrap some content or fill some form).
 *
 * @subpackage Scenario
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

// Modules include
var deferred = require('../async/deferred');
var respmessage = require('../io/respmessage');

var syst = require('system');
var args = syst.args;

var Scenario = function(usrScenarioName)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;     
        
    /**
     * @access private
     * @var string current service name
     */      
    
    var scenarioName = 'scenario';   
    
    /**
     * @access private
     * @var boolean error flag
     */      
    
    var isError = false;    
    
    /**
     * @access private
     * @var string error description
     */     
    
    var errorDesc = '';  
    
    /**
     * @access private
     * @var object options that were extracted from the command line
     */     
    
    var options = {};
    
    /**
     * @access private
     * @var string output stream (all, console, stdout)
     */        
    
    var outputStream = 'console';
    
    /* Private members ends here */
    
    /* Private core methods starts here */ 
    
    /**
     * Method that extracts arguments from the command line.
     *
     * Method extracts all the necessary arguments needed to run the scenario. Arguments must be separated by blank space and 
     * present key/value pairs separated by the '=' sign. This method tries to convert types of some of the options, among them:
     * 
     * viewportWidth
     * viewportHeight
     * debugSandbox 
     * reloginOnStart
     *
     * @access private
     * 
     */ 

    function extractDataFromArgs()
    {
        var key = null;
        var res;
        
        var prop;
        var val;

        for (key in args) {           
            res = args[key].split('=');

            if (res.length == 2) {
                prop = res[0];
                val = res[1];

                options[prop] = val;
            }
            
            // convert types of the common options
            switch(prop) {
                case 'viewportWidth':
                case 'viewportHeight':
                    options[prop] = parseInt(val);
                    break;
                case 'debugSandbox':
                case 'reloginOnStart':
                    val = val.toLowerCase();
                    if (val == 'true') {
                        options[prop] = true;
                    } else if (val == 'false') {
                        options[prop] = false;
                    }
                    break;
            }                  
        } 
    }    
    
    /**
     * Method that configures current scenario.
     *
     * This method is default configuration method and will be called each time the scenario is created. This method tries to 
     * extract necessary configuration options from the command line and configure current scenario based on this options.
     *
     * @access private
     *
     */      
    
    function configureScenario()
    { 
        var key = null;
        
        try {    
            if (options['output'] != undefined) {
                setOutput(options['output']);
            }                                 
        } catch(e) {
            obj.sendErrorResponse(e);
            phantom.exit();
        }        
    }    
    
    /* Private core methods ends here */
    
    /* Private get methods starts here */
    /* Private get methods ends here */
    
    /* Private set methods starts here */
    
    /**
     * Method that sets current output stream.
     *
     * All the data (expect some thrown errors) will be sent to console ('console'), stdout ('stdout') or both ('all').
     *
     * @access private
     * 
     * @param string usrOutput output stream
     * 
     * @throws string 
     * 
     */     
    
    function setOutput(usrOutput)
    {
        if (typeof usrOutput != 'string') {
            throw 'Output stream parameter must be string';
        }
        
        usrOutput = usrOutput.toLowerCase();
        
        if (usrOutput != 'all' && usrOutput != 'console' && usrOutput != 'stdout') {
            throw 'Invalid output stream';
        }
        
        outputStream = usrOutput; 
    }
    
    /* Private set methods ends here */    
    
    /* Privileged core methods starts here */
            
    /**
     * Method that sends response message.
     *
     * Method creates response object, stringify it and passes it to the console.log() method. 
     *
     * @access privileged
     * 
     * @param object data that will be sent as response
     * 
     */     
    
    this.sendResponse = function(data)
    {
        if (typeof data != 'object') {
            if (data === undefined) {
                data = {};
            } else {
                data = {'data': data};
            }
        }
        
        var resp = respmessage.create(scenarioName, false, data);
        resp = JSON.stringify(resp);

        if (outputStream == 'all') {
            syst.stdout.write(resp);
            console.log(resp);
        } else if (outputStream == 'console') {
            console.log(resp);
        } else if (outputStream == 'stdout') {
            syst.stdout.write(resp);
        }             
    }    
    
    /**
     * Method that sends response message with error flag.
     *
     * Method creates response object, stringify it and passes it to the console.log() method. 
     *
     * @access privileged
     * 
     * @param object data that will be sent as response
     * 
     */      
    
    this.sendErrorResponse = function(data)
    {
        if (typeof data != 'object') {
            if (data === undefined) {
                data = {};
            } else {
                data = {'data': data};
            }
        }
             
        var resp = respmessage.create(scenarioName, true, data);
        resp = JSON.stringify(resp);
        
        if (outputStream == 'all') {
            syst.stdout.write(resp);
            console.log(resp);
        } else if (outputStream == 'console') {
            console.log(resp);
        } else if (outputStream == 'stdout') {
           syst.stdout.write(resp);
        }   
    } 
        
    /**
     * Method that starts current scenario.
     *
     * Every new scenario must overload this method to utilizy its own launching mechanics.
     *
     * @access privileged
     * 
     */        
        
    this.start = function() 
    {
    }   
    
    /**
     * Method that stops current scenario.
     *
     * Every new scenario must overload this method to utilize its own mechanics. Presumably this method must call phantom.exit()
     * at the end of the code.
     *
     * @access privileged
     * 
     */      
    
    this.stop = function() 
    {
    }  
    
    /* Privileged core methods starts here */
    
    /* Privileged get methods starts here */
    
    /**
     * Method that returns current scenario options.
     *
     * This options were extracted from the command line.
     *
     * @access privileged
     * 
     * @return object scenario options.
     * 
     */    
    
    this.getOptions = function()
    {
        return options;
    }
    
    /**
     * Method that returns current scenario name.
     *
     * Simple method that returns current scenario name.
     *
     * @access privileged
     * 
     * @return string scenario name.
     * 
     */     

    this.getScenarioName = function()
    {
        return scenarioName;
    }  
    
    /**
     * Method that returns current error flag value.
     *
     * Simple method that returns current error flag value.
     *
     * @access privileged
     * 
     * @return bool error flag value.
     * 
     */     
    
    this.getIsError = function()
    {
        return isError;
    }
    
    /**
     * Method that returns current error description.
     *
     * Simple method that returns current error description.
     *
     * @access privileged
     * 
     * @return string error description.
     * 
     */         
    
    this.getErrorDesc = function()
    {
        return errorDesc;
    }
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    /**
     * Method that sets current scenario name.
     *
     * Simple method that sets current scenario name.
     *
     * @access privileged
     * 
     * @param string usrScenarioName scenario name
     * 
     * @throws string 
     * 
     */       
    
    this.setScenarioName = function(usrScenarioName)
    {
        if (typeof usrScenarioName != 'string') {
            throw 'Scenario name is not a string';
        }
        
        if (usrScenarioName.length <= 0) {
            throw 'Scenario name length cannot be zero';
        }
        
        scenarioName = usrScenarioName;        
    }    
       
    /**
     * Method that sets error flag.
     *
     * Simple method that sets error flag.
     *
     * @access privileged
     * 
     * @param bool usrIsError error flag value
     * 
     * @throws string 
     * 
     */      
    
    this.setIsError = function(usrIsError)
    {
        if (typeof usrIsError != 'boolean') {
            throw '"isError" property must be boolean';
        }
        
        isError = usrIsError;
    }
    
    /**
     * Method that sets error description.
     *
     * Simple method that sets error description.
     *
     * @access privileged
     * 
     * @param bool desc error description
     * 
     * @throws string 
     * 
     */     
    
    this.setErrorDesc = function(desc)
    {
        if (typeof desc != 'string') {
            throw 'Error description must be string';
        }
        
        errorDesc = desc;
    }
    
    /* Privileged set methods ends here */    

    // configure scenario
    extractDataFromArgs();
    configureScenario();
    
    this.setScenarioName(usrScenarioName);
}

exports.constFunc = Scenario;
exports.create = function create(scenarioName) {
    "use strict";

    return new Scenario(scenarioName);
};