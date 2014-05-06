var Core = require("./core");
var Q = require('q');

var Util = require('../util');



var SPLIT_SEPARATOR = '|*|';

function formatKvs(kv) {
	return [
		kv.name,
		kv.user,
		kv.tag,
		kv.desc,
		kv.cover,
		kv.version,
		kv.versions,
		kv.updated_at,
		kv.created_at,
		kv.watchers,
		kv.forks
	].join(SPLIT_SEPARATOR);
}

/**
 * add user item
 *@param {Object} kv
	name	库名称
	user	作者id
	tag	tag id
	desc	描述
	cover	封面
	version	版本
	versions	历史版本列表
	updated_at	更新时间
	created_at	创建时间
	watchers	关注的人
	forks	fork的人
 * @return promise
 */
exports.add = function(kv) {
	var defer = Q.defer();
	var isExist = 0;
	if (typeof kv != 'object' || !kv.name) {
		defer.reject('Error param');
	} else {
		exports.getByName(kv.name)
			.then(function(d) {
				if (d) {
					kv = Util.easyMix(d, kv);
					isExist = 1;
				}
				var formatKv = formatKvs(kv);
				if (isExist) {
					return Core.do('lset', 'gallery_repos', kv.redisKeyIndex, formatKv)
				} else {
					return Core.do('lpush', 'gallery_repos', formatKv);
				}

			})
			.then(function(d) {
				defer.resolve(d);
			})
			.fail(function(e) {
				defer.reject(e)
			})
	}
	return defer.promise;
}


exports.size = function() {
	return Core.do('llen', 'gallery_repos');
}


/*
 * get one data by kv
 *@param {Object} kv
 *@return promise
 */
exports.getByName = function(name) {
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


/**
 * __getAll
 *@return {String}
 */
function getAllString() {
	var defer = Q.defer();
	exports.size()
		.then(function(size) {
			length = size;
			if (!size) {
				defer.resolve([]);
				return;
			} else {
				return Core.do('lrange', 'gallery_repos', 0, (size - 1))
			}
		})
		.then(function(d) {
			defer.resolve(d);
		});
	return defer.promise;
}


/**
 *@private
 */
function strToObj(arrStr) {
	var arrObj = [];
	var arrTemp;
	for (var i = 0, len = arrStr.length; i < len; i++) {
		arrTemp = arrStr[i].split(SPLIT_SEPARATOR);
		// console.log(arrTemp)
		arrObj.push({
			name: arrTemp[0],
			user: arrTemp[1],
			tag: arrTemp[2],
			desc: arrTemp[3],
			cover: arrTemp[4],
			version: arrTemp[5],
			versions: arrTemp[6],
			updated_at: arrTemp[7],
			created_at: arrTemp[8],
			watchers: arrTemp[9],
			forks: arrTemp[10]
		})
	}
	return arrObj;
}



/*
 * get all repos
 *@return promise
 */
exports.getAll = function() {
	var defer = Q.defer();
	getAllString()
		.then(function(d) {
			// console.log(d)
			defer.resolve(strToObj(d));
		})
		.fail(function(e) {
			defer.reject(e);
		});
	return defer.promise;
}

/**
 * 查询接口
 */
exports.queryByKeyword = function(keyword) {
	var defer = Q.defer();
	if (typeof keyword !== 'string') {
		defer.reject('Error param');
	} else {
		getAllString()
			.then(function(d) {
				var queryData = [];
				for (var i = 0, len = d.length; i < len; i++) {
					if (d[i].indexOf(keyword) > -1) {
						queryData.push(d[i])
					}
				}
				defer.resolve(strToObj(queryData));
			})
			.fail(function(e) {
				defer.reject(e);
			});
	}
	return defer.promise;
}

exports.add({
	name: 'uplooooo',
	user: 'jp'
})
	.then(function(d) {
		console.log(d);
	})
	.fail(function(e) {
		console.log(e);
	})