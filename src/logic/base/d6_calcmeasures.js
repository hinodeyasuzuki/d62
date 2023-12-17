/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_calcmeasures.js 
 * 
 * D6 Class calc measures functions
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * calcMeasures()				calculate measure
 * calcMeasuresLifestyle()		calculate all measures and select lifestyle
 * calcMeasuresNotLifestyle()	calculate all measures and select not lifestyle
 * calcMeasuresOne()			calculate in temporal selection
 * calcMaxMeasuresList()		automatic select max combination 
 */

/* calcMeasures(gid)  calculate all measures -----------------------------
 *
 * parameters
 *		gid		groupid, -1 is total
 * return
 *		measure array defined in calcMeasuresOne
 *
 * once clear selected measures, and set select and calculate one by one
 */
const calcMeasures = function (gid) {
  let ret;
  let i;
  let mid, mlistid, mes;

  let selList = [];	//selected measures' ID

  //save selected measures id
  for (mes in this.measureList) {
    selList[this.measureList[mes].mesID] = this.measureList[mes].selected;
  }

  //clear selection and calculate
  ret = this.clearSelectedMeasures(gid);

  //set select one by one
  for (i = 0; i < ret.length; i++) {
    mid = ret[i].mesID;
    mlistid = mid;
    mes = this.measureList[mlistid];

    if (selList[mid] && !mes.selected) {
      mes.selected = true;
      this.isOriginal = false;

      if (mes.co2Change < 0) {
        //set select in case of useful measures
        mes.co2ChangeSumup = mes.co2Change;
        mes.costChangeSumup = mes.costChange;
        mes.costTotalChangeSumup = mes.costTotalChange;

        mes.addReduction();					//set reduction
        ret = this.calcMeasuresOne(-1);	//main calculation for next step
      } else {
        mes.co2ChangeSumup = 0;
        mes.costChangeSumup = 0;
        mes.costTotalChangeSumup = 0;
      }
    }
  }

  //set selection property include not useful
  for (mlistid in this.measureList) {
    mes = this.measureList[mlistid];
    mes.selected = selList[mes.mesID];
    if (mes.selected) {
      this.isOriginal = false;
    }
  }
  let ret2 = [];
  for (i = 0; i < ret.length; i++) {
    if (ret[i].groupID == gid || gid == -1) {
      ret2.push(ret[i]);
    }
  }
  this.resMeasure = ret2;

  return ret2;
};


/* calcMeasuresLifestyle(gid)  
 *		calculate all measures and select lifestyle --------
 *
 * parameters
 *		gid		groupid, -1 is total
 * return
 *		measure array defined in calcMeasuresOne
 */
const calcMeasuresLifestyle = function (gid) {
  let onemes;
  let retLife = new Array();
  let ret = this.calcMeasures(gid);

  // select only related to lifestyle 
  for (onemes in ret) {
    if (ret[onemes].lifestyle == 1) {
      retLife.push(ret[onemes]);
    }
  }
  return retLife;
};


/* calcMeasuresNotLifestyle(gid)  
 *		calculate all measures and select not lifestyle --------
 *
 * parameters
 *		gid		groupid, -1 is total
 * return
 *		measure array defined in calcMeasuresOne
 */
const calcMeasuresNotLifestyle = function (gid) {
  let onemes;
  let retLife = [];
  let ret = this.calcMeasures(gid);

  // select only not related to lifestyle 
  for (onemes in ret) {
    if (ret[onemes].lifestyle != 1) {
      retLife.push(ret[onemes]);
    }
  }
  return retLife;
};


/* calcMeasuresOne(gid)  
 *		calculate all measures in temporal selection --------
 *
 * parameters
 *		gid		groupid, -1 is total
 * return
 *		measure array include mesID,groupID and lifestyle
 *
 * called by calcMeasures
 */
