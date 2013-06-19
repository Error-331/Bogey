var deferred = function()
{
    /* Private members starts here */
    
    var obj = this;
    
    // reject, fail, done, unknown
    var status = 'unknown';
    
    var doneFunctions = new Array();
    
    /* Private members ends here */
    
    /* Privileged core methods starts here */
    
    this.done = function() {
        if (arguments.length == 0) {
            return;
        }

        var i = 0;
        var j = 0;
        
        for(i = 0; i < arguments.length; i++){            
            if (typeof arguments[i] == 'function') {
                if (this.status == 'unknown') {
                    doneFunctions.push(arguments[i]);
                } else if (this.status == 'done') {
                    arguments[i]();
                }                             
            } else if (typeof arguments[i] == 'object') {
                for (j = 0; j < arguments[i].length; j++) {
                    if (typeof arguments[i][j] == 'function') {
                        if (this.status == 'unknown') {
                            doneFunctions.push(arguments[i][j]);
                        } else if (this.status == 'done') {
                            arguments[i][j]();
                        }   
                    }
                }
            }
        } 
        
        
    };
    
    this.when = function() {
        
    };
    
    /* Privileged core methods ends here */
}

exports.create = function create() {
    "use strict";
    
    return new deferred();
};