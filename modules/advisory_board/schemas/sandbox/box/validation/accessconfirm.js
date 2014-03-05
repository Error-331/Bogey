if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.advisory_board == undefined) {
    Bogey.advisory_board = {};
}

if (Bogey.advisory_board.schemas == undefined) {
    Bogey.advisory_board.schemas = {};
}

Bogey.advisory_board.schemas.confirmAccess = {
    elm1: {
        sel: 'div.login_submit_div:first-child',
        func: 'Bogey.utils.findOffset',
        varName: 'grant'
    }
};

// export for dummy schema
if (typeof exports != 'undefined') {
    exports.schema = Bogey.advisory_board.schemas.confirmAccess;
}