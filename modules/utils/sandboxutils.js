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

exports.checkElementsBySchema = function(scheme)
{
    if (typeof scheme != 'object') {
        throw 'Schema parameter is not an object';
    }
    
    var result = new Array();
    var traverseFunc = function(usrScheme, rootElm)
    {
        var subRes = null;
        
        var elm = null;
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
            } else {
                throw '"sel" property is not present';
            }
            
            // check 'text' property
            if (usrScheme[elm].text != undefined) {
                if (typeof usrScheme[elm].text == 'string') {
                    if (selRes[0].innerHTML != usrScheme[elm].text) {
                        throw 'Text content of the element do not match: ' + usrScheme[elm].text;
                    }
                } else if (typeof usrScheme[elm].text == 'object') {
                    if (typeof usrScheme[elm].text[0] == 'function' && typeof usrScheme[elm].text[1] == 'string') {
                        subRes = usrScheme[elm].text[0](selRes[0].innerHTML);
                        if (subRes != usrScheme[elm].text[1]) {
                            throw 'Text content of the element do not match: "' + subRes + '"';
                        }
                    } else {
                        throw '"text" property parameters mismatch';
                    }
                } else {
                    throw '"text" property must be string or object';
                }
            }
            
            // check 'func' property
            if (usrScheme[elm].func != undefined) {
                if (typeof usrScheme[elm].func == 'function') {
                    result.push(usrScheme[elm].func(selRes[0]));
                } else {
                    throw '"func" property must be function';
                }
            }
            
            // check 'sub' property
            if (usrScheme[elm].sub != undefined) {
                if (typeof usrScheme[elm].sub == 'object') {
                    traverseFunc(usrScheme[elm].sub, selRes[0]);
                } else {
                    throw '"sub" property must be object';
                }
            }
        }
    }
    
    traverseFunc(scheme);
    return result;
}