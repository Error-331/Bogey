if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.yandex == undefined) {
    Bogey.yandex = {};
}

if (Bogey.yandex.schemas == undefined) {
    Bogey.yandex.schemas = {};
}

Bogey.yandex.schemas.mailTopToolbar = {
    elm1: {
        sel: 'div.b-mail-dropdown:nth-of-type(1)',
                                        
        sub: {
            elm1: {
                sel: 'div.b-mail-dropdown__content:nth-of-type(1)'
            }
        }
    }
};