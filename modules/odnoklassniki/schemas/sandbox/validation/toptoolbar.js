if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.odnoklassniki == undefined) {
    Bogey.odnoklassniki = {};
}

if (Bogey.odnoklassniki.schemas == undefined) {
    Bogey.odnoklassniki.schemas = {};
}

Bogey.odnoklassniki.schemas.topToolbar = {
    elm1: {
        sel: '#hook_Block_Portal',
                    
        is_single: true,
        sub_is_single: true,
                    
        sub: {
            elm1: {
                sel: '#portal-headline_login',
                sub: {
                    elm1: {
                        sel: '.portal-headline__login__link:nth-of-type(2)',
                        func: Bogey.utils.findOffset
                    }
                }
            }
        }
    }
};