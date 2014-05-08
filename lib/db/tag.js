var Core = require("./core");
var Q = require('q');
var Util = require('../util');

var Repos = require('./repos');



var SPLIT_SEPARATOR = ':';





/**
 * add user item
 *@param {Object} kv { name:uploader, tag:form }
	name
	repos
 * @return promise
 */
exports.add = function(kv) {
	var defer = Q.defer();
	var formatAddKv;
	if (typeof kv != 'object' || !kv.name) {
		defer.reject('Error param');
	} else {
		getTagValues(kv.name)
			.then(function(d){
				// has tag
				if(!d){
					formatAddKv = [
						kv.name,
						kv.repos
					].join(SPLIT_SEPARATOR);
					return Core.do('lpush','gallery_tag',formatAddKv);
				}else{
					var hasRepos = Util.isMatch(kv.repos,d.repos);
					// tag has repos
					if(!hasRepos){
						// split with , like form:uploader,checkbox,select
						formatAddKv = [
							kv.name,
							d.repos+','+kv.repos
						].join(SPLIT_SEPARATOR);

						return Core.do('lset','gallery_tag',d.redisKeyIndex, formatAddKv);
					}else{
						// exist
						defer.resolve(1);
						return;
					}
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


function getTagValues(name){
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

function filterRepos(reposList,tagValues){
	var filterData = [];
	for(var i=0,len = reposList.length;i<len;i++){
		if(Util.isMatch(reposList[i].name,tagValues)){
			filterData.push(reposList[i]);
		}
	}
	return filterData;
}


exports.getReposByTag = function(tag){
	var defer = Q.defer();
	var reposList;
	Repos.getAll()
		.then(function(d){
			reposList = d || [];
			return getTagValues(tag)
		})
		.then(function(d){
			defer.resolve(filterRepos(reposList,d));
		})
		.fail(function(e){
			defer.reject(e);
		})
	return defer.promise;
}


exports.size = function() {
	return Core.do('llen', 'gallery_tag');
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
				return Core.do('lrange', 'gallery_tag', 0, (size - 1))
			}
		})
		.then(function(d) {
			for (var i = 0; i < length; i++) {
				item = d[i].split(SPLIT_SEPARATOR);
				joinData.push({
					name: item[0],
					repos: item[1]
				})
			}
			defer.resolve(joinData);
		})
		.fail(function(e) {
			defer.reject(e);
		})
	return defer.promise;

}


