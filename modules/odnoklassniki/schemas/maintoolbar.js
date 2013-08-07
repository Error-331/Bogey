if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.odnoklassniki == undefined) {
    Bogey.odnoklassniki = {};
}

if (Bogey.odnoklassniki.schemas == undefined) {
    Bogey.odnoklassniki.schemas = {};
}

Bogey.odnoklassniki.schemas.mainToolbar = {
    elm1: {
        sel: 'div.toolbar_c',
                    
        is_single: true,
        sub_is_single: true,
                    
        sub: {
            elm1: {
                sel: 'ul.toolbar_nav'
            },
            elm2: {
                sel: 'div.toolbar_search'
            }
        }
    }
}