const calcMeasuresOne = function (gid) {
  let ret = new Array();							//return
  let i;

  var sortTarget = this.sortTarget;		//sort target

  //each measures defined in cons object
  for (i in this.consList) {
    //target group
    if (gid == -1 || this.consList[i].groupID == gid) {
      this.consList[i].calcMeasureInit();
      this.consList[i].calcMeasure();

      //in case of equipment/room number is defined and selected #0
      //not evaluate after #1
      if (this.consList[i].subID >= 1) {
        var cons0 = this.consListByName[this.consList[i].consName][0];
        for (var m in cons0.measures) {
          if (cons0.measures[m].selected) {
            this.consList[i].measures[m].copy(cons0);
          }
        }
      }
    }
  }
  i = 0;

  //format return measure data
  let mes;
  for (let mescode in this.measureList) {
    mes = this.measureList[mescode];
    mes.calcSave();
    ret[i] = {};
    ret[i][sortTarget] = mes[sortTarget];
    ret[i].mesID = mes.mesID;
    ret[i].groupID = mes.groupID;
    ret[i].lifestyle = mes.lifestyle;
    i++;
  }
  this.ObjArraySort(ret, sortTarget);	//sort
  return ret;
};



/* clearSelectedMeasures(gid)  clear all selection and calculate all --------
 *
 * parameters
 *		gid		groupid, -1 is total
 * return
 *		measure array defined in calcMeasuresOne
 */
const clearSelectedMeasures = function (gid) {
  let ret;

  this.isOriginal = true;
  ret = this.calcCons();			//calcurate original state consumption

  //remove selection
  for (let i = 0; i < this.measureList.length; i++) {
    if (this.measureList[i].groupID == gid || gid < 0) {
      this.measureList[i].selected = false;
    }
  }

  //calculate
  ret = this.calcMeasuresOne(gid);

  return ret;
};


/* calcMaxMeasuresList(gid)
 *		automatic select max combination measures --------
 *
 * parameters
 *		gid		groupid, -1 is total
 *		count	max selected number
 * return
 *		measure array defined in calcMeasuresOne
 */
const calcMaxMeasuresList = function (gid, count) {
  let resultCalc;
  let ret;
  let pt = 0;
  let maxCO2 = 0;
  let cost = 0;
  let i, j;
  let mes;
  let targetmes;
  let sumCO2 = 0;
  let sumCOST = 0;

  if (typeof (gid) == "undefined") gid = -1;
  if (typeof (count) == "undefined" || count < 1) count = 100;

  //clear all selection
  resultCalc = this.clearSelectedMeasures(gid);

  //search max reduction measure for "count" times
  for (i = 0; i < count; i++) {
    pt = -1;
    maxCO2 = 0;
    for (j = 0; j < this.measureList.length; j++) {
      //max reduction in measureList
      mes = this.measureList[j];
      if (mes.groupID == gid || gid < 0) {
        if (this.measureList[j].selected != true 		//skip already selected
          || !isFinite(mes.co2Change)
          || isNaN(mes.co2Change)) 				//useful
        {
          //select max measure
          if (maxCO2 > mes.co2Change) {
            maxCO2 = mes.co2Change;
            cost = mes.costChange;
            pt = mes.mesID;
            targetmes = mes;
          }
        }
      }
    }
    if (pt == -1) {
      //end in case of no measures suitable
      break;
    }
    sumCO2 += maxCO2;
    sumCOST += cost;
    resultCalc = this.measureAdd(pt);			//select set to property
    targetmes.addReduction();					//set reduction
    resultCalc = this.calcMeasuresOne(-1);	//main calculation for next step
  }
  ret = this.calcMeasures(gid);
  ret.sumCO2 = sumCO2;
  ret.sumCOST = sumCOST;

  return ret;
};


export { calcMeasures, calcMeasuresLifestyle, calcMeasuresNotLifestyle, calcMeasuresOne, clearSelectedMeasures, calcMaxMeasuresList };
