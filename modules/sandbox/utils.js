if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.utils == undefined){
    Bogey.utils = {};
}

Bogey.utils.findOffset = function(obj) 
{
    var edges = obj.getBoundingClientRect();
    return {top: edges.top, left: edges.left, width: edges.width, height: edges.height};
}

Bogey.utils.findChildrenOffset = function(parElm, sel)
{
    if (typeof parElm != 'object') {
        throw 'Parent element must be object';
    }
    
    if (typeof sel != 'string') {
        throw 'Child selector must be string';
    }
    
    var children = parElm.querySelectorAll(sel);
    var result = {'data': new Array()};
    var i;

    if (children.length == 0) {
        return result.data;
    }

    for (i = 0; i < children.length; i++) {
        result.data.push(Bogey.utils.findOffset(children.item(i)));
    }

    return result;
}

Bogey.utils.findSelectOffset = function(obj) 
{
    if (obj.tagName.toLowerCase() != 'select') {
        throw 'Function only accepts "select" elements';
    }

    var offset = Bogey.utils.findOffset(obj);
    
    offset.size = obj.size;
    offset.selectedIndex = obj.selectedIndex;

    return offset;
}

Bogey.utils.trim = function(str)
{                    
    if (typeof str != 'string') {
        throw 'Provided user data is not a string';
    }
    
    return str.replace(/^\s+|\s+$/g, "");
}

Bogey.utils.deleteWhitespaces = function(str)
{
    if (typeof str != 'string') {
        throw 'Provided user data is not a string';
    }

    return str.replace(/\s/g, '');;
}