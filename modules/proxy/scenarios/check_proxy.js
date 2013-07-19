// Modules include
var scenario = require('../../core/scenario');
var args = require('system').args;

var page = require('webpage').create();

var CheckProxy = function(configObj)
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
     * @var string real IP address (if proxy is not working)
     */     
    
    var realAddr = '';
    
    /**
     * @access private
     * @var boolean indicates whether proxy is working or not
     */      
    
    var isProxy = false;   
    
    /**
     * @access private
     * @var boolean error flag
     */      
    
    var isError = false;
        
    /* Private members ends here */
    
    /* Private core methods starts here */

    // --proxy=62.109.18.90:1080 --proxy-type=[http|socks5|none] --proxy-auth=PrsRUSY8BAHVL3GF:J13rAh76AU
    // --proxy=62.109.18.90:1080 --proxy-type=http --proxy-auth=PrsRUSY8BAHVL3GF:J13rAh76AU
    function extractDataFromArgs()
    {
        var key = null;
        var temp = '';
        
        for (key in args) {           
            if (args[key].indexOf('--proxy=') != -1) {               
                if (args[key].indexOf(':') != -1) {
                    setProxyAddr(args[key].substr(8, args[key].indexOf(':') - 8));
                    setProxyPort(args[key].substr(args[key].indexOf(':') + 1));
                } else {
                    setProxyAddr(args[key].substr(8));
                }
            } else if (args[key].indexOf('--proxy-type=') != -1) {
                setProxyType(args[key].substr(13));
            } else if (args[key].indexOf('--proxy-auth=') != -1) {
                temp = args[key].substr(13);
                
                if (temp.indexOf(':') == -1) {
                    throw 'Invalid proxy auth parameters';
                }
                
                setProxyLogin(temp.substr(0, temp.indexOf(':')));
                setProxyPassword(temp.substr(temp.indexOf(':') + 1));
            }
        }
    }
    
    function checkProxy()
    {        
        page.onLoadFinished = function(status) {
            if (status == 'success') {               
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
                             
                result = JSON.parse(result);
                rDNSTest = result['rdns'];
                wimiaTest = result['wimia'];
                torTest = result['tor'];
                locTest = result['loc'];
                headerTest = result['header'];
                dnsblTest = result['dnsbl'];
    
                realAddr = result['ip'];
                isProxy = result['is_proxy'];              
               
                isError = false;              
                obj.stop();
            } else {
                isError = true;              
                obj.stop();
            }
        }

        page.open(checkURL);
    }
    
    /* Private core methods ends here */
    
    /* Private get methods starts here */    
    /* Private get methods ends here */
    
    /* Private set methods starts here */
    
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
    
    this.start = function() 
    {   
        try {
            extractDataFromArgs();
            checkProxy();            
        } catch(e) {
            isError = true;
            obj.stop();
        }      
    }  
    
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
            
            'real_address': realAddr,
            'is_proxy': isProxy
        }
    
        if (isError == true) {
            obj.sendErrorResponse({});
        } else {
            obj.sendResponse(result);
        }

        phantom.exit();
    }      
        
    /* Privileged core methods ends here */
      
    /* Privileged get methods starts here */
    
    this.getProxyAddr = function()
    {
        return proxyAddr;
    }
    
    this.getProxyPort = function()
    {
        return proxyPort;
    }    
    
    this.getProxyType = function()
    {
        return proxyType;
    }    
    
    /* Privileged get methods ends here */
}

CheckProxy.prototype = scenario.create('check_proxy');
new CheckProxy('check_proxy').start();