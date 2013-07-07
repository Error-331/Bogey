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
 * Module scenario is a part of PhantomJS framework - Phantasm.
 *
 * @package Phantasm
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

var Scenario = function(configObj, usrScenarioName)
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
    
    /* Private members ends here */
    
    /* Private core methods starts here */  
    /* Private core methods ends here */
    
    /* Privileged core methods starts here */
    
    this.createDefered = function()
    {
        return deferred.create();
    }
    
    /**
     * Method that configures current Scenario.
     *
     * Every new scenario must overload this method to configure only necessary options.
     *
     * @access privileged
     *
     * @param object configObj object with configuration options
     *
     */     
    
    this.configureScenario = function(configObj) 
    {
        if (typeof configObj != 'object') {         
            return;
        }
    }     
    
    this.start = function() 
    {
    }   
    
    this.stop = function() 
    {
    }  
    
    /* Privileged core methods starts here */
    
    /* Privileged get methods starts here */
    
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
    
    /* Privileged set methods ends here */    

    this.setScenarioName(usrScenarioName);
    this.configureScenario(configObj);
}

exports.constFunc = Scenario;
exports.create = function create(configObj, scenarioName) {
    "use strict";

    return new Scenario(configObj, scenarioName);
};