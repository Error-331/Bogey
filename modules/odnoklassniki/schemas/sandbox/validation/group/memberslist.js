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

Bogey.odnoklassniki.schemas.group.memberList = {
    elm1: {
        sel: '#hook_Block_GroupMembersBlock',

        is_single: true,
        sub_is_single: true,

        excludeFromSet: true
    }
}

// export for dummy schema
if (typeof exports !== 'undefined') {
    exports.schema = Bogey.odnoklassniki.schemas.group.memberList;
}