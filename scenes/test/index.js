var od = require('../../modules/odnoklassniki/services/base').create({
    'debugSandbox': true,
    'modulesPath': '/var/www/phantomjs_scripts/modules/'
});

od.logIn();