// Modules include
var deferred = require('../async/deferred');

var Dummy = function(usrPage)
{
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
    
    /**
     * @access private
     * @var object current page to which events will be sent
     */           
    
    var page = null;
    
    /* Private members ends here */
    
    /* Private core methods starts here */
    
    function checkEssentials(coords)
    {
        if (page === null) {
            throw 'Page is not set';
        }
        
        if (typeof coords != 'object') {
            throw 'Coordinates object type mismatch';
        }     
        
        if (coords.top == undefined) {
            throw 'Coordinates top point is not set';
        }
        
        if (coords.left == undefined) {
            throw 'Coordinates left point is not set';
        }
    }
    
    /* Private core methods ends here */    
    
    /* Privileged core methods starts here */
    
    // coords.top coords.left
    this.click = function(coords)
    {
        checkEssentials(coords);
        
        page.sendEvent('mousemove', coords.left, coords.top);
        page.sendEvent('click');
    }
    
    this.fillTextInput = function(coords, text)
    {
        obj.click(coords);
        
        if (typeof text != 'string') {
            throw 'Supplied text value is not a string';
        }
        
        page.sendEvent('keypress', text, null, null);
    }
    
    /* Privileged core methods ends here */
    
    /* Privileged get methods starts here */
    
    this.getPage = function()
    {
        return page;
    }
    
    /* Privileged get methods ends here */
    
    /* Privileged set methods starts here */
    
    this.setPage = function(usrPage)
    {
        if (typeof usrPage != 'object') {
            throw 'Page is not object';
        }
        
        page = usrPage;
    }
    
    /* Privileged set methods ends here */   
    
    this.setPage(usrPage);
}

exports.constFunc = Dummy;
exports.create = function create(usrPage) {
    "use strict";
    
    return new Dummy(usrPage);
};