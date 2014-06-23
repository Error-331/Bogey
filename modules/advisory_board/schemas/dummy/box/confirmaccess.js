exports.schema = {
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],

        sandbox_schema: require('../../sandbox/box/validation/accessconfirm').schema
    },

    step2: {
        type: 'dummy',
        op: 'click',

        left: '$grant.left',
        top: '$grant.top',

        offset_left: 15,
        offset_top: 1,

        delay_before: 1000,
        delay_after: 1000
    }
}