if (Bogey == undefined){
    var Bogey = {};
}

if (Bogey.yandex == undefined) {
    Bogey.yandex = {};
}

if (Bogey.yandex.schemas == undefined) {
    Bogey.yandex.schemas = {};
}

Bogey.yandex.schemas.regForm = {
    elm1: {
        sel: 'input#firstname',
        func: Bogey.utils.findOffset,
        varName: '$firstName'
    },
    elm2: {
        sel: 'input#lastname',
        func: Bogey.utils.findOffset,
        varName: '$lastName'
    },
    elm3: {
        sel: 'input#login',
        func: Bogey.utils.findOffset,
        varName: '$login'
    },
    elm4: {
        sel: 'input#password',
        func: Bogey.utils.findOffset,
        varName: '$password'
    },
    elm5: {
        sel: 'input#password_confirm',
        func: Bogey.utils.findOffset,
        varName: '$passwordConfirm'
    },    
    elm6: {
        sel: 'select#hint_question_id',
        func: Bogey.utils.findOffset,
        varName: '$hintQuestionId'
    },   
    elm7: {
        sel: 'input#hint_answer',
        func: Bogey.utils.findOffset,
        varName: '$hintAnswer'
    },          
    elm8: {
        sel: 'input#phone_number',
        func: Bogey.utils.findOffset,
        varName: '$phoneNumber'
    },   
    elm9: {
        sel: 'img#captcha_img',
        func: Bogey.utils.findOffset,
        varName: '$captchaImg'
    },   
    elm10: {
        sel: 'input#answer',
        func: Bogey.utils.findOffset,
        varName: '$answer'
    },
    elm11: {
        sel: 'button[type="submit"]',
        func: Bogey.utils.findOffset,
        varName: '$submitBtn'
    }     
};