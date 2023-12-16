/*  2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * objectcreate.js 
 * 
 *  Object Create
 *		reference to http://blog.tojiru.net/article/199670885.html by Hiraku NAKANO
 *
 *	usage let newOBJ = Object.create(oldOBJ);
 */

// deep copy 
//
Object.create = function (obj) {
	let func = Object.create.func;
	func.prototype = obj;
	let newo = new func;
	let len = arguments.length;
	for (let i = 1; i < len; ++i) {
		for (let prop in arguments[i]) {
			newo[prop] = arguments[i][prop];
		}
	}
	return newo;
};
Object.create.func = function () { };


// add objects
//
D6.patch = function (target, fix) {
	for (let v in fix) {
		target[v] = fix[v];
	}
	return target;
};




