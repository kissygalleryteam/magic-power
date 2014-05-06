var redis = require("redis"),
    client = redis.createClient(),
    Q = require('q');

client.on("error", function(err) {
    console.log("Error " + err);
});



function makeArray(o){
    var ret = [];
    for(var i=1,len = o.length;i<len;i++){
        ret.push(o[i]);
    }
    return ret;
}

/**
 *@example
    exports.do('lset','gallery_repos',1,'bfsssswww')
        .then(function(d){
            console.log(d);
        })

    exports.do('llen',"gallery_repos")
        .then(function(d){
            console.log(d);
        })
 */
exports.do = function(){
    var defer = Q.defer();
    var argArray = makeArray(arguments);

    argArray.push(function(err, data) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(data);
        }
    });
    client[arguments[0]].apply(client,argArray)
    return defer.promise;
}



