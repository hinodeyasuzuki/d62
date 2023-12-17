/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_getsmeasure.js 
 * 
 * measure comment display data create add to this.disp class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2016/11/23 divided from js
 *
 * getMeasureDetail()
 * tableMeasuresDetail()	for debug
 * tableMeasuresSimple()
 * getMeasureTable()
 * getMeasure_title()
 */


// getMeasureDetail(mesid) ---------------------------------------
//		detail data about measures
// parameters
//		mesid : measure sequence id
// return
//		ret: subset of measureBase class
const getMeasureDetail = function (mesid) {
  let ret = {};
  let mes = this.measureList[mesid];

  //common data
  ret = this.getMeasuresDetailCommon(mes);

  ret.cons = {};
  ret.advice = mes.advice;
  ret.cons.title = mes.cons.title;
  ret.cons.consCode = mes.cons.consCode;
  ret.cons.co2 = mes.cons.co2;
  ret.cons.co2Original = mes.cons.co2Original;
  ret.cons.cost = mes.cons.cost;
  ret.cons.costOriginal = mes.cons.costOriginal;

  ret.cons.electricity = mes.cons.electricity;
  ret.cons.nightelectricity = mes.cons.nightelectricity;
  ret.cons.gas = mes.cons.gas;
  ret.cons.car = mes.cons.car;
  ret.cons.kerosene = mes.cons.kerosene;
  ret.cons.water = mes.cons.water;

  return ret;
};


//get Measures data
// consName
// maxPrice		not show over than this price
// notSelected 	1:only not select
//
const getMeasure = function (consName, maxPrice, notSelected) {
  //cannot set default in function for IE
  if (typeof maxPrice === "undefined") maxPrice = 100000000;
  if (typeof notSelected === "undefined") notSelected = 0;

  let ret = [];
  let i = 0;
  let mes;
  let cid, mid;

  //let count = 0;
  let mesidArray = [];
  for (cid in this.measureList) {
    mesidArray.push(this.measureList[cid]);
  }
  this.ObjArraySort(mesidArray, this.sortTarget);

  for (mid in mesidArray) {
    cid = mesidArray[mid].mesID;
    mes = this.measureList[cid];

    // not to show defined in EXCEL
    if (mes.title == "" || mes.title.substr(0, 1) == "#") continue;

    let partc = this.consListByName[consName][0].partCons;
    let relation = false;
    for (let pc in partc) {
      if (mes[partc[pc].consName]) relation = true;
    }

    // directly defined in partCons
    if (mes[consName]) relation = true;

    // skip
    if (mes.selected && notSelected == 1) continue;
    if (mes.priceNew > maxPrice) continue;

    ret[i] = {};

    ret[i] = this.getMeasuresDetailCommon(mes);

    ret[i].consName = consName;
    ret[i].groupID = mes.groupID;
    ret[i].measureName = mes.measureName;
    ret[i].consCode = mes.cons.consCode;
    ret[i].consconsName = mes.cons.consName;
    ret[i].conssumConsName = mes.cons.sumConsName;
    ret[i].conssumCons2Name = mes.cons.sumCons2Name;
    ret[i].conssumCons3Name = mes.cons.sumCons3Name;
    ret[i].co2Original = mes.cons.co2Original;
    ret[i].co2Change = mes.co2Change;
    ret[i].co2ChangeOriginal = mes.co2ChangeOriginal;
    ret[i].costOriginal = mes.cons.costOriginal;
    ret[i].costChangeOriginal = mes.costChangeOriginal;
    ret[i].conssubID = mes.cons.subID;
    ret[i].consmesTitlePrefix = mes.cons.mesTitlePrefix;
    ret[i].payBackYear = mes.payBackYear;
    ret[i].lifeTime = mes.lifeTime;
    ret[i].easyness = mes.easyness;
    ret[i].priceNew = mes.priceNew;
    ret[i].lifestyle = mes.lifestyle;
    ret[i].disable = mes.disable;			//consTotal
    ret[i].relation = mes.relation;

    if (mes.cons.color || mes.cons.consName == "consTOTAL") {
      ret[i].color = mes.cons.color;
    } else {
      ret[i].color = mes.cons.sumCons.color;
    }

    i++;
  }

  return ret;
};

const getMeasure_title = function (mes) {
  if (mes.cons.consName == "consOTother") {
    return mes.title;
  } else {
    return (mes.cons.targetCall ? (mes.cons.targetCall + ":") :
      (mes.subID ? (mes.subID + mes.cons.countCall + ":") : ""))
      + mes.title;
  }
};

const getMeasure_titleShort = function (mes) {
  if (mes.cons.consName == "consOTother") {
    return mes.title;
  } else {
    return mes.titleShort + (mes.cons.targetCall ? "(" + mes.cons.targetCall + ")" :
      (mes.subID ? "(" + mes.subID + mes.cons.countCall + ")" : ""));
  }
};


// common data
//
const getMeasuresDetailCommon = function (mes) {
  let ret = {};
  ret.title = this.getMeasure_title(mes);
  ret.titleShort = this.getMeasure_titleShort(mes);
  ret.measureName = mes.measureName;
  ret.mesID = mes.mesID;
  ret.mesdefID = mes.mesdefID;
  ret.groupID = mes.groupID;
  ret.subID = mes.subID;
  ret.consName = mes.cons.consName;
  ret.figNum = mes.figNum;
  ret.relation = mes.relation;
  ret.shinkyusan_name = mes.shinkyusan_name;

  ret.standardType = mes.standardType;

  ret.priceSubsidy = mes.priceSubsidy;
  ret.joyfull = mes.joyfull;
  ret.total = mes.cons.total;
  ret.co2Total = this.consShow["TO"].co2Original;
  ret.selected = mes.selected;
  ret.easyness = mes.easyness;

  ret.co2 = mes.co2;
  ret.co2Original = mes.cons.co2Original;
  ret.co2Change = mes.co2Change;
  ret.co2ChangeOriginal = mes.co2ChangeOriginal;

  ret.jules = mes.jules;

  ret.cost = mes.cost;
  ret.costChange = mes.costChange;
  ret.costChangeOriginal = mes.costChangeOriginal;
  ret.costTotalChange = mes.costTotalChange;
  ret.costTotalChangeOriginal = mes.costTotalChangeOriginal;
  ret.costUnique = mes.costUnique;
  ret.costUniqueover10 = mes.costUniqueover10;

  ret.priceOrg = mes.priceOrg;
  ret.priceNew = mes.priceNew;
  ret.priceBasic = mes.priceBasic ? mes.priceBasic : 0;
  ret.payBackYear = mes.payBackYear;
  ret.lifeTime = mes.lifeTime;

  ret.electricity = mes.electricity;
  ret.electricityChange = mes.electricityChange;
  ret.electricityChangeOriginal = mes.electricityChangeOriginal;
  ret.nightelectricity = mes.nightelectricity;
  ret.gas = mes.gas;
  ret.coal = mes.coal;
  ret.hotwater = mes.hotwater;
  ret.car = mes.car;
  ret.kerosene = mes.kerosene;
  ret.water = mes.water;

  ret.notShowCost = mes.notShowCost;

  return ret;
};


export { getMeasure, getMeasureDetail, getMeasuresDetailCommon, getMeasure_title, getMeasure_titleShort };
