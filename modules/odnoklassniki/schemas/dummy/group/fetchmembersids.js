// Modules include
var deferred = require('../../../../async/deferred');

exports.schema = {
    step1: {
        type: 'dummy',

        func_sandbox: function(){
            var def = new Bogey.async.classes.Deferred();

            var groupCntNode = document.querySelector('#groupMembersCntEl');
            var footerNode = document.querySelector('#hook_Block_Footer');
            var showMoreNode = document.querySelector('.link-show-more');

            var membersCnt = groupCntNode.textContent;

            var members;
            var clickEvent;

            var curMembersCnt = 0;
            var attempts = 4;
            var attempt = 0;

            var sendResponseCallback = function(){
                var curNode;
                var href;

                var profile;
                var profiles = [];

                var iterator = document.createNodeIterator(
                    document.querySelector('.cardsList'),
                    NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode: function (node) {
                            if (node.nodeName === 'A' && node.classList.contains('photoWrapper')) {
                                return NodeFilter.FILTER_ACCEPT;
                            } else {
                                return NodeFilter.FILTER_REJECT;
                            }
                        }
                    }
                );

                while(curNode = iterator.nextNode()) {
                    href = curNode.getAttribute('href');

                    if (href !== '' && href !== null) {
                        if (href.indexOf('profile') !== -1) {
                            profile = {
                                link: href,
                                id: href.substr(href.indexOf('profile') + 8)
                            }
                        } else {
                            profile = {
                                link: href
                            }
                        }

                        profiles.push(profile);
                    }
                }

                def.resolve({
                    dummyVars:{
                        'membersCnt': membersCnt,
                        'membersFound': members.length,
                        'membersData': profiles
                    }
                });
            }

            var callbackFunc = function(timeout) {
                setTimeout(function(){
                    members = document.querySelectorAll('.userCard');

                    if (members.length === curMembersCnt) {
                        attempt++;
                    }

                    if (attempts === attempt) {
                        sendResponseCallback();
                        return;
                    }

                    curMembersCnt = members.length;

                    if (members.length < membersCnt) {
                        footerNode.scrollIntoView(true);

                        //check attempt

                        // click show more button
                        if (showMoreNode && showMoreNode.style.display !== 'none') {
                            clickEvent = document.createEvent("MouseEvent");

                            // init event
                            clickEvent.initMouseEvent(
                                "click",
                                true, true,
                                window, null,
                                0, 0, 0, 0,
                                false, false, false, false,
                                0, null
                            );

                            showMoreNode.dispatchEvent(clickEvent);
                        } else {
                            sendResponseCallback();
                            return;
                        }

                        callbackFunc(1500);
                    } else {
                        sendResponseCallback();
                    }
                }, timeout);
            }

            // get users count
            membersCnt = Bogey.utils.deleteWhitespaces(membersCnt);
            membersCnt = parseInt(membersCnt);

            // check if group empty
            if (membersCnt === 0) {
                sendResponseCallback();
                return def.promise();
            }

            callbackFunc(0);
            return def.promise();
        }
    }
}