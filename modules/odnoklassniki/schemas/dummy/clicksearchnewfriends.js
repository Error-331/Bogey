exports.schema = {    
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: { 
            elm1: {
                sel: '#hook_Block_LeftColumnTopCardUser',
                sub: {
                    elm1: {
                        sel: 'ul.u-menu',
                        sub: {
                            elm1: {
                                sel: 'em.tico_simb_txt',
                                func: 'Bogey.utils.findOffset'                                
                            }
                        }
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
        
        offset_left: 0,
        offset_top: 0,
        
        delay_before: 1000,
        delay_after: 2000
    },
    
    step3: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: { 
            elm1: {
                sel: 'i.ic_friend',
                func: 'Bogey.utils.findOffset'   
            }           
        }      
    },

    step4: {
        type: 'dummy',
        op: 'click',
        
        left: 'item(1).left',
        top: 'item(1).top',
        
        offset_left: 50,
        offset_top: 0
    }
}