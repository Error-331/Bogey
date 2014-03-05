exports.schema = {
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],

        sandbox_schema: require('../../sandbox/box/validation/signinform').schema
    },

    step2: {
        type: 'dummy',
        op: 'fillTextInput',

        left: '$login.left',
        top: '$login.top',

        offset_left: 3,
        offset_top: 3,

        text: '$login.text',

        delay_before: 1000
    },

    step3: {
        type: 'dummy',
        op: 'fillTextInput',

        left: '$password.left',
        top: '$password.top',

        offset_left: 3,
        offset_top: 3,

        text: '$password.text',

        delay_before: 1000
    },

    step4: {
        type: 'dummy',
        op: 'click',

        left: '$submit.left',
        top: '$submit.top',

        offset_left: 15,
        offset_top: 1,

        delay_before: 1000,
        delay_after: 1000
    }
}