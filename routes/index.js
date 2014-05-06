var DB = require('../lib/db');




/**
 * repos api
 */

// DB.repos.add({
// 	name:'uploader',
// 	user:'jianping',
// 	tag:'form',
// 	desc:'upload',
// 	cover:'xxx.jpg',
// 	version:'1.5'
// })
// DB.repos.getAll()
// 	.then(function(d){
// 		console.log(d);
// 	});

DB.repos.queryByKeyword('up')
	.then(function(d){
		console.log(d);
	})


// DB.repos.getByName('offline')
// 	.then(function(d){
// 		console.log(d);
// 	})