// Modules include
var scenario = require('../../core/scenario');

var RegisterMail = function()
{ 
    //scenario.constFunc.call(this, 'register_mail');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
                
    /* Private members ends here */
    
    /* Private core methods starts here */        
    /* Private core methods ends here */
    
    /* Private get methods starts here */    
    /* Private get methods ends here */
    
    /* Private set methods starts here */    
    /* Private set methods ends here */
    
    /* Privileged core methods starts here */
    
    /**
     * Method that starts current scenario.
     *
     * Method extracts arguments from the command line and uses them to check proxy server.
     *
     * @access privileged
     * 
     */      
    
    this.start = function() 
    {      
    }  
    
    /**
     * Method that stops current scenario.
     *
     * Method sends response based on the information stored in the current object and calls phantom.exit().
     *
     * @access privileged
     * 
     */    
    
    this.stop = function() 
    {

    }      
        
    /* Privileged core methods ends here */
      
    /* Privileged get methods starts here */      
    /* Privileged get methods ends here */
};

exports.create = function create() {
    "use strict";
    RegisterMail.prototype = scenario.create('register_mail');
    return new RegisterMail('register_mail');
};  