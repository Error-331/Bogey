// Modules include
var scenario = require('../../core/scenario');
var deferred = require('../../async/deferred');

var box = require('../services/box');

var fileUtils = require('../../utils/fileutils');

var RefreshBoxToken = function()
{
    scenario.constFunc.call(this, 'refresh_box_token');

    /* Private members starts here */

    /**
     * @access private
     * @var object link to the current object
     */

    var obj = this;

    /**
     * @access private
     * @var object instance of the Box service
     */

    var curBox;

    /* Private members ends here */

    /* Privileged core methods starts here */

    this.start = function()
    {
        var options = obj.getOptions();

        options.scenario = obj;
        options.logsnapdir = 'snapshots' + fileUtils.getDirSeparator() + Date.now();

        curBox = box.create(options);

        curBox.refreshBoxToken().done(function(data){
            obj.sendResponse(data);
            obj.stop();
        }).fail(function(err){
            obj.sendErrorResponse(err);
            obj.stop();
        });
    }

    /**
     * Method that stops current scenario.
     *
     * Method sends response based on the information stored in the current object and calls phantom.exit().
     *
     * @access privileged
     *
     */

    this.stop = function()
    {
        phantom.exit();
    }

    /* Privileged core methods ends here */
}

exports.create = function create() {
    "use strict";

    RefreshBoxToken.prototype = scenario.create('refresh_box_token');
    return new RefreshBoxToken('refresh_box_token');
};