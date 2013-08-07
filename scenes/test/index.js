var od = require('../../modules/odnoklassniki/services/base').create({
    'persistCookies': false,
    'modulesPath': '/var/www/phantomjs_scripts/modules/'
});

od.logIn();