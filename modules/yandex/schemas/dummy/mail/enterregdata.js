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
        
        text: '$firstName.text',
        
        delay_before: 1000
    },
    
    step3: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$lastName.left',
        top: '$lastName.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: '$lastName.text',
        
        delay_before: 1000
    },   
    
    step4: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$login.left',
        top: '$login.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: '$login.text',
        
        delay_before: 1000,
        delay_after: 2000
    },      
    
    step5: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: {
            elm1: {
                sel: 'ol#suggest',
                func: ['Bogey.utils.findChildrenOffset', 'span'],
                varName: 'suggest'
            }            
        }  
    },
    
    step6: {
        type: 'dummy',
        op: 'click',
                
        left: '$suggest.left',
        top: '$suggest.top',
        
        offset_left: 15,
        offset_top: 1,
        
        func_before: function(elm){
            var data = this.getDummyVar('suggest').data;

            if (data.length == 0) {
                data = {top: 0, left: 0, width: 0, height: 0};
                this.setDummyVar('suggest', data);
                return;
            }
            
            this.setDummyVar('suggest', data[Math.floor((Math.random() * data.length)+1)]);
        },
        
        delay_before: 1000,
        delay_after: 1000        
    },
    
    step7: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$password.left',
        top: '$password.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: '$password.text',
        
        delay_before: 1000,
        delay_after: 2000
    },    
    
    step8: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$passwordConfirm.left',
        top: '$passwordConfirm.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: '$passwordConfirm.text',
        
        delay_before: 1000,
        delay_after: 2000
    },
    
    step9: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],
        
        sandbox_schema: require('../../sandbox/mail/validation/regform').schema      
    },    
    
    step10: {
        type: 'dummy',
        op: 'selectOption',
        
        left: '$hintQuestionId.left',
        top: '$hintQuestionId.top',
        
        offset_left: 3,
        offset_top: 3,
        
        optionIndex: '$hintQuestionId.optionIndex',
        
        delay_before: 1000,
        delay_after: 2000
    },
    
    step11: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$hintAnswer.left',
        top: '$hintAnswer.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: '$hintAnswer.text',
        
        delay_before: 1000,
        delay_after: 2000
    },    
    
    step12: {
        type: 'dummy',
        op: 'fillTextInput',
        
        left: '$phoneNumber.left',
        top: '$phoneNumber.top',
        
        offset_left: 3,
        offset_top: 3,
        
        text: '$phoneNumber.text',
        
        delay_before: 1000,
        delay_after: 2000
    }     
}