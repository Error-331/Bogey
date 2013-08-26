if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.utils == undefined){
    Bogey.utils = {};
}

Bogey.utils.findOffset = function(obj) 
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