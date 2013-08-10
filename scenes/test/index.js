var od = require('../../modules/odnoklassniki/services/base').create({
    'persistCookies': false,
    'modulesPath': '/var/www/phantomJS_scripts/modules/'
});

od.logIn();