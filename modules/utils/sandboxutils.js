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