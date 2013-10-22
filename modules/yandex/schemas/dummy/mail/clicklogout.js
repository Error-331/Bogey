exports.schema = {    
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: require('../../sandbox/mail/validation/mailtoptoolbar').schema      
    },
    
    step2: {
        type: 'dummy',
        op: 'click',
        
        left: 'item(0).left',
        top: 'item(0).top',
        
        offset_left: 3,
        offset_top: 3,
        
        delay_before: 1000
    },
    
    step3: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: { 
            elm1: {
                sel: 'div.b-mail-dropdown__box:nth-of-type(1)',
                                        
                sub: {
                    elm1: {
                        sel: 'a.b-mail-dropdown__item__content:nth-of-type(1)',
                        func: 'Bogey.utils.findOffset'  
                    }
                }
            }           
        }      
    },    
    
    step4: {
        type: 'dummy',
        op: 'click',
        
        left: 'item(1).left',
        top: 'item(1).top',
        
        offset_left: 3,
        offset_top: 3,
        
        delay_before: 1000
    }        
}