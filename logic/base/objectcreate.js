/*  2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * objectcreate.js 
 * 
 *  Object Create
 *		reference to http://blog.tojiru.net/article/199670885.html by Hiraku NAKANO
 *
 *	usage var newOBJ = Object.create(oldOBJ);
 */

//resolve D6
var D6 = D6 || {};

// deep copy 
//
Object.create = function (obj) {
	var func = Object.create.func;
	func.prototype = obj;
	var newo = new func;
	var len = arguments.length;
	for (var i = 1; i < len; ++i) {
		for (var prop in arguments[i]) {
			newo[prop] = arguments[i][prop];
		}
	}
	return newo;
};
Object.create.func = function () { };


// add objects
//
D6.patch = function (target, fix) {
	for (var v in fix) {
		target[v] = fix[v];
	}
	return target;
};




