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

var Dummy = function(usrService)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
    
    /**
     * @access private
     * @var object current service
     */           
    
    var service = null;
    
    var sandboxResultStack = new Array();
    
    var dummySchemaVarsStack = new Array();
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    function clearSandboxResultStack()
    {
        sandboxResultStack = new Array();
    }
    
    function clearDummySchemaVarsStack()
    {
        dummySchemaVarsStack = new Array();
    }
    
    function parseItemMetaFunc(prop)
    {        
        var par1 = prop.indexOf('(');
        var par2 = prop.indexOf(')');
        
        var index = prop.substr(par1 + 1, (par2 - par1) - 1); 
        var extProp = prop.substr(prop.indexOf('.') + 1); 
        
        index = parseInt(index);

        if (typeof sandboxResultStack[index] != 'object') {
            throw 'Item with index "' + index + '" is not found in the result stack';
        }
        
        if (sandboxResultStack[index][extProp] == undefined) {
            throw 'Property "' + extProp + '" does not exist in the item "' + index + '"';
        }
        
        return sandboxResultStack[index][extProp];
    }
    
    function checkProperties(elm)
    {
        var reArr = [
            {
                re: /^item\([0-9]+\)\.[a-zA-Z]+$/,
                func: function (prop) {
                    return parseItemMetaFunc(prop);
                }
            }
        ];
        
        var prop = null;
        var re = null;        
        
        for (prop in elm) {
            if (typeof elm[prop] == 'string') {
                for (re in reArr) {
                    if (reArr[re].re.test(elm[prop])) {
                        elm[prop] = reArr[re].func(elm[prop]);
                    }
                }
            }
        }  
        
        return elm;
    }
    
    /**
     * Method that checks coordinates of the current schema element.
     *
     * Supplied parameters must be object with 'top' and 'left' numeric properties.
     *
     * @access private
     *
     * @param object elm current schema element
     * 
     * @throws string    
     *
     */       
    
    function checkCoords(elm)
    {                
        if (elm.top == undefined) {
            throw 'Coordinates top point is not set';
        }
        
        if (elm.left == undefined) {
            throw 'Coordinates left point is not set';
        }
    }
    
    /**
     * Method that checks offset of the current schema element.
     *
     * Method checks the offset of the element and add it to the top and left properties.
     *
     * @access private
     *
     * @param object elm current schema element
     * 
     * @return object current element with proccesed offset.   
     * 
     * @throws string    
     *
     */        
    
    function checkOffset(elm)
    {
        if (elm.offset != undefined) {
            if (typeof elm.offset != 'number') {
                throw 'Offset must be numeric';
            }
            
            elm.top += elm.offset;
            elm.left += elm.offset;
        }
        
        if (elm.offset_left != undefined) {
            if (typeof elm.offset_left != 'number') {
                throw 'Left offset must be numeric';
            }
            
            elm.left += elm.offset_left;
        } 
        
        if (elm.offset_top != undefined) {
            if (typeof elm.offset_top != 'number') {
                throw 'Top offset must be numeric';
            }
            
            elm.top += elm.offset_top;
        }          
                
        return elm;
    }
    
    /**
     * Method that checks "delay_before" parameter of the current schema element.
     *
     * Method checks if current parameter exist, makes a delay if necessary and executes user defined function.
     *
     * @access private
     *
     * @param object elm current schema element
     * @param function func user defined function
     * 
     * @return object deferred object.    
     *
     */     
    
    function checkDelayBefore(elm, func)
    {
        var def = deferred.create();
        
        if (typeof func != 'function') {
            def.reject('Parameter "func" must be function');
            return def;
        }
        
        if (elm.delay_before != undefined) {
            if (typeof elm.delay_before != 'number' || elm.delay_before <= 0) {
                def.reject('Invalid "delay_before" parameter: "' + elm.delay_before + '"');
                return def;
            }
            
            setTimeout(function(){
                func();
                def.resolve();
            }, elm.delay_before);                       
        } else {
            func();
            def.resolve();   
        }
               
        return def;
    }
    
    /**
     * Method that checks "delay_after" parameter of the current schema element.
     *
     * Method checks if current parameter exist and makes a delay if necessary.
     *
     * @access private
     *
     * @param object elm current schema element
     * 
     * @return object deferred object.    
     *
     */      
    
    function checkDelayAfter(elm)
    {
        var def = deferred.create();
        
        if (elm.delay_after != undefined) {
            if (typeof elm.delay_after != 'number' || elm.delay_after <= 0) {
                def.reject('Invalid "delay_after" parameter: "' + elm.delay_after + '"');
                return def;
            }
            
            setTimeout(function(){
                def.resolve();
            }, elm.delay_after);                       
        } else {
            def.resolve();   
        }
               
        return def;        
    }
    
    /**
     * Method that simulates mouse click.
     *
     * Method sends to events to the page: 'mousemove' and 'click'.
     *
     * @access private
     *
     * @param object elm current element of the schema
     * 
     * @return object deferred object.  
     *
     */    
    
    function click(elm)
    {
        var def = deferred.create();
        var page = service.getPage();  
        
        var execFunc = function(){
            page.sendEvent('mousemove', elm.left, elm.top, elm.btn);
            page.sendEvent('click');     
        }
        
        // check coords
        try{
            checkCoords(elm);
        } catch(e) {
            def.reject(e);
            return def;
        }    
        
        // check offset
        try{
            elm = checkOffset(elm);
        } catch(e) {
            def.reject(e);
            return def;            
        }
                
        // check mouse button
        if (elm.btn != undefined) {
            if (typeof elm.btn != 'string') {
                def.reject('"btn" parameter must be string');
                return def;
            }
            
            elm.btn = elm.btn.toLowerCase();
        } else {
            elm.btn = 'left';
        }
        
        // check delay_before
        checkDelayBefore(elm, execFunc).done(function(){
            // check delay_after
            checkDelayAfter(elm).done(function(){
                def.resolve();
            }).fail(function(error){
                def.reject(error);
                return def;
            });
        }).fail(function(error){
            def.reject(error);
            return def;            
        });
                
        return def;
    }
    
    /**
     * Method that simulates user entering input.
     *
     * Method actually click on the input field and set focus on it, after that actual text is entered.
     *
     * @access private
     *
     * @param object elm current element of the schema
     * 
     * @return object deferred object.  
     *
     */        
    
    function fillTextInput(elm)
    {
        var def = deferred.create();
        var page = service.getPage();  
        
        var execFunc = function(){
            page.sendEvent('mousemove', elm.left, elm.top, 'left');
            page.sendEvent('click');   
                
            page.sendEvent('keypress', elm.text, null, null);  
        }        
        
        // check coords
        try{
            checkCoords(elm);
        } catch(e) {
            def.reject(e);
            return def;
        }  
        
        // check offset
        try{
            elm = checkOffset(elm);
        } catch(e) {
            def.reject(e);
            return def;            
        }        
        
        // check text
        if (typeof elm.text != 'string') {
            def.reject('Invalid parameter "text"');
            return def;
        }

        // check delay_before
        checkDelayBefore(elm, execFunc).done(function(){
            // check delay_after
            checkDelayAfter(elm).done(function(){
                def.resolve();
            }).fail(function(error){
                def.reject(error);
                return def;
            });
        }).fail(function(error){
            def.reject(error);
            return def;            
        });
        
        return def;
    }
    
    function runSandboxSchemaElm(elm)
    {
        var def = deferred.create();       
        var res = null;
        
        if (typeof elm != 'object') {
            def.reject('Schema element is not an object');
            return def;
        }        
        
        service.validatePageByDummySchema(elm).done(function(result){
            for (res in result) {
                sandboxResultStack.push(result[res]);
            }

            def.resolve();
        }).fail(function(error){
            def.reject(error.message);
        });
        
        return def;
    }
    
    function runDummySchemaElm(elm)
    {
        var def = deferred.create();
        var subDef = null;
        
        if (typeof elm != 'object') {
            def.reject('Schema element is not an object');
            return def;
        }
        
        if (typeof elm.op != 'string') {
            def.reject('Schema operation cannot be undefined');
            return def;
        }  
        
        elm.op = elm.op.toLowerCase();
        elm = checkProperties(elm);
               
        switch(elm.op){
            case 'click':
                subDef = click(elm);
                break;
                
            case 'filltextinput':
                subDef = fillTextInput(elm);
                break;
            
            default:
                def.reject('Unrecognised operation: "' + elm.op + '"');
                return def;
                break;
        }        
        
        subDef.done(function(){
            def.resolve();
        }).fail(function(error){
            def.reject(error);
        });
        
        return def;
    }
    
    /**
     * Method that processes "dummy" schema element.
     *
     * Method processes "dummy" schema element, based on the data of the element current method executes corresponding action.
     *
     * @access private
     *
     * @param object elm "dummy" schema element
     * 
     * @return object deferred object.
     *
     */       
        
    function runSchemaElm(elm)
    {
        var def = deferred.create();
        var subDef = null;    

        if (typeof elm != 'object') {
            def.reject('Schema element is not an object');
        }
        
        if (elm.type != undefined) {
            if (typeof elm.type != 'string') {
                def.reject('Schema type must be string');
            }
            
            elm.type = elm.type.toLowerCase();  
        } else {
            elm.type = 'dummy';
        }
        
        switch (elm.type) {
            case 'dummy':
                subDef = runDummySchemaElm(elm);
                break;
                
            case 'sandbox':
                subDef = runSandboxSchemaElm(elm);
                break;
            
            default:
                throw 'Unrecognised schema type: "' + elm.type + '"';
                break;
        }
        
        subDef.done(function(){
            def.resolve();
        }).fail(function(error){
            def.reject(error);
        });
        
        return def;
    }
    
    /* Private core methods ends here */    
    
    /* Privileged core methods starts here */
    
    this.addDummySchemaVar = function(key, val)
    {        
        if (typeof key != 'string') {
            throw 'Dummy schema variable key must be string';
        }    
        
        if (key.length == 0) {
            throw 'Dummy schema variable key length cannot be zero';
        }
        
        if (val === undefined) {
            throw 'Dummy schema variable cannot be undefined';
        }
        
        dummySchemaVarsStack[key] = val;
    }
    
    /**
     * Method that runs "dummy" schema.
     *
     * Method runs user defined "dummy" schema which is used to simulate real user interaction with web page.
     *
     * @access privileged
     *
     * @param object schema "dummy" schema
     * 
     * @return object deferred object.
     * 
     * @throws string   
     *
     */      
                   
    this.runSchema = function(schema)
    {
        clearSandboxResultStack();
        
        if (typeof schema != 'object') {
            throw 'Schema for "dummy" is not an object';
        }

        var def = deferred.create();
                
        var key = '';
        var keys = new Array();
        var i = 0;
        
        var page = service.getPage();
                
        // get schema keys
        for (key in schema) {
            keys.push(key);
        }
                        
        var loopFunc = function() {          
            if (keys[i] == undefined) {
                clearDummySchemaVarsStack();
                
                def.resolve();
                return;
            }
            
            runSchemaElm(schema[keys[i]]).done(function(){     
                i++;
                loopFunc();
            }).fail(function(error){
                def.reject(error);
                return;
            });                    
        }
        
        loopFunc();
        return def;
    }
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    /**
     * Method that returns current service object.
     *
     * Simple method that returns current service object.
     *
     * @access privileged
     * 
     * @return object service.
     * 
     */       
    
    this.getService = function()
    {
        return service;
    }
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    /**
     * Method that sets current service object.
     *
     * Simple method that sets current service object.
     *
     * @access privileged
     * 
     * @param object usrService service object
     * 
     * @throws string 
     * 
     */     
    
    this.setService = function(usrService)
    {
        if (typeof usrService != 'object') {
            throw 'Service is not object';
        }
        
        service = usrService;
    }
    
    /* Privileged set methods ends here */   
    
    this.setService(usrService);
}

exports.constFunc = Dummy;
exports.create = function create(usrService) {
    "use strict";
    
    return new Dummy(usrService);
};