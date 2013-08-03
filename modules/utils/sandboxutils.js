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
 * Module sandboxutils is a part of PhantomJS framework - Phantasm.
 *
 * @package Phantasm
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Utilities package.
 *
 * @subpackage utils
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the sandboxutils module.
 *
 * Following module contains common functions that can be used in sandbox mode.
 *
 * @subpackage sandboxutils
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

exports.findOffset = function (obj) 
{
    var obj2 = obj;
    
    var curtop = 0;
    var curleft = 0;
    
    var curWidth = obj.offsetWidth;
    var curHeight = obj.offsetHeight;
     
    if (document.getElementById || document.all) {
        do  {
            curleft += obj.offsetLeft - obj.scrollLeft;
            curtop += obj.offsetTop - obj.scrollTop;
                        
            obj = obj.offsetParent;
            obj2 = obj2.parentNode;
                        
            while (obj2 != obj) {
                curleft -= obj2.scrollLeft;
                curtop -= obj2.scrollTop;
                obj2 = obj2.parentNode;
            }
        } while (obj.offsetParent)
    } else if (document.layers) {
        curtop += obj.y;
            curleft += obj.x;
    }
                
    return {top: curtop, left: curleft, width: curWidth, height: curHeight};
}

exports.trim = function(str)
{                    
    if (typeof str != 'string') {
        throw 'Provided user data is not a string';
    }
    
    return str.replace(/^\s+|\s+$/g, "");
}

exports.showMark = function(top, left)
{
    var div = document.createElement("div");
    div.innerHTML = "mark";
                    
    div.style.position = 'absolute';
    div.style.top = top;
    div.style.left = left;
    div.style.zIndex  = 1000;
    div.style.background = 'green';
    
    document.body.appendChild(div);    
}

exports.bindShowMarkOnClick = function()
{
    document.onclick=function(elm){                    
        var div = document.createElement("div");
        div.innerHTML = "mark";
                    
        div.style.position = 'absolute';
        div.style.top = elm.pageY + 'px';
        div.style.left = elm.pageX + 'px';
    
        div.style.zIndex  = 1000;
        div.style.background = 'green';
    
        document.body.appendChild(div); 
    };    
}

/*
 
            var schema = {
                elm1: {
                    sel: '#loginPanel',
                    is_single: true,
                    sub_is_single: true,
                    sub: {
                        elm1: {
                            sel: 'h2',
                            text: [trimFunc, 'Log in']
                        },
                        elm2: {
                            sel: '#field_email',
                            func: findOffsetFunc
                        },
                        elm3: {
                            sel: '#field_password',
                            func: findOffsetFunc
                        },
                        elm4: {
                            sel: '#hook_FormButton_button_go',
                            func: findOffsetFunc
                        }
                    }
                }                            
            }  
 
 */
exports.checkElementsBySchema = function(scheme, format)
{
    if (typeof scheme != 'object') {
        throw 'Schema parameter is not an object';
    }
    
    if (format != undefined) {
        if (typeof format != 'string') {
            throw 'Format parameter must be string';
        }
        
        format = format.toLowerCase();    
    } else {
        format = 'raw';
    }
    
    var result = new Array();
    
    var formatPlain = function(data, format)
    {    
        var elm = null;
        var subElm = null;

        for (elm in data) {
            for (subElm in data[elm]) {
                switch (format) {
                    case 'plain-objects':
                        if (typeof data[elm][subElm][0] == 'object') {
                            result.push(data[elm][subElm][0]);
                        }
                        
                        break;
                    default:
                        result.push(data[elm][subElm][0]);
                        break;
                }
                                              
                if (typeof data[elm][subElm][1] == 'object') {
                    formatPlain(data[elm][subElm][1], format);
                }                
            }          
        }
    }
        
    var validateFunc = function(usrScheme, rootElm)
    {
        var result = new Array();
        var subRes = null;
        
        // check 'text' property
        if (usrScheme.text != undefined) {
            if (typeof usrScheme.text == 'string') {
                if (rootElm.innerHTML != usrScheme.text) {
                    return false;
                }
            } else if (typeof usrScheme.text == 'object') {
                if (typeof usrScheme.text[0] == 'function' && typeof usrScheme.text[1] == 'string') {
                    subRes = usrScheme.text[0](rootElm.innerHTML);
                    if (subRes != usrScheme.text[1]) {
                        return false;
                    }
                } else {
                    throw '"text" property parameters mismatch';
                }
            } else {
                throw '"text" property must be string or object';
            }
        }    
        
        // check 'func' property
        if (usrScheme.func != undefined) {
            if (typeof usrScheme.func == 'function') {
                result.push(usrScheme.func(rootElm));
            } else {
                throw '"func" property must be function';
            }
        } else {
            result.push(true);
        }
        
        // check 'sub' property
        if (usrScheme.sub != undefined) {
            if (typeof usrScheme.sub == 'object') {
                result.push(traverseFunc(usrScheme.sub, rootElm));
            } else {
                throw '"sub" property must be object';
            }
        }  
        
        return result;
    }
     
    var traverseFunc = function(usrScheme, rootElm)
    {
        var globResult = new Array();
        var result = null;
        var subResult = false;
        
        var elm = null;
        var elmDOM = null;
        
        var selRes = null;
        
        for (elm in usrScheme) {
            // check 'sel' property
            if (usrScheme[elm].sel != undefined) {
                if (typeof usrScheme[elm].sel != 'string') {
                    throw '"sel" property is not a string';
                }
                
                if (rootElm == undefined) {
                    selRes = document.querySelectorAll(usrScheme[elm].sel);
                } else {
                    selRes = rootElm.querySelectorAll(usrScheme[elm].sel);
                }
                
                if (selRes.length <= 0) {
                    throw 'Element not found for: ' + usrScheme[elm].sel;
                }
                
                // check each element
                result = new Array();
                for (elmDOM = 0; elmDOM < selRes.length; elmDOM++) {                    
                    subResult = validateFunc(usrScheme[elm], selRes.item(elmDOM));
                    
                    if (subResult != false) {
                        result.push(subResult);
                    }                  
                } 
                                
                if (result.length <= 0) {
                    throw 'Schema validation fail';
                }
                
                globResult.push(result);
            } else {
                throw '"sel" property is not present';
            }                                  
        }
        
        return globResult;
    }
    
    // format
    switch(format) {
        case 'raw':
            return traverseFunc(scheme, undefined);
            break;
        case 'plain':
        case 'plain-objects':
            formatPlain(traverseFunc(scheme, undefined), format);
            return result;
            break;
        default:
            return traverseFunc(scheme, undefined);
            break;
    }          
}