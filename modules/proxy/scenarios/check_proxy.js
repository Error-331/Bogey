// Modules include
var scenario = require('../../core/scenario');
var args = require('system').args;

var page = require('webpage').create();

var CheckProxy = function()
{ 
    scenario.constFunc.call(this, 'check_proxy');
    
    /* Private members starts here */
    
    /**
     * @access private
     * @var object link to the current object
     */        
    
    var obj = this;  
    
    /**
     * @access private
     * @var string URL of the service which is used to test proxy server
     */     
    
    var checkURL = 'http://whatismyipaddress.com/proxy-check';
    
    /**
     * @access private
     * @var string IP address of the proxy server
     */      
    
    var proxyAddr = '';
    
    /**
     * @access private
     * @var string port of the proxy
     */       
    
    var proxyPort = '';
    
    /**
     * @access private
     * @var string proxy server type (http, socks5, none)
     */      
    
    var proxyType = 'none';
    
    /**
     * @access private
     * @var string login for the proxy server
     */       
    
    var proxyLogin = '';
    
    /**
     * @access private
     * @var string password for the proxy server
     */     
    
    var proxyPassword = null;
    
    /**
     * @access private
     * @var boolean rDNS test result
     */     
    
    var rDNSTest = false;
    
    /**
     * @access private
     * @var boolean WIMIA test result
     */     
    
    var wimiaTest = false;
    
    /**
     * @access private
     * @var boolean TOR test result
     */     
    
    var torTest = false;
    
    /**
     * @access private
     * @var boolean LOC test result
     */        
    
    var locTest = false;
    
    /**
     * @access private
     * @var boolean HEADER test result
     */      
    
    var headerTest = false;
    
    /**
     * @access private
     * @var boolean DNSBL test result
     */      
    
    var dnsblTest = false;
   
    /**
     * @access private
     * @var number proxy ping
     */        
   
    var ping;
    
    /**
     * @access private
     * @var string real IP address (if proxy is not working)
     */     
    
    var realAddr = '';
    
    /**
     * @access private
     * @var boolean indicates whether proxy is working or not
     */      
    
    var isProxy = false;   
            
    /* Private members ends here */
    
    /* Private core methods starts here */

    /**
     * Method that prepares proxy options.
     *
     * Proxy options are received throught command line and passed to the corresponding setter methods.
     *
     * @access private
     * 
     * @throws string 
     * 
     */ 

    function prepareProxyOptions()
    {
        var options = obj.getOptions();
        
        if (options['proxy-addr'] !== undefined) {
            setProxyAddr(options['proxy-addr']);          
        }
        
        if (options['proxy-port'] !== undefined) {
            setProxyPort(options['proxy-port']);
        }        
        
        if (options['proxy-type'] !== undefined) {
            setProxyType(options['proxy-type']);
        }
        
        if (options['proxy-login'] !== undefined) {
            setProxyLogin(options['proxy-login']);
        }  
        
        if (options['proxy-password'] !== undefined) {
            setProxyPassword(options['proxy-password']);
        }          
    }
    
    /**
     * Method that actually checks proxy server via remote service.
     *
     * Current method make request through the proxy server to the remote server to test proxy parameters.
     *
     * @access private
     * 
     */     
    
    function checkProxy()
    {        
        var sTime;
        var eTime;
        var pTime;
        
        page.onLoadFinished = function(status) {
            if (status == 'success') {    

                eTime = new Date().getTime();
                pTime = eTime - sTime;
                            
                // page evalute
                var result = page.evaluate(function(){
                    var table = document.getElementsByTagName('table');
                    var tdS = document.getElementsByTagName('td');
                    var td = null;
                    
                    var i = 0;
                    var j = null;
                    var result = {};
                   
                    // check if all elements was found coreclty
                    if (table.length <= 0) {
                        return false;
                    }
                    
                    if (tdS.length <= 0) {
                        return false;
                    }
                    
                    // parse paragraph
                    if (table[0].previousSibling.previousSibling.textContent == 'Proxy server not detected.') {
                        result['is_proxy'] = false;
                    } else {
                        result['is_proxy'] = true;
                    }

                    // parse table
                    for (td in tdS) {
                        i = i + 1;
                        
                        if (i%2 == 1) {
                            j = tdS[td].textContent;
                            
                            switch(j) {
                                case 'IP':
                                    j = 'ip';
                                    break;
                                case 'rDNS':
                                    j = 'rdns';
                                    break;
                                case 'WIMIA Test':
                                    j = 'wimia';
                                    break;
                                case 'Tor Test':
                                    j = 'tor';
                                    break;
                                case 'Loc Test':
                                    j = 'loc';
                                    break;
                                case 'Header Test':
                                    j = 'header';
                                    break                               
                                case 'DNSBL Test':
                                    j = 'dnsbl';
                                    break;
                            }
                        } else {
                            switch (tdS[td].textContent) {
                                case 'TRUE':
                                    result[j] = true;
                                    break;
                                case 'FALSE':
                                    result[j] = false;
                                    break
                                default: 
                                    result[j] = tdS[td].textContent;
                                    break;
                            }                          
                        }                                                                 
                    }
                    
                    return JSON.stringify(result);
                });
                
                if (result === false) {
                    obj.setErrorDesc('Cannot open gage site');
                    obj.setIsError(true);            
                    obj.stop();    
                    
                    return;
                }

                result = JSON.parse(result);
                rDNSTest = result['rdns'];
                wimiaTest = result['wimia'];
                torTest = result['tor'];
                locTest = result['loc'];
                headerTest = result['header'];
                dnsblTest = result['dnsbl'];
                ping = pTime;
    
                realAddr = result['ip'];
                isProxy = result['is_proxy'];              
               
                if (realAddr == proxyAddr) {
                    isProxy = true;
                }
               
                obj.setIsError(false);           
                obj.stop();
            } else {
                obj.setErrorDesc('Cannot open gage site');
                obj.setIsError(true);            
                obj.stop();
            }
        }
        
        sTime = new Date().getTime();
        page.open(checkURL);
    }
    
    /* Private core methods ends here */
    
    /* Private get methods starts here */    
    /* Private get methods ends here */
    
    /* Private set methods starts here */
    
    /**
     * Method that sets current proxy server address.
     *
     * Simple method that sets current proxy server address.
     *
     * @access private
     * 
     * @param string addr proxy server address
     * 
     * @throws string 
     * 
     */      
    
    function setProxyAddr(addr) 
    {
        if (typeof addr != 'string') {
            throw 'Proxy address is not a string';
        }
        
        if (addr.length <= 0) {
            throw 'Proxy address length cannot be less than or equal to zero';
        }
        
        var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        
        if (!re.test(addr)) {
            throw 'Invalid proxy address';
        } 

        proxyAddr = addr;
    }
    
    /**
     * Method that sets current proxy server port.
     *
     * Simple method that sets current proxy server port.
     *
     * @access private
     * 
     * @param string port proxy server port
     * 
     * @throws string 
     * 
     */      
    
    function setProxyPort(port)
    {
        if (typeof port != 'string') {
            throw 'Proxy port is not a string';
        }
        
        if (port.length <= 0) {
            throw 'Proxy port length cannot be less than or equal to zero';
        }       
        
        var re = /^\d{1,5}$/;

        if (!re.test(port)) {
            throw 'Invalid proxy port';
        }         
        
        proxyPort = port;
    }
    
    /**
     * Method that sets current proxy server type.
     *
     * Simple method that sets current proxy server type.
     *
     * @access private
     * 
     * @param string type proxy server type
     * 
     * @throws string 
     * 
     */      
    
    function setProxyType(type)
    {
        if (typeof type != 'string') {
            throw 'Proxy type is not a string';
        }
        
        if (type.length <= 0) {
            throw 'Proxy type length cannot be less than or equal to zero';
        }  
        
        type = type.toLowerCase();
        
        if (type != 'http' && type != 'socks5' && type != 'none') {
            throw 'Proxy type is invalid';
        }
        
        proxyType = type;
    }
    
    /**
     * Method that sets login to current proxy server.
     *
     * Simple method that sets login to current proxy server.
     *
     * @access private
     * 
     * @param string login proxy server login
     * 
     * @throws string 
     * 
     */      
    
    function setProxyLogin(login)
    {
        if (typeof login != 'string') {
            throw 'Proxy login is not a string';
        }
        
        if (login.length <= 0) {
            throw 'Proxy login length cannot be less than or equal to zero';
        }          
        
        proxyLogin = login;
    }
    
    /**
     * Method that sets password to current proxy server.
     *
     * Simple method that sets password to current proxy server.
     *
     * @access private
     * 
     * @param string password proxy server password
     * 
     * @throws string 
     * 
     */      
    
    function setProxyPassword(password)
    {
        if (typeof password != 'string') {
            throw 'Proxy password is not a string';
        }
        
        if (password.length <= 0) {
            throw 'Proxy password length cannot be less than or equal to zero';
        }    
        
        proxyPassword = password;
    }
    
    /* Private set methods ends here */
    
    /* Privileged core methods starts here */
    
    /**
     * Method that starts current scenario.
     *
     * Method extracts arguments from the command line and uses them to check proxy server.
     *
     * @access privileged
     * 
     */      
    
    this.start = function() 
    {   
        try {
            prepareProxyOptions();
            checkProxy();            
        } catch(e) {          
            obj.setErrorDesc(e);
            obj.setIsError(true);
            obj.stop();
        }      
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
        var result = {
            'url': checkURL,
            
            'proxy_address': proxyAddr,
            'proxy_port': proxyPort,
            'proxy_type': proxyType,
            'proxy_login': proxyLogin,
            'proxy_password': proxyPassword,
            
            'rdns': rDNSTest,
            'wimia': wimiaTest,
            'tor': torTest,
            'loc': locTest,
            'header': headerTest,
            'dnsbl': dnsblTest,
            'ping': ping,
            
            'real_address': realAddr,
            'is_proxy': isProxy
        }
    
        if (obj.getIsError() == true) {
            obj.sendErrorResponse(obj.getErrorDesc());
        } else {
            obj.sendResponse(result);
        }

        phantom.exit();
    }      
        
    /* Privileged core methods ends here */
      
    /* Privileged get methods starts here */
    
    /**
     * Method that returns current proxy address.
     *
     * Simple method that returns current proxy address.
     *
     * @access privileged
     * 
     * @return string proxy address.
     * 
     */      
    
    this.getProxyAddr = function()
    {
        return proxyAddr;
    }
    
    /**
     * Method that returns current proxy port.
     *
     * Simple method that returns current proxy port.
     *
     * @access privileged
     * 
     * @return string proxy port.
     * 
     */     
    
    this.getProxyPort = function()
    {
        return proxyPort;
    }    
    
    /**
     * Method that returns current proxy type.
     *
     * Simple method that returns current proxy type.
     *
     * @access privileged
     * 
     * @return string proxy type.
     * 
     */      
    
    this.getProxyType = function()
    {
        return proxyType;
    }    
    
    /* Privileged get methods ends here */
}

exports.create = function create() {
    "use strict";
    
    CheckProxy.prototype = scenario.create('check_proxy');
    return new CheckProxy('check_proxy');
};  