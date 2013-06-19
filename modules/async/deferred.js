var deferred = function()
{
    console.log('331');
    /* Private members starts here */
    
    var obj = this;
    
    // reject, fail, done, unknown
    var status = 'unknown';
    
    /* Private members ends here */
    
    /* Privileged core methods starts here */
    
    this.done = function() {
        
    };
    
    this.when = function() {
        
    };
    
    /* Privileged core methods ends here */
}

exports.create = function create() {
    "use strict";
    
    return new deferred();
};