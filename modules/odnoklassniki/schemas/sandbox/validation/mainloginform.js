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
        sel: '#loginPanel',
                    
        is_single: true,
        sub_is_single: true,
                    
        sub: {
            elm1: {
                sel: 'h2',
                text: [Bogey.utils.trim, 'Log in']
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
                sel: '#hook_FormButton_button_go',
                func: Bogey.utils.findOffset
            }
        }
    }    
}