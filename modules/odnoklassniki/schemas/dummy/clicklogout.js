exports.schema = {
    step1: {
        type: 'dummy',
        op: 'click',
                
        left: 0,
        top: 0,
        
        offset_left: 0,
        offset_top: 0,
        
        delay_before: 1000,
        delay_after: 2000,
    },
    
    step2: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: { 
            sel: '#mp_mm_cont',  
            sub: {
                sel: '#hook_Form_PopLayerLogoffUserForm',
                sub: {
                    sel: '#hook_FormButton_button_logoff',
                    func: 'Bogey.utils.findOffset',
                }
            }
        }      
    },
    
    step3: {
        type: 'dummy',
        op: 'click',
        
        left: 'prev(1).left',
        top: 'prev(1).top',
        
        offset_left: 3,
        offset_top: 3,
        
        delay_before: 1000
    }
}