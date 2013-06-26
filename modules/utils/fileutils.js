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

exports.isReadable = function(path)
{
    if (typeof path != 'string') {
        throw 'Path is not a string';
    }
    
    if (path.length <= 0) {
        throw 'Path is zero length';
    }
    
    return this.isReadable(path);
}

exports.extractPath = function(path)
{
    
}

exports.extractExtension = function(path)
{
    if (typeof path != 'string') {
        
    }
}