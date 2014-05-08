var DB = require('../lib/db');





DB.repos.add({
	name:'imagefilter',
	user:'zihan',
	tag:'img'
})
.then(function(d){
	console.log(d);
})
