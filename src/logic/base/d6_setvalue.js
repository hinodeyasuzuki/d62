/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_setvalues.js 
 * 
 * this Main Class
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

// inSet(id, val)  input data setter ------------------
//
// parameters
//		id		input id, permit include equip/room code 'ixxxyy'
//		val		input value
//
const inSet = function (id, val) {
  let inpIdDef = id.substr(0, 4);
  if (!this.scenario.defInput[inpIdDef]) {
    console.log("ERROR: inSet input code: " + id + " val:" + val);
    return;
  }
  if (this.scenario.defInput[inpIdDef].letType == "String" ||
    this.scenario.defInput[inpIdDef].letType == "Boolean"
  ) {
    //set data
    this.doc.data[id] = val;
  } else {
    //string data set
    val = this.toHalfWidth(val);
    this.doc.data[id] = parseFloat(val) ? parseFloat(val) : 0;
  }
};


// measureAdd(mesId) set select flag and not calculate --------
//
// parameters
//		mesId		measure id which you select
// return
//		none
//
const measureAdd = function (mesId) {
  let gid;
  let ret = "";

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
const measureDelete = function (mesId) {
  let gid;
  let ret = "";

  this.measureList[mesId].selected = false;
  gid = this.measureList[mesId].groupID;
  //ret = this.calcMeasures( gid );	//recalc 

  return ret;
};

export { inSet, measureAdd, measureDelete };