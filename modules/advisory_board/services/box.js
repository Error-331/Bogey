// Modules include
var service = require('../../core/service');
var deferred = require('../../async/deferred');

var fileutils = require('../../utils/fileutils');

var Box = function(configObj)
{
    service.constFunc.call(this, configObj, 'advisory_board_base');

    /* Private members starts here */

    /**
     * @access private
     * @var object link to the current object
     */

    var obj = this;

    var loginPageUrl = 'https://advisory.app.box.com/api/oauth2/authorize?response_type=code&client_id={clientId}&state=authenticated';

    var openLoginPageTimeout = 5000;

    var fillAdvisoryLoginTimeout = 5000;

    var confirmAccessTimeout = 5000;

    /**
     * @access private
     * @var int timeout (in milliseconds) for operation which is responsible for token refreshing
     */

    var tokenRefreshingTimeout = 50000;

    var codeSubmitTimeout = 10000;

    /**
     * @access private
     * @var string path to the HTML file with token code submit form
     */

    var submitFormPath = obj.getModulesPath() + 'advisory_board' + fileutils.getDirSeparator() + 'services' + fileutils.getDirSeparator() +  'html' + fileutils.getDirSeparator() + 'box_refresh_token.html';

    /* Private members ends here */

    /* Private core methods starts here */

    function submitCode(code)
    {
        var def = deferred.create();
        var curPage = obj.getPage();
        var curOptions = obj.getScenario().getOptions();

        // check options
        if (typeof curOptions !== 'object') {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Invalid options...');
            def.reject(obj.createErrorObject(5, 'Invalid options'));

            return def.promise();
        }

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Sending code...');

        curPage.open(submitFormPath, function(status) {
            if (status == 'success') {
                obj.logProcess(obj.getCurPageURL(), 'processing', status, 'unknown', 'Succesfully open local form file...');

                // page evalute
                curPage.evaluate(function(curCode, curId, curSecret) {
                    var evt = document.createEvent("MouseEvents");

                    var codeElm = document.getElementById('code');
                    var idElm = document.getElementById('clientId');
                    var secretElm = document.getElementById('clientSecret');

                    codeElm.value = curCode;
                    idElm.value = curId;
                    secretElm.value = curSecret;

                    // send form
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    document.getElementById('submitBtn').dispatchEvent(evt);
                }, code, curOptions.clientId, curOptions.clientSecret);

                // reject if timeout
                setTimeout(function(){
                    if (!def.isDone()) {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Code submit takes too long...');
                        def.reject(obj.createErrorObject(1, 'Code submit timeout'));
                    }
                }, codeSubmitTimeout);

                // on new page load
                obj.pushPageLoadFunc(function(status){
                    if (status == 'success') {
                        obj.takeSnapshot('jpeg', 'recieved_raw_token', obj.getLogSnapDir()).always(function(){
                            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Tokens rcieved...');

                            var response = curPage.evaluate(function(){
                                return document.body.innerText;
                            });

                            def.resolve(JSON.parse(response));
                        });
                    } else {
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while trying to receive token...');
                        def.reject(obj.createErrorObject(3, 'Error while trying to receive token'));
                    }
                });

            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open local form file...');
                def.reject(obj.createErrorObject(5, 'Cannot open local form file'));
                return def;
            }
        });

        return def.promise();
    }

    function confirmAccess()
    {
        var def = deferred.create();
        var dummyVars = {};

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Confirming access...');

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Access confirm form takes too long...');
                def.reject(obj.createErrorObject(1, 'Access confirm timeout'));
            }
        }, confirmAccessTimeout);

        // prepare schema
        var schema = require('../schemas/dummy/box/confirmaccess').schema;

        // click grant btn
        obj.runDummySchema(schema, dummyVars).done(function(){
            obj.takeSnapshot('jpeg', 'grant_access_click', obj.getLogSnapDir()).always(function(){
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', '"dummy" schema successfully processed...');
                def.resolve();
            });
        }).fail(function(error){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema (registration data)...');

            if (typeof error == 'object') {
                def.reject(error);
            } else {
                def.reject(obj.createErrorObject(4, error));
            }
        });

        return def.promise();
    }

    function submitAdisoryLogin()
    {
        var def = deferred.create();
        var dummyVars = {};

        var curOptions = obj.getScenario().getOptions();

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Filling advisory login form...');

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Filling advisory login form takes too long...');
                def.reject(obj.createErrorObject(1, 'Login page fill timeout'));
            }
        }, fillAdvisoryLoginTimeout);

        // check options
        if (typeof curOptions !== 'object') {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Invalid options...');
            def.reject(obj.createErrorObject(5, 'Invalig options'));
        }

        // prepare schema
        var schema = require('../schemas/dummy/box/fillsubmitadvisoryloginform').schema;

        // prepare dummy vars
        dummyVars.login = {'text': curOptions.clientEmail};
        dummyVars.password = {'text': curOptions.clientPassword};

        // submit sign in form
        obj.runDummySchema(schema, dummyVars).done(function(){
            obj.takeSnapshot('jpeg', 'advisory_loginform_filled', obj.getLogSnapDir()).always(function(){
                obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', '"dummy" schema successfully processed...');
                def.resolve();
            });
        }).fail(function(error){
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema (registration data)...');

            if (typeof error == 'object') {
                def.reject(error);
            } else {
                def.reject(obj.createErrorObject(4, error));
            }
        });

        return def.promise();
    }

    function openLoginPage()
    {
        var curPage = obj.getPage();
        var curOptions = obj.getScenario().getOptions();
        var def = deferred.create();

        obj.logProcess(obj.getCurPageURL(), 'starting', 'unknown', 'unknown', 'Opening login page...');

        // check options
        if (typeof curOptions !== 'object' || curOptions.clientId === undefined) {
            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot find clientId option...');
            def.reject(obj.createErrorObject(5, 'ClientId not found'));

            return def.promise();
        }

        loginPageUrl = loginPageUrl.replace('{clientId}', curOptions.clientId);

        // reject if timeout
        setTimeout(function(){
            if (!def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Opening login page takes too long...');
                def.reject(obj.createErrorObject(1, 'Sign in page open timeout'));
            }
        }, openLoginPageTimeout);

        curPage.open(loginPageUrl, function(status) {
            if (status == 'success' && !def.isProcessed()) {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'success', 'Login page successfuly opened...');

                obj.takeSnapshot('jpeg', 'login_page_open', obj.getLogSnapDir()).always(function(){
                    obj.setCurPageName('loginPage');
                    def.resolve();
                });
            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', status, 'fail', 'Cannot open login page...');
                def.reject(obj.createErrorObject(3, 'Sign in page cannot be opened'));
            }
        });

        return def.promise();
    }

    function refreshBoxToken()
    {
        var def = deferred.create();
        var dummyVars = {};

        var curOptions = obj.getScenario().getOptions();

        var onConfirmAccess = function(status){
            if (status == 'success') {
                obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Extracting code...');

                submitCode(obj.getCurPageURL().substr(obj.getCurPageURL().indexOf('&code') + 6)).done(function(data){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'success', 'Token refreshed...');

                    var sql = "MERGE INTO ES_DATA.BOX_PARAMETERS BP using dual ON (BP.BOX_PARAMETER_SK = "+ curOptions.clientBoxParamSk + ")"
                    sql += " WHEN MATCHED THEN UPDATE SET BP.ACCESS_TOKEN = '" + data.access_token + "', BP.REFRESH_TOKEN = '" + data.refresh_token + "', EXPIRES_IN = " + data.expires_in + ", REFRESH_TIME = SYSDATE"
                    sql += " WHEN NOT MATCHED THEN INSERT (BP.BOX_PARAMETER_SK, BP.CLIENT_ID, BP.CLIENT_SECRET, BP.ACCESS_TOKEN, BP.REFRESH_TOKEN, BP.EXPIRES_IN, REFRESH_TIME)"
                    sql += " VALUES (" + curOptions.clientBoxParamSk + ", '" + curOptions.clientId + "', '" + curOptions.clientSecret + "', '" + data.access_token + "', '" + data.refresh_token + "', " + data.expires_in +", SYSDATE);"
                    sql += " COMMIT;"

                    def.resolve(sql);
                }).fail(function(error){
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot refresh token...');
                    def.reject(error);
                });
            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while trying to refresh token...');
                def.reject(obj.createErrorObject(3, 'Error while trying to refresh token'));
            }
        }

        var onAdvisoryLoginSubmit = function(status){
            if (status == 'success') {
                if (obj.getCurPageURL().indexOf('https://advisory.app.box.com') === -1) {
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Redirect...');
                    obj.pushPageLoadFunc(onAdvisoryLoginSubmit);
                } else {
                    obj.takeSnapshot('jpeg', 'advisory_confirm_form', obj.getLogSnapDir()).always(function(){
                        obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Confirmation form opened...');

                        // page change callback
                        obj.pushPageLoadFunc(onConfirmAccess);

                        confirmAccess().fail(function(error){
                            obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot refresh token...');
                            def.reject(error);
                        });
                    });
                }
            } else {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while trying to refresh token...');
                def.reject(obj.createErrorObject(3, 'Error while trying to refresh token'));
            }
        }

        var onSignInSubmit = function(status){
            obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Form submited...');

            obj.takeSnapshot('jpeg', 'signin_submit_redirect', obj.getLogSnapDir()).always(function(){
                if (status == 'success') {
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'success', 'unknown', 'Redirect to advisory login page...');
                    obj.setCurPageName('advisoryLogIn');

                    // page change callback
                    obj.pushPageLoadFunc(onAdvisoryLoginSubmit);

                    submitAdisoryLogin().fail(function(error){
                        obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Cannot refresh token...');
                        def.reject(error);
                    });
                } else {
                    obj.logProcess(obj.getCurPageURL(), 'finishing', 'fail', 'fail', 'Error while trying to refresh token...');
                    def.reject(obj.createErrorObject(3, 'Error while trying to refresh token'));
                }
            });
        }

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
            // check options
            if (typeof curOptions !== 'object') {
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'unknown', 'fail', 'Invalid options...');
                def.reject(obj.createErrorObject(5, 'Invalig options'));
            }

            // prepare dummy vars
            dummyVars.login = {'text': curOptions.clientEmail};
            dummyVars.password = {'text': curOptions.clientPassword};

            // prepare schema
            var schema = require('../schemas/dummy/box/fillsubmitsigninform').schema;

            // page change callback
            obj.pushPageLoadFunc(onSignInSubmit);

            // fill signin form
            obj.runDummySchema(schema, dummyVars).done(function(){
                obj.takeSnapshot('jpeg', 'signinform_filled', obj.getLogSnapDir()).always(function(){
                    obj.logProcess(obj.getCurPageURL(), 'processing', 'unknown', 'unknown', '"dummy" schema successfully processed...');
                });
            }).fail(function(error){
                obj.logProcess(obj.getCurPageURL(), 'finishing', 'success', 'fail', 'Cannot run "dummy" schema (registration data)...');

                if (typeof error == 'object') {
                    def.reject(error);
                } else {
                    def.reject(obj.createErrorObject(4, error));
                }
            });
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