var fs = require('fs');

exports.checkImgFormat = function(imgFormat, defFormat)
{
    if (typeof imgFormat != 'string' && typeof defFormat != 'string') {
        throw 'Cannot determine file format';
    } else if (typeof imgFormat != 'string' && typeof defFormat == 'string') {
        imgFormat = defFormat;
    }
     
    if (imgFormat.length == 0) {
        throw 'File format length is zero';      
    }
    
    imgFormat = imgFormat.toLowerCase();
    
    switch(imgFormat) {
        case 'png':
        case 'jpeg':
        case 'gif':
        case 'pdf':
            return imgFormat;
            break;
        default:
            throw 'Unrecognised file format: "' + imgFormat + '"';
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