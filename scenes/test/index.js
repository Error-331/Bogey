var od = require('../../modules/odnoklassniki/services/base').create({
    'viewportWidth': 1024,
    'viewportHeight': 768,
    
    'debugSandbox': true,
    'modulesPath': '/var/www/phantomjs_scripts/modules/',
    
    // odnoklassniki configs
    'reloginOnStart': false
});

var criteria = {
    'gender': 'male',
    'ageFrom': 14,
    'ageTo': 32
}

od.searchPeopleByCriteria(criteria);
