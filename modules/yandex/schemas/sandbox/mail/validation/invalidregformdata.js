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
        invert: true
    },
    
    elm1: {
        sel: 'div.b-svarx__err_id_firstname_missingvalue',
        errorMes: 'First name is not set'
    },

    elm2: {
        sel: 'div.b-svarx__err_id_lastname_missingvalue',
        errorMes: 'Last name is not set'
    },    
    
    elm3: {
        sel: 'div.b-svarx__err_id_login_notavailable',
        errorMes: 'Login is not set'
    },    
    
    elm4: {
        sel: 'div.b-svarx__err_id_password_tooshort',
        errorMes: 'Password is not set'
    },       
    
    elm5: {
        sel: 'div.b-svarx__err_id_password_confirm_notequal',
        errorMes: 'Password confirm is not set'
    },     

    elm6: {
        sel: 'div.b-svarx__err_id_hint_question_id_missingvalue',
        errorMes: 'Hint question is not set'
    }, 
    
    elm7: {
        sel: 'div.b-svarx__err_id_hint_answer_missingvalue',
        errorMes: 'Hint answer is not set'
    },  
    
    elm8: {
        sel: 'div.b-svarx__err_id_phone_number_badphonenumber',
        errorMes: 'Phone number is not set or incorrect'
    },   
    
    elm9: {
        sel: 'div.b-svarx__err_id_answer_missingvalue',
        errorMes: 'Captcha is not set or incorrect'
    }    
};

// export for dummy schema
if (typeof exports != 'undefined') {
    exports.schema = Bogey.yandex.schemas.invalidRegFormData;
} 