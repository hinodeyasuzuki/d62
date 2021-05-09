/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * disp_measure.js 
 * 
 * measure comment display data create add to D6.disp class
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

var D6 = D6 || {};


// getMeasureDetail(mesid) ---------------------------------------
//		detail data about measures
// parameters
//		mesid : measure sequence id
// return
//		ret: subset of measureBase class
D6.getMeasureDetail = function (mesid) {
	var ret = {};
	var mes = D6.measureList[mesid];

	//common data
	ret = D6.getMeasuresDetailCommon(mes);

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
D6.getMeasure = function (consName, maxPrice, notSelected) {
	//cannot set default in function for IE
	if (typeof maxPrice === "undefined") maxPrice = 100000000;
	if (typeof notSelected === "undefined") notSelected = 0;

	var ret = [];
	var i = 0;
	var mes;
	//var count = 0;
	var mesidArray = [];
	for (var cid in D6.measureList) {
		mesidArray.push(D6.measureList[cid]);
	}
	D6.ObjArraySort(mesidArray, D6.sortTarget);

	for (var mid in mesidArray) {
		cid = mesidArray[mid].mesID;
		mes = D6.measureList[cid];

		// not to show defined in EXCEL
		if (mes.title == "" || mes.title.substr(0, 1) == "#") continue;

		var partc = D6.consListByName[consName][0].partCons;
		var relation = false;
		for (var pc in partc) {
			if (mes[partc[pc].consName]) relation = true;
		}

		// directly defined in partCons
		if (mes[consName]) relation = true;

		// skip
		if (mes.selected && notSelected == 1) continue;
		if (mes.priceNew > maxPrice) continue;

		ret[i] = {};

		ret[i] = D6.getMeasuresDetailCommon(mes);

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

D6.getMeasure_title = function (mes) {
	if (mes.cons.consName == "consOTother") {
		return mes.title;
	} else {
		return (mes.cons.targetCall ? (mes.cons.targetCall + ":") :
			(mes.subID ? (mes.subID + mes.cons.countCall + ":") : ""))
			+ mes.title;
	}
};

D6.getMeasure_titleShort = function (mes) {
	if (mes.cons.consName == "consOTother") {
		return mes.title;
	} else {
		return mes.titleShort + (mes.cons.targetCall ? "(" + mes.cons.targetCall + ")" :
			(mes.subID ? "(" + mes.subID + mes.cons.countCall + ")" : ""));
	}
};


// common data
//
D6.getMeasuresDetailCommon = function (mes) {
	var ret = {};
	ret.title = D6.getMeasure_title(mes);
	ret.titleShort = D6.getMeasure_titleShort(mes);
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
	ret.co2Total = D6.consShow["TO"].co2Original;
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


