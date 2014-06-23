if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.odnoklassniki == undefined) {
    Bogey.odnoklassniki = {};
}

if (Bogey.odnoklassniki.schemas == undefined) {
    Bogey.odnoklassniki.schemas = {};
}

Bogey.odnoklassniki.schemas.mainLoginForm = {
    elm1: {
        sel: '.anonym_login',
                    
        is_single: true,
        sub_is_single: true,

        excludeFromSet: true,
                    
        sub: {
            elm1: {
                sel: '.anonym_login_it',
                excludeFromSet: true
            },
            elm2: {
                sel: '#field_email',
                func: Bogey.utils.findOffset
            },
            elm3: {
                sel: '#field_password',
                func: Bogey.utils.findOffset
            },
            elm4: {
                sel: '.anonym_login_btn',
                func: Bogey.utils.findOffset
            }
        }
    }    
}