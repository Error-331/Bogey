// Modules include
var service = require('../../core/service');
var deferred = require('../../async/deferred');

var Box = function(configObj)
{
    service.constFunc.call(this, configObj, 'advisory_board_base');

    /* Private members starts here */

    /**
     * @access private
     * @var object link to the current object
     */

    var obj = this;

    /**
     * @access private
     * @var string main URL of the service
     */

    var mainPageURL = 'http://www.odnoklassniki.ru/';

    /* Private members ends here */

    /* Private core methods starts here */

    function refreshBoxToken()
    {
        var def = deferred.create();

        def.resolve();

        return def.promise();
    }

    /* Private core methods ends here */

    /* Privileged core methods starts here */

    /**
     * Operation method that starts (or puts to the stack) operation 'refreshBoxToken'.
     *
     * Method that starts operation that tries to refresh box account on the service.
     *
     * @access privileged
     *
     * @return object operation promise.
     *
     */

    this.refreshBoxToken = function()
    {
        try {
            return obj.startOp(refreshBoxToken);
        } catch(e) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot start operation "refreshBoxToken"...');
        }
    }

    /* Privileged core methods ends here */

    this.configureService(configObj);
}

exports.constFunc = Box;
exports.create = function create(configObj) {
    "use strict";
    Box.prototype = service.create(configObj, 'advisory_board_base');
    return new Box(configObj, 'advisory_board_base');
};