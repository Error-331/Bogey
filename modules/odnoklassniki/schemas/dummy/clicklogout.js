exports.schema = {
    step1: {
        type: 'dummy',
        op: 'click',
                
        left: 0,
        top: 0,
        
        offset_left: 0,
        offset_top: 0,
        
        delay_before: 1000,
        delay_after: 2000
    },
    
    step2: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: { 
            elm1: {
                sel: '#mp_mm_cont',
                sub: {
                    elm1: {
                        sel: '#hook_Form_PopLayerLogoffUserForm',
                        sub: {
                            elm1: {
                                sel: '#hook_FormButton_button_logoff',
                                func: 'Bogey.utils.findOffset'                                
                            }
                        }
                    }
                }
            }
             

        }      
    },
    
    step3: {
        type: 'dummy',
        op: 'click',
        
        left: 'item(0).left',
        top: 'item(0).top',
        
        offset_left: 3,
        offset_top: 3,
        
        delay_before: 1000
    }
}