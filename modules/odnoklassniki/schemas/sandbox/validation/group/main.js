if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.odnoklassniki == undefined) {
    Bogey.odnoklassniki = {};
}

if (Bogey.odnoklassniki.schemas == undefined) {
    Bogey.odnoklassniki.schemas = {};
}


if (Bogey.odnoklassniki.schemas.group == undefined) {
    Bogey.odnoklassniki.schemas.group = {};
}


Bogey.odnoklassniki.schemas.group.main = {
    elm1: {
        sel: '#hook_Block_AltGroupMainMembersRB',

        is_single: true,
        sub_is_single: true,

        excludeFromSet: true,

        sub: {
            elm1: {
                sel: '.hcount',
                func: 'Bogey.utils.findOffset',
                varName: 'userCountCont'
            },

            elm2: {
                sel: 'a.sm',
                func: 'Bogey.utils.findOffset',
                varName: 'showUsersLink'
            }
        }
    }
}

// export for dummy schema
if (typeof exports !== 'undefined') {
    exports.schema = Bogey.odnoklassniki.schemas.group.main;
}