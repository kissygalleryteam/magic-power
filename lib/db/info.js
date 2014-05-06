var Core = require("./core");
var Q = require('q');

/**
 * @return promise { tagName: '100', userCount: '50', reposCount: '200' }
 */
exports.get = function() {
	var defer = Q.defer();
	var arrInfo = [];
	Core.do('get','gallery_info')
		.then(function(d) {
			if (!d) {
				throw 'No data';
			} else {
				arrInfo = d.split(':');
				defer.resolve({
					tagName: arrInfo[0],
					userCount: parseInt(arrInfo[1],10),
					reposCount: parseInt(arrInfo[2])
				})
			}
		})
		.fail(function(e) {
			defer.reject(e);
		});
	return defer.promise;
}


/*
 * @param {Object} value { tagName: '100', userCount: '50', reposCount: '200' }
 * @return promise
 */
exports.set = function(value) {
	var defer = Q.defer();
	if (typeof value !== 'object' || !value.tagName || !value.userCount || !value.reposCount) {
		defer.reject('Error param');
	} else {
		var parseValue = value.tagName + ':' + value.userCount + ':' + value.reposCount;
		Core.do('set','gallery_info', parseValue)
			.then(function(d) {
				defer.resolve(d);
			})
			.fail(function(e) {
				defer.reject(e);
			});
	}

	return defer.promise;
}
