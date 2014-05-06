var Core = require("./core");
var Q = require('q');
var Util = require('../util');



var SPLIT_SEPARATOR = '|*|';


exports.size = function() {
	return Core.do('llen', 'gallery_user');
}

/*
 * get all dataq
 *@return promise
 */
exports.getAll = function() {
	var defer = Q.defer();
	var length = 0;
	var item = {};
	var joinData = [];
	exports.size()
		.then(function(size) {
			length = size;
			if (!size) {
				defer.resolve([]);
				return;
			} else {
				return Core.do('lrange', 'gallery_user', 0, (size - 1))
			}
		})
		.then(function(d) {
			for (var i = 0; i < length; i++) {
				item = d[i].split(SPLIT_SEPARATOR);
				joinData.push({
					githubName: item[0],
					name: item[1],
					email: item[2],
					count: item[3],
					admin: item[4]
				})
			}
			defer.resolve(joinData);
		})
		.fail(function(e) {
			defer.reject(e);
		})
	return defer.promise;

}

exports.getByEmail = function(email) {
	//	exports.getByName = function(name) {
	var defer = Q.defer();
	var queryedData;
	if (typeof email !== 'string') {
		defer.reject('Error param');
	} else {
		exports.getAll()
			.then(function(d) {
				for (var i = 0, len = d.length; i < len; i++) {
					if (d[i].email === email) {
						queryedData = d[i];
						queryedData.redisKeyIndex = i;
						break;
					}
				}
				defer.resolve(d[i]);
			})
			.fail(function(e) {
				defer.reject(e);
			})
	}
	return defer.promise;

}

/**
 * add user item
 *@param {Object} kv
	字段名	描述
	githubName	github的用户名
	name	用户自己配置的用户名
	email	邮箱
	count	推送的库数目
	admin	是否是管理员
 * @return promise
 */
exports.add = function(kv) {
	var defer = Q.defer();
	var isExist = 0;
	if (typeof kv !== 'object' || !kv.email) {
		defer.reject('Error param');
	} else {
		exports.getByEmail(kv.email)
			.then(function(d) {
				if (d) {
					kv = Util.easyMix(d, kv);
					isExist = 1;
				}
				var formatKv = [
					kv.githubName,
					kv.name,
					kv.email,
					kv.count || 1,
					kv.admin || 0
				].join(SPLIT_SEPARATOR);
				if (isExist) {
					return Core.do('lset', 'gallery_user', kv.redisKeyIndex, formatKv)
				} else {
					return Core.do('lpush', 'gallery_user', formatKv);
				}
			})
			.then(function(d) {
				defer.resolve(d);
			})
			.fail(function(e) {
				defer.reject(e);
			})
	}
	return defer.promise;
}
/**
 * check user is admin by email
 *@param {String} email
 */
exports.isAdmin = function(email) {
	var defer = Q.defer();
	if (typeof email !== 'string' || /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
		defer.reject('Error param');
	}
	exports.getByEmail(email)
		.then(function(d) {
			defer.resolve(d.admin === '1');
		})
		.fail(function(e) {
			defer.reject(e);
		})
}