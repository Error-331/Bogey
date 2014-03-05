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

    var loginPageUrl = 'https://app.box.com/api/oauth2/authorize?response_type=code&client_id={clientId}&state=authenticated';

    var openLoginPageTimeout = 5000;

    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for token refreshing
     */

    var tokenRefreshingTimeout = 30000;

    /* Private members ends here */

    /* Private core methods starts here */

    function openLoginPage()
    {
        var curPage = obj.getPage();
        var curOptions = obj.getScenario().getOptions();
        var def = deferred.create();

        // check options
        if (typeof curOptions !== 'object' || curOptions.clientId === undefined) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot find clientId option...');
            def.reject(obj.createErrorObject(5, 'ClientId not found'));
        }

        loginPageUrl = loginPageUrl.replace('{clientId}', curOptions.clientId);

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening login page takes too long...');
                def.reject(obj.createErrorObject(1, 'Login page open timeout'));
            }
        }, openLoginPageTimeout);

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening login page...');

        curPage.open(loginPageUrl, function(status) {
            if (status == 'success' && !def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Login page successfuly opened...');

                obj.takeSnapshot('jpeg', 'login_page_open', obj.getLogSnapDir()).always(function(){
                    obj.setCurPageName('loginPage');
                    def.resolve();
                });
            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open login page...');
                def.reject(obj.createErrorObject(3, 'Login page cannot be opened'));
            }
        });

        return def.promise();
    }

    function refreshBoxToken()
    {
        var def = deferred.create();

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Starting token refresh process...');

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Token refreshing takes too long...');

                obj.takeSnapshot('jpeg', 'refresh_timeout', obj.getLogSnapDir()).always(function(){
                    def.reject(obj.createErrorObject(1, 'Token refreshing timeout'));
                });

                def.reject(obj.createErrorObject(1, 'Token refreshing timeout'));
            }
        }, tokenRefreshingTimeout);

        openLoginPage().done(function(){

        }).fail(function(error){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot refresh token...');
            def.reject(error);
        });


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