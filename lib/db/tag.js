var Core = require("./core");
var Q = require('q');
var repos = require('./repos');



var SPLIT_SEPARATOR = ':';


/**
 * add user item
 *@param {Object} kv
	字段名	描述
	name
	repos
 * @return promise
 */
exports.add = function(kv) {
	var defer = Q.defer();
	if (typeof kv != 'object' || !kv.email) {
		defer.reject('Error param');
	} else {
		var arrKv = [kv.name, kv.repos];
		Core.lpush('user', arrKv.join(SPLIT_SEPARATOR))
			.then(function(d) {
				defer.resolve(d);
			})
			.fail(function(e) {
				defer.reject(e)
			})
	}
	return defer.promise;
}

exports.update = function(tagName,mouldName,isDelete){

}

exports.getByTag = function(tagName){
	var defer = Q.defer();
	var queryedData;
	if (typeof name !== 'string') {
		defer.reject('Error param');
	} else {
		exports.getAll()
			.then(function(d) {
				for (var i = 0, len = d.length; i < len; i++) {
					if (d[i].name === name) {
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

exports.size = function() {
	return Core.llen('user');
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
				return Core.lrange('user', 0, (size - 1))
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

// query by kv
function isMatch(kv,original){
	var is = 1;
	for(var key in kv){
		// 类型可能不一致
		if(kv[key] != original[key]){
			is = 0;
			break;
		}
	}
	return is;
}

/*
 * get one data by kv
 *@param {Object} kv
 *@return promise
 */
exports.get = function(kv) {
	var defer = Q.defer();
	var tempData;
	if (typeof kv != 'object') {
		defer.reject('Error param');
	} else {
		exports.getAll()
			.then(function(d) {
				for (var i = 0, len = d.length; i < len; i++) {
					if(isMatch(kv,d[i])){
						tempData = d[i];
						break;
					}
				}
				defer.resolve(tempData);
			})
			.fail(function(e){
				defer.reject(e);
			})

	}
	return defer.promise;
}

/**
 * check user is admin by email
 *@param {String} email
 */
exports.isAdmin = function(email){
	var defer = Q.defer();
	if(typeof email!=='string' || /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)){
		defer.reject('Error param');
	}
	exports.get({email:email})
		.then(function(d){
			defer.resolve(d.admin === '1');
		})
		.fail(function(e){
			defer.reject(e);
		})
}
