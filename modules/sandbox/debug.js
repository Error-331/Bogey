if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.debug == undefined){
    Bogey.debug = {};
}

Bogey.debug.showMark = function(top, left)
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

Bogey.debug.bindShowMarkOnClick = function()
{
    document.onclick=function(elm){                    
        var div = document.createElement("div");
        div.innerHTML = "mark";
                    
        div.style.position = 'absolute';
        div.style.top = elm.pageY + 'px';
        div.style.left = elm.pageX + 'px';
    
        div.style.zIndex  = 3000;
        div.style.background = 'green';
    
        document.body.appendChild(div); 
    };    
}