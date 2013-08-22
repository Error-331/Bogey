var od = require('../../modules/yandex/services/mail').create({
    'viewportWidth': 1024,
    'viewportHeight': 768,
    
    'debugSandbox': true,
    'modulesPath': '/var/www/phantomJS_scripts/modules/',
    
    // odnoklassniki configs
    'reloginOnStart': true
});

od.openRegPage();