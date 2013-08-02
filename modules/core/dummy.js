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
 * Module service is a part of PhantomJS framework - Bogey.
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
 * Documents the Dummy class.
 *
 * Class for simulating user interaction with web page.
 *
 * @subpackage Dummy
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

// Modules include
var deferred = require('../async/deferred');

var Dummy = function(usrPage)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
    
    /**
     * @access private
     * @var object current page to which events will be sent
     */           
    
    var page = null;
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    /**
     * Method that checks user supplied parameters used in many methods.
     *
     * Supplied parameters must be object (array) with 'top' and 'left' numeric properties.
     *
     * @access private
     *
     * @param object coords object containing mouse coordinates
     * 
     * @throws string    
     *
     */       
    
    function checkEssentials(coords)
    {
        if (page === null) {
            throw 'Page is not set';
        }
        
        if (typeof coords != 'object') {
            throw 'Coordinates object type mismatch';
        }     
        
        if (coords.top == undefined) {
            throw 'Coordinates top point is not set';
        }
        
        if (coords.left == undefined) {
            throw 'Coordinates left point is not set';
        }
    }
    
    /* Private core methods ends here */    
    
    /* Privileged core methods starts here */
    
    /**
     * Method that simulates mouse click.
     *
     * Method sends to events to the page: 'mousemove' and 'click'.
     *
     * @access privileged
     *
     * @param object coords object containing mouse coordinates
     * @param string button of the mouse
     * 
     * @throws string    
     *
     */
    
    this.click = function(coords, button)
    {
        checkEssentials(coords);
        
        if (button != undefined) {
            if (typeof button != 'string') {
                throw 'Parameter "button" is not a string';
            }
            
            button = button.toLowerCase();
            
            if (button != 'left' && button != 'right') {
                throw 'Invalid "button" parameter: "' + button + '"';
            }
            
        } else {
            button = 'left';
        }
             
        page.sendEvent('mousemove', coords.left, coords.top, button);
        page.sendEvent('click');
    }
    
    /**
     * Method that simulates user entering input.
     *
     * Method uses click() method to actually click on the input field and set focus on it, after that actual text is entered.
     *
     * @access privileged
     *
     * @param object coords object containing mouse coordinates (coordinates of the input)
     * @param string text which will be entered
     * 
     * @throws string    
     *
     */    
    
    this.fillTextInput = function(coords, text)
    {
        obj.click(coords);
        
        if (typeof text != 'string') {
            throw 'Supplied text value is not a string';
        }
        
        page.sendEvent('keypress', text, null, null);
    }
    
    /**
     * Method that simulates user sequentially entering text for multiple input fields.
     *
     * Method uses click() method to actually click on the input field and set focus on it, after that actual text is entered.
     *
     * @access privileged
     *
     * @param array bunch of objects containing coordinates for each input and text to be entered
     * 
     * @throws string    
     *
     */      
    
    this.fillTextInputBunch = function(bunch)
    {
        if (typeof bunch != 'object') {
            throw 'Supplied "bunch" parameter is not an object';
        }
        
        var key = null;
        for (key in bunch) {
            obj.fillTextInput(bunch[key], bunch[key].text);
        }
    }
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    /**
     * Method that returns current page object.
     *
     * Simple method that returns current page object.
     *
     * @access privileged
     * 
     * @return object page.
     * 
     */       
    
    this.getPage = function()
    {
        return page;
    }
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    /**
     * Method that sets current page object.
     *
     * Simple method that sets current page object.
     *
     * @access privileged
     * 
     * @param object usrPage page object
     * 
     * @throws string 
     * 
     */     
    
    this.setPage = function(usrPage)
    {
        if (typeof usrPage != 'object') {
            throw 'Page is not object';
        }
        
        page = usrPage;
    }
    
    /* Privileged set methods ends here */   
    
    this.setPage(usrPage);
}

exports.constFunc = Dummy;
exports.create = function create(usrPage) {
    "use strict";
    
    return new Dummy(usrPage);
};