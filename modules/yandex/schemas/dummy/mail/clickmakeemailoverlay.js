exports.schema = {    
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: { 
            elm1: {
                sel: 'div.b-overlay',
                sub: {
                    elm1: {
                        sel: 'a.b-mail-button',
                        func: 'Bogey.utils.findOffset'
                    }
                }          
            }           
        }      
    },
    
    step2: {
        type: 'dummy',
        op: 'click',
        
        left: 'item(0).left',
        top: 'item(0).top',
        
        offset_left: 3,
        offset_top: 3,
        
        delay_before: 1000
    }           
}