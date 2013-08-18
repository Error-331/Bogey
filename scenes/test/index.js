var od = require('../../modules/odnoklassniki/services/base').create({
    'viewportWidth': 1024,
    'viewportHeight': 768,
    
    'debugSandbox': true,
    'modulesPath': '/var/www/phantomjs_scripts/modules/',
    
    // odnoklassniki configs
    'reloginOnStart': false
});

var criteria = {
    
}

od.searchPeopleByCriteria();
