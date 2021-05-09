/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * diagnosis.js 
 * 
 * D6 Main Class as tools
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2018/03/04 divide as tools
 * 
 * toHalfWidth()
 * ObjArraySort()
 * 
 * 
 */

//resolve D6
var D6 = D6 || {};



// toHalfWidth(strVal)  change double width charactor------------------
//
// parameters
//		strVal	original value
// return
//		halfVal replaced value
//
D6.toHalfWidth = function (strVal) {
	/*
	if ( !strVal ) return strVal;
	var halfVal = strVal.replace(/[！-～]/g,
		function( tmpStr ) {
		// shift charactor code
			return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
		}
	);
	return halfVal;
	*/
	return strVal;
};


// ObjArraySort(ary, key, order )  object sort ------------------
//
// parameters
//		ary		array/object
//		key		sort target
//		order	incr/desc
// retrun
//		none
//
//	set "ary" sorted
//
D6.ObjArraySort = function (ary, key, order) {
	var reverse = 1;
	if (order && order.toLowerCase() == "desc")
		reverse = -1;
	ary.sort(function (a, b) {
		if (a[key] < b[key])
			return -1 * reverse;
		else if (a[key] == b[key])
			return 0;
		else
			return 1 * reverse;
	});
};

