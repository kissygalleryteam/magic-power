exports.easyMix = function(objA,objB){
	var tempObj = objA;
	for(var i in objB){
		tempObj[i] = objB[i]
	}
	return tempObj;
}