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
        sel: 'div.b-svarx__err_id_login_prohibitedsymbols.b-svarx__err_visible_no',
        errorMes: 'Login contains prohibited symbols'
    },  
    
    elm6: {
        sel: 'div.b-svarx__err_id_login_startswithdigit.b-svarx__err_visible_no',
        errorMes: 'Login starts with digit'
    },      
    
    elm7: {
        sel: 'div.b-svarx__err_id_login_toolong.b-svarx__err_visible_no',
        errorMes: 'Login is too long'
    },     
   
    elm8: {
        sel: 'div.b-svarx__err_id_login_startswithdot.b-svarx__err_visible_no',
        errorMes: 'Login starts with a dot'
    },   
    
    elm9: {
        sel: 'div.b-svarx__err_id_login_startswithhyphen.b-svarx__err_visible_no',
        errorMes: 'Login starts with a hyphen'
    },    
    
    elm10: {
        sel: 'div.b-svarx__err_id_login_endswithhyphen.b-svarx__err_visible_no',
        errorMes: 'Login ends with a hyphen'
    },      
  
    elm11: {
        sel: 'div.b-svarx__err_id_login_doubleddot.b-svarx__err_visible_no',
        errorMes: 'Login can not contain two or more repeated dots'
    },    
    
    elm12: {
        sel: 'div.b-svarx__err_id_login_doubledhyphen.b-svarx__err_visible_no',
        errorMes: 'Login cannot contain two or more repeated hyphens'
    },       
    
    elm13: {
        sel: 'div.b-svarx__err_id_login_dothyphen.b-svarx__err_visible_no',
        errorMes: 'Login cannot contain dot followed by hyphen'
    },    
    
    elm14: {
        sel: 'div.b-svarx__err_id_login_hyphendot.b-svarx__err_visible_no',
        errorMes: 'Login cannot contain hyphen followed by dot'
    },     
    
    elm15: {
        sel: 'div.b-svarx__err_id_login_endswithdot.b-svarx__err_visible_no',
        errorMes: 'Login cannot ends with a dot'
    },     
    
    elm16: {
        sel: 'div.b-svarx__err_id_password_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Password is not set'        
    },
    
    elm17: {
        sel: 'div.b-svarx__err_id_password_tooshort.b-svarx__err_visible_no',
        errorMes: 'Password too short'
    }, 
    
    elm18: {
        sel: 'div.b-svarx__err_id_password_prohibitedsymbols.b-svarx__err_visible_no',
        errorMes: 'Password symbols prohibited'
    },    
    
    elm19: {
        sel: 'div.b-svarx__err_id_password_toolong.b-svarx__err_visible_no',
        errorMes: 'Password too long'
    },     

    elm20: {
        sel: 'div.b-svarx__err_id_password_weak.b-svarx__err_visible_no',
        errorMes: 'Password too week'
    },
     
    elm21: {
        sel: 'div.b-svarx__err_id_password_confirm_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Password confirm is not set'
    },  
 
    elm22: {
        sel: 'div.b-svarx__err_id_password_confirm_notequal.b-svarx__err_visible_no',
        errorMes: 'Password confirm is not equal'
    },     

    elm23: {
        sel: 'div.b-svarx__err_id_hint_question_id_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Hint question is not set'
    }, 
    
    elm24: {
        sel: 'div.b-svarx__err_id_hint_question_toolong.b-svarx__err_visible_no',
        errorMes: 'Hint question is too long'
    },       
    
    elm25: {
        sel: 'div.b-svarx__err_id_hint_answer_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Hint answer is not set'
    },  
    
    elm26: {
        sel: 'div.b-svarx__err_id_hint_answer_toolong.b-svarx__err_visible_no',
        errorMes: 'Hint answer is too long'
    },      
       
    elm27: {
        sel: 'div.b-svarx__err_id_phone_number_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Phone number is not set'
    },         
       
    elm28: {
        sel: 'div.b-svarx__err_id_phone_number_badphonenumber.b-svarx__err_visible_no',
        errorMes: 'Phone number is incorrect'
    },   
    
    elm29: {
        sel: 'div.b-svarx__err_id_answer_missingvalue.b-svarx__err_visible_no',
        errorMes: 'Captcha is not set'
    },
    
    elm30: {
        sel: 'div.b-svarx__err_id_answer_captchalocate.b-svarx__err_visible_no',
        errorMes: 'Captcha control sum is incorrect'
    },
    
    elm31: {
        sel: 'div.b-svarx__err_id_answer_incorrect.b-svarx__err_visible_no',
        errorMes: 'Captcha is not set'
    }      
};

// export for dummy schema
if (typeof exports != 'undefined') {
    exports.schema = Bogey.yandex.schemas.invalidRegFormData;
} 