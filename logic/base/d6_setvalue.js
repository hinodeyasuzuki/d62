/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * diagnosis.js 
 * 
 * D6 Main Class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * inSet()						input data setter
 * measureAdd()					set select flag and not calculate 
 * measureDelete()				clear select flag and not calculate 
 */
 
//resolve D6
var D6 = D6||{};

	
// inSet(id, val)  input data setter ------------------
//
// parameters
//		id		input id, permit include equip/room code 'ixxxyy'
//		val		input value
//
D6.inSet = function ( id, val ){
	var inpIdDef = id.substr( 0,4 );
	if ( !D6.scenario.defInput[inpIdDef] ){
		console.log("ERROR: inSet input code: " + id + " val:" + val);
		return;
	}
	if ( D6.scenario.defInput[inpIdDef].varType == "String" || 
		D6.scenario.defInput[inpIdDef].varType == "Boolean"
	) {	
		//set data
		D6.doc.data[id] = val;
	} else {
		//string data set
		val = D6.toHalfWidth(val);
		D6.doc.data[id] = parseFloat( val ) ? parseFloat( val ) : 0;
	}
};

	
// measureAdd(mesId) set select flag and not calculate --------
//
// parameters
//		mesId		measure id which you select
// return
//		none
//
D6.measureAdd = function( mesId ) {
	var gid;
	var ret = "";
		
	gid = this.measureList[mesId].groupID;
	this.measureList[mesId].selected = true;
	this.isOriginal = false;
	//ret = this.calcMeasures( gid );	//recalc -> not calc

	return ret;
};


// measureDelete(mesId) remove select flag and not calculate--------
//
// parameters
//		mesId		measure id which you select
// return
//		none
//
D6.measureDelete = function( mesId ) {
	var gid;
	var ret ="";

	this.measureList[mesId].selected = false;
	gid = this.measureList[mesId].groupID;
	//ret = this.calcMeasures( gid );	//recalc 

	return ret;
};

