// Modules include
var scenario = require('../../core/scenario');
var deferred = require('../../async/deferred');

var odnoklassniki = require('../services/base');

var fileUtils = require('../../utils/fileutils');

var FetchGroupUsers = function()
{
    scenario.constFunc.call(this, 'fetch_group_users');

    /* Private members starts here */

    /**
     * @access private
     * @var object link to the current object
     */

    var obj = this;

    /**
     * @access private
     * @var object instance of the Odnoklassniki service
     */

    var curBase;

    /* Private members ends here */

    /* Privileged core methods starts here */

    this.start = function()
    {
        var options = obj.getOptions();

        options.scenario = obj;
        options.logsnapdir = 'snapshots' + fileUtils.getDirSeparator() + Date.now();

        curBase = odnoklassniki.create(options);

        curBase.fetchAvailableGroupUsersIds(options.group).done(function(data){
            var respData = {
                membersData: data['membersData'],
                membersFound: data['membersFound'],
                membersCnt: data['membersCnt']
            };

            obj.sendResponse(respData);
            obj.stop();
        }).fail(function(error){
            obj.sendErrorResponse(error);
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

    FetchGroupUsers.prototype = scenario.create('fetch_group_users');
    FetchGroupUsers.prototype.constructor = FetchGroupUsers;

    return new FetchGroupUsers('fetch_group_users');
};