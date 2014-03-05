if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.advisory_board == undefined) {
    Bogey.advisory_board = {};
}

if (Bogey.advisory_board.schemas == undefined) {
    Bogey.advisory_board.schemas = {};
}

Bogey.advisory_board.schemas.signInForm = {
    elm1: {
        sel: 'input#login',
        func: 'Bogey.utils.findOffset',
        varName: 'login'
    },
    elm2: {
        sel: 'input#password',
        func: 'Bogey.utils.findOffset',
        varName: 'password'
    },
    elm3: {
        sel: 'input.login_submit:first-child',
        func: 'Bogey.utils.findOffset',
        varName: 'submit'
    }
};

// export for dummy schema
if (typeof exports != 'undefined') {
    exports.schema = Bogey.advisory_board.schemas.signInForm;
}