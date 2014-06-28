// Modules include
var deferred = require('../../../../async/deferred');

exports.schema = {
    step1: {
        type: 'sandbox',
        format: 'plain-objects',
        scripts: ['sandbox/utils.js'],

        sandbox_schema: require('../../sandbox/validation/group/main').schema
    },

    step2: {
        type: 'dummy',
        op: 'click',

        left: '$showUsersLink.left',
        top: '$showUsersLink.top',

        offset_left: 2,
        offset_top: 2
    }
}