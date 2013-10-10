if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.yandex == undefined) {
    Bogey.yandex = {};
}

if (Bogey.yandex.schemas == undefined) {
    Bogey.yandex.schemas = {};
}

Bogey.yandex.schemas.invalidRegFormData = {
    params: {
        invert: false
    },
    
    elm1: {
        sel: 'div.b-svarx__err_id_firstname_missingvalue.b-svarx__err_visible_no',
        errorMes: 'First name is not set'
    },

    elm2: {
        sel: 'div.b-svarx__err_id_lastname_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Last name is not set'
    },    

    elm3: {
        sel: 'div.b-svarx__err_id_login_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Login is not set'
    },      
    
    elm4: {
        sel: 'div.b-svarx__err_id_login_notavailable.b-svarx__err_visible_no',
        errorMes: 'Login is not available'
    },    
    
    elm5: {
        sel: 'div.b-svarx__err_id_password_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Password is not set'        
    },
    
    elm6: {
        sel: 'div.b-svarx__err_id_password_tooshort.b-svarx__err_visible_no',
        errorMes: 'Password too short'
    }, 
    
    elm7: {
        sel: 'div.b-svarx__err_id_password_prohibitedsymbols.b-svarx__err_visible_no',
        errorMes: 'Password symbols prohibited'
    },    
    
    elm8: {
        sel: 'div.b-svarx__err_id_password_toolong.b-svarx__err_visible_no',
        errorMes: 'Password too long'
    },     

    elm9: {
        sel: 'div.b-svarx__err_id_password_weak.b-svarx__err_visible_no',
        errorMes: 'Password too week'
    },
     
    elm10: {
        sel: 'div.b-svarx__err_id_password_confirm_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Password confirm is not set'
    },  
 
    elm11: {
        sel: 'div.b-svarx__err_id_password_confirm_notequal.b-svarx__err_visible_no',
        errorMes: 'Password confirm is not equal'
    },     

    elm12: {
        sel: 'div.b-svarx__err_id_hint_question_id_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Hint question is not set'
    }, 
    
    elm13: {
        sel: 'div.b-svarx__err_id_hint_answer_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Hint answer is not set'
    },  
    
    elm14: {
        sel: 'div.b-svarx__err_id_phone_number_badphonenumber.b-svarx__err_visible_no',
        errorMes: 'Phone number is not set or incorrect'
    },   
    
    elm15: {
        sel: 'div.b-svarx__err_id_answer_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Captcha is not set or incorrect'
    }    
};

// export for dummy schema
if (typeof exports != 'undefined') {
    exports.schema = Bogey.yandex.schemas.invalidRegFormData;
} 