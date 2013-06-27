var fs = require('fs');

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
    if (typeof path != 'string') {
        throw 'Given path is not a string';
    }    
    
    if (path.length == 0) {
        throw 'Given path is zero length';
    }    
    
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
    if (typeof path != 'string') {
        throw 'Given path is not a string';
    }
    
    if (path.length == 0) {
        throw 'Given path is zero length';
    }
    
    var dot = path.lastIndexOf('.');
    
    if (dot == -1) {
        throw 'Cannot extract file extension from given path';
    }

    return path.substr(dot + 1);
}

exports.addSeparator = function(path)
{
    if (typeof path != 'string') {
        throw 'Given path is not a string';
    }
    
    if (path.length == 0) {
        throw 'Given path is zero length';
    }
    
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
    var path = exports.extractPath(path); 
    
    if (fs.isDirectory(path) === true) {
        return fs.isReadable(path);
    } else {
        throw 'Given path is not a directory';
    }
}

exports.isPathWritable = function(path)
{
    var path = exports.extractPath(path); 
    
    if (fs.isDirectory(path) === true) {
        return fs.isWritable(path);
    } else {
        throw 'Given path is not a directory';
    }    
} 

exports.getDirSeparator = function()
{
    return fs.separator;
}