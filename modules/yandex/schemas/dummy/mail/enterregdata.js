exports.schema = {    
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: require('../../sandbox/mail/validation/regform').schema      
    },
    
    step2: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$firstName.left',
        top: '$firstName.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: 'Test1',
        
        delay_before: 1000
    },
    
    step3: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$lastName.left',
        top: '$lastName.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: 'Test1',
        
        delay_before: 1000
    },   
    
    step4: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$login.left',
        top: '$login.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: 'Test1',
        
        delay_before: 1000
    },       
}