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
                
    return { top: curtop, left: curleft, width: curWidth, height: curHeight};
}