var od = require('../../modules/odnoklassniki/services/base').create({
    'viewportWidth': 1024,
    'viewportHeight': 768,
    
    'debugSandbox': true,
    'modulesPath': '/var/www/phantomJS_scripts/modules/'
});

od.logIn();