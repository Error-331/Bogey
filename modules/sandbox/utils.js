if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.utils == undefined){
    Bogey.utils = {};
}

Bogey.utils.findOffset = function (obj) 
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

Bogey.utils.trim = function(str)
{                    
    if (typeof str != 'string') {
        throw 'Provided user data is not a string';
    }
    
    return str.replace(/^\s+|\s+$/g, "");
}

Bogey.utils.showMark = function(top, left)
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

Bogey.utils.bindShowMarkOnClick = function()
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