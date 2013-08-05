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
 * Module fileutils is a part of PhantomJS framework - Phantasm.
 *
 * @package Phantasm
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Utilities module.
 *
 * @subpackage utils
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the fileutils module.
 *
 * Following module contains common files manipulation methods.
 *
 * @subpackage fileutils
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

var fs = require('fs');

function checkPathLength(path)
{
    if (typeof path != 'string') {
        throw 'Given path is not a string';
    }    
    
    if (path.length == 0) {
        throw 'Given path is zero length';
    }     
   
    return;
}

exports.checkImgExt = function(imgExt, defExt)
{
    if (typeof imgExt != 'string' && typeof defExt != 'string') {
        throw 'Cannot determine file extension';
    } else if (typeof imgExt != 'string' && typeof defExt == 'string') {
        imgExt = defExt;
    }
     
    if (imgExt.length == 0) {
        throw 'File extension length is zero';      
    }
    
    imgExt = imgExt.toLowerCase();
    
    switch(imgExt) {
        case 'png':
        case 'jpeg':
        case 'gif':
        case 'pdf':
            return imgExt;
            break;
        default:
            throw 'Unrecognised file format: "' + imgExt + '"';
            break;
    }    
}

exports.checkImgName = function(imgName, defName)
{
    if (typeof imgName != 'string' && typeof defName != 'string') {
        throw 'Image name is not a string';
    } else if (typeof imgName != 'string' && typeof defName == 'string') {
        imgName = defName;
    }
        
    if (imgName.length == 0) {
        throw 'Image name length is zero';      
    }
    
    return imgName;
}

exports.extractPath = function(path)
{   
    checkPathLength(path);
    
    var sep = path.lastIndexOf(fs.separator);
     
    if (sep == -1) {
        try {
            var ext = exports.extractExtension(path);
            return '';
        } catch(error) {
            return path;
        }  
    } else if (sep == 0) {
        try {
            var ext = exports.extractExtension(path);
            return fs.separator;
        } catch(error) {
            return path;
        }          
    } else {
        return path.substr(0, sep + 1); 
    }
}

exports.extractExtension = function(path)
{    
    checkPathLength(path);
    
    var dot = path.lastIndexOf('.');
    
    if (dot == -1) {
        throw 'Cannot extract file extension from given path';
    }

    return path.substr(dot + 1);
}

exports.addSeparator = function(path)
{
    checkPathLength(path);
    
    var sep = path.lastIndexOf(fs.separator);

    if (sep == -1 || sep == 0) {
        path = path + fs.separator;
        return path;
    } else {
        if (sep < path.length) {
            path = path + fs.separator;
        } else {
            return path;
        }
    }
}

exports.isPathReadable = function(path)
{
    checkPathLength(path);
    
    var path = exports.extractPath(path); 
    
    if (fs.isDirectory(path) === true) {
        return fs.isReadable(path);
    } else {
        throw 'Given path is not a directory';
    }
}

exports.isPathWritable = function(path)
{
    checkPathLength(path);
    
    var path = exports.extractPath(path); 
    
    if (fs.isDirectory(path) === true) {
        return fs.isWritable(path);
    } else {
        throw 'Given path is not a directory';
    }    
} 

exports.isReadable = function(path)
{
    checkPathLength(path);
    return fs.isReadable(path);
}

exports.isWritable = function(path)
{
    checkPathLength(path);
    return fs.isWritable(path);  
} 

exports.isValidImage = function(path)
{
    checkPathLength(path);  
    exports.checkImgExt(exports.extractExtension(path));
    return fs.isReadable(path);
}

exports.deleteIfExist = function(path)
{
    if (fs.isFile(path)) {
        fs.remove(path);
    }
}

exports.getDirSeparator = function()
{
    return fs.separator;
}

exports.getCurWorkDir = function()
{
    return fs.workingDirectory;
}