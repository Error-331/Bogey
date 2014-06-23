if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.odnoklassniki == undefined) {
    Bogey.odnoklassniki = {};
}

if (Bogey.odnoklassniki.schemas == undefined) {
    Bogey.odnoklassniki.schemas = {};
}

Bogey.odnoklassniki.schemas.groupMain = {
    elm1: {
        sel: '#hook_Block_AltGroupMainMembersRB',

        is_single: true,
        sub_is_single: true,

        excludeFromSet: true,

        sub: {
            elm1: {
                sel: '.hcount',
                func: Bogey.utils.findOffset
            }
        }
    }
}