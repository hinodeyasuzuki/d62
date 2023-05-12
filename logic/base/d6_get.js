/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_get.js 
 * 
 * called from d6fcalc.js
 * 
 * display data create main Class
 * 		combined with disp_input.js, disp_demand.js, disp_measue.js
 * 
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * showResultTable()		get collective result
 *
 * getAverage()			get average value
 * getAverage_cons()		get average table data set
 *
 * getItemize()		itemize
 * getItemizeGraph()
 * dataItemize()			get itemized value
 * 
 * getMonthly()		monthly graph data
 * 
 */

//resolve D6
var D6 = D6 || {};

//result total values
//	param
//		consName : ex. "consTotal"
//  return
//		graphItemize,graphMonthly,average,cons,measure
D6.getAllResult = function (consName) {
	var ret = {};
	if (consName) {
		if (!D6.logicList[consName]) consName = "consTotal";
		this.nowConsPageName = consName;
	} else {
		consName = "consTotal";
	}
	//if( this.nowConsPageName ) {
	//	consName = this.nowConsPageName;
	//}

	//get consCode
	var consCode = D6.consListByName[consName][0].consCode;

	//create collective result
	ret.common = this.getCommonParameters(consCode);
	ret.consShow = this.getConsShow();

	ret.monthly = this.getMonthly();
	ret.average = this.getAverage(consCode);
	ret.average_graph = this.getAverage_graph();
	ret.itemize = this.getItemize(consCode);
	ret.itemize_graph = this.getItemizeGraph(consCode);
	ret.measure = this.getMeasure(consName);

	return ret;
};

//compare to average value about one Consumption
// params
//		consCode : consumption category
// return
//		you and average params
D6.getAverage = function (consCode) {
	var ret = {};

	ret.you = D6.consShow[consCode].co2Original * 12; //yearly co2 emission
	ret.youc = D6.consShow[consCode].costOriginal * 12; //yearly cost
	ret.after = D6.consShow[consCode].co2 * 12; //yearly co2 after set measures
	ret.afterc = D6.consShow[consCode].cost * 12; //yearly cost after set measures

	ret.av = D6.average.consList[consCode].co2Original * 12; //yearly average co2
	ret.avc = D6.average.consList[consCode].costOriginal * 12; //yearly average cost

	ret.rank100 = D6.rankIn100(ret.you / ret.av); //rank( 1-100 )
	ret.afterrank100 = D6.rankIn100(ret.after / ret.av); //rank after set measures( 1-100 )

	var d6i012 = D6.doc.data["i021"];
	ret.samehome =
		D6.scenario.defSelectValue.sel021[d6i012 && d6i012 > 0 ? d6i012 : 13];

	//same home's name
	ret.sameoffice = D6.scenario.defSelectValue.sel001[D6.doc.data["i001"]];
	//same office's name

	ret.consCode = consCode;
	return ret;
};

//average compare result
D6.getAverage_graph = function () {
	var ret = {};
	ret.cost = [];
	ret.co2 = [];

	//  co2[0], cost[0] user
	ret.co2[0] = {};
	ret.co2[0].electricity =
		D6.consShow["TO"].electricityOriginal * D6.Unit.co2.electricity;
	ret.co2[0].gas = D6.consShow["TO"].gasOriginal * D6.Unit.co2.gas;
	ret.co2[0].kerosene = D6.consShow["TO"].keroseneOriginal * D6.Unit.co2.kerosene;
	ret.co2[0].car = D6.consShow["TO"].carOriginal * D6.Unit.co2.gasoline;
	ret.co2[0].total = D6.consShow["TO"].co2Original;

	//user cost
	ret.cost[0] = {};
	//230126 include sell price 
	ret.cost[0].electricity = D6.consShow["TO"].priceEle - D6.consShow["TO"].priceEleSell;
	ret.cost[0].gas = D6.consShow["TO"].priceGas;
	// ret.cost[0].kerosene = D6.consShow["TO"].priceKeros;
	ret.cost[0].kerosene = D6.consShow["TO"].keroseneOriginal * D6.Unit.price.kerosene;
	ret.cost[0].car = D6.consShow["TO"].priceCar;

	//	co2[1], cost[1] average
	//ret.cost[1] = D6.area.averageCostEnergy; この値とkeroseneの値が異なる
	ret.co2[1] = {};
	ret.co2[1].total = D6.average.consList["TO"].co2;	//221210 originalではなく直値
	ret.co2[1].electricity =
		D6.average.consList["TO"].electricity * D6.Unit.co2.electricity;
	ret.co2[1].gas = D6.average.consList["TO"].gas * D6.Unit.co2.gas;
	ret.co2[1].kerosene =
		D6.average.consList["TO"].kerosene * D6.Unit.co2.kerosene;
	ret.co2[1].car = D6.average.consList["TO"].car * D6.Unit.co2.car;

	//average cost
	ret.cost[1] = {};
	ret.cost[1].electricity = D6.average.consList["TO"].priceEle;
	ret.cost[1].gas = D6.average.consList["TO"].priceGas;
	// ret.cost[1].kerosene = D6.average.consList["TO"].priceKeros;
	ret.cost[1].kerosene = D6.average.consList["TO"].kerosene * D6.Unit.price.kerosene;
	ret.cost[1].car = D6.average.consList["TO"].priceCar;

	return ret;
};

//itemized value
// parameter
// 		consCode : consumption category
// result
//		ret[nowConsCode] : itemized data for table( all items )
//
D6.getItemize = function (consCode) {
	var ret = {};
	var cons;
	var i = 0;

	for (var cid in D6.consList) {
		cons = D6.consList[cid];
		ret[i] = {};

		//name
		ret[i].title = cons.title;
		ret[i].consName = cons.consName;
		ret[i].subID = cons.subID;
		ret[i].sumConsName = cons.sumConsName;
		ret[i].sumCons2Name = cons.sumCons2Name;
		ret[i].countCall = cons.countCall;

		//co2
		ret[i].co2 = cons.co2;
		ret[i].co2Total = D6.consShow["TO"].co2;

		//each energy
		ret[i].electricity = cons.electricity;
		ret[i].nightelectricity = cons.nightelectricity;
		ret[i].gas = cons.gas;
		ret[i].water = cons.water;
		ret[i].coal = cons.coal;
		ret[i].hotwater = cons.hotwater;
		ret[i].kerosene = cons.kerosene;
		ret[i].car = cons.car;
		ret[i].color = cons.color;
		i++;
	}
	return ret;
};

//itemize graph data set
// parameters
//		consCode: consumption code
//		sort:sort target (co2,energy,money)
// result
//		itemized co2 graph data
D6.getItemizeGraph = function (consCode, sort) {
	var otherCaption = "other";

	if (consCode) {
		this.nowConsCode = consCode;
	}
	consCode = this.nowConsCode;
	if (sort) {
		this.nowSortTarget = sort;
	}
	sort = this.nowSortTarget;

	//graph data
	var menu = {
		co2: { sort: "co2", title: "kg", round: 1, divide: 1 },
		energy: { sort: "jules", title: "GJ", round: 1, divide: 1000 },
		money: { sort: "cost", title: "yen", round: 10, divide: 1 } // same code to view
	};
	var show = menu[sort ? sort : "co2"];

	var ret = {};

	//in function getItemizeGraph( return one target of graph data )
	// params
	//		target:   co2/jules/cost
	//		scenario:
	//		original: "original" or ""
	//		consCode: 2 charactors
	// result
	//		ret[]
	var gdata = function (target, scenario, original, consCode) {
		var sorttarget = show.sort;
		if (original) sorttarget += "Original";
		var sum = 0;
		var data = [];
		var di = 0;
		if (consCode == "TO") {
			//in case of Total consumption
			for (var cid in target) {
				if (cid == "TO") continue;
				if (cid == "") continue; //180413
				data[di] = {};
				data[di]["compare"] = scenario;
				data[di]["ratio"] =
					Math.round(
						target[cid][sorttarget] / target[consCode][sorttarget] * 1000
					) / 10;
				data[di][show.title] =
					Math.round(target[cid][sorttarget] * 12 / show.divide * show.round) /
					show.round;
				data[di]["item"] = target[cid].title;
				di++;
				sum += target[cid][sorttarget];
			}
			data[di] = {};
			data[di]["compare"] = scenario;
			data[di]["ratio"] =
				Math.round(
					(target["TO"][sorttarget] - sum) / target["TO"][sorttarget] * 1000
				) / 10;
			data[di][show.title] =
				Math.round(
					(target["TO"][sorttarget] - sum) * 12 / show.divide * show.round
				) / show.round;
			data[di]["item"] = otherCaption;
		} else {
			//each consumption exclude consTotal
			if (target[consCode].partCons) {
				var target2 = target[consCode].partCons;
				for (cid in target2) {
					//if ( target2[cid].title == target[consCode].title ) continue;
					data[di] = {};
					data[di]["compare"] = scenario;
					data[di]["ratio"] =
						Math.round(
							target2[cid][sorttarget] / target[consCode][sorttarget] * 1000
						) / 10;
					data[di][show.title] =
						Math.round(
							target2[cid][sorttarget] * 12 / show.divide * show.round
						) / show.round;
					data[di]["item"] =
						target2[cid].title +
						(target2[cid].subID > 0
							? ":" +
							(D6.viewparam.countfix_pre_after == 1
								? target2[cid].countCall + target2[cid].subID
								: target2[cid].subID + target2[cid].countCall)
							: "");
					di++;
					sum += target2[cid][sorttarget];
				}
				data[di] = {};
				data[di]["compare"] = scenario;
				data[di]["ratio"] =
					Math.round(
						(target[consCode][sorttarget] - sum) /
						target[consCode][sorttarget] *
						1000
					) / 10;
				data[di][show.title] =
					Math.round(
						(target[consCode][sorttarget] - sum) * 12 / show.divide * show.round
					) / show.round;
				data[di]["item"] = otherCaption;
			} else {
				data[di] = {};
				data[di]["compare"] = scenario;
				data[di]["ratio"] = 1000 / 10;
				data[di][show.title] =
					Math.round(
						target[consCode][sorttarget] * 12 / show.divide * show.round
					) / show.round;
				data[di]["item"] = target[consCode].title;
				di++;
			}
		}
		return data;
	};

	var captions = ["you", "after", "average"]; //same code to view
	var averageCaption = "";
	if (D6.targetMode == 1) {
		averageCaption = D6.scenario.defSelectValue.sel021[D6.area.area];
	} else {
		averageCaption =
			D6.scenario.defSelectValue.sel001[Math.max(1, D6.doc.data["i001"])];
	}
	var data = gdata(D6.consShow, captions[0], true, consCode);
	Array.prototype.push.apply(
		data,
		gdata(D6.consShow, captions[1], false, consCode)
	);
	Array.prototype.push.apply(
		data,
		gdata(D6.average.consList, captions[2], false, consCode)
	);

	//graph color list ( get from each cons** class )
	var clist = [];
	for (var cid in D6.consShow) {
		if (cid == "TO") continue;
		if (consCode == "TO" || cid == consCode) {
			clist.push({
				title: D6.consShow[cid].title,
				//co2:D6.consShow[cid].co2,
				target: D6.consShow[cid][show.sort + "Original"],
				color: D6.consShow[cid].color
			});
		}
	}

	//graph order set(sort)
	var ord = [];
	if (consCode == "TO") {
		D6.ObjArraySort(clist, "target", "desc");
		for (cid in clist) {
			ord.push(clist[cid].title);
		}
		ord.push(otherCaption);
	} else {
		ord.push(clist.title);
	}

	ret.data = data;
	ret.yaxis = show.title;
	ret.ord = ord;
	ret.clist = clist;
	ret.averageCaption = averageCaption;
	ret.captions = captions;
	ret.consTitle = D6.consShow[consCode].title;

	return ret;
};

//CO2 itemize array
//
// return
//		consObject array ( [0] is consTotal ) only for graph
//
D6.dataItemize = function () {
	var consShow = D6.consShow;

	var cons_temp = new Array();
	//var cons_rebuild = new Array();
	var ci;

	//remove consTotal
	for (ci in consShow) {
		if (consShow[ci].consCode != "TO") {
			cons_temp.push(consShow[ci]);
		}
	}

	//sort
	var NUMERIC = 16; //function parameter stable definition
	var DESCENDING = 2; //function parameter stable definition
	cons_temp.sortOn("co2", NUMERIC | DESCENDING); //sort

	//add consTotal as top
	cons_temp.unshift(consShow["TO"]);

	return cons_temp;
};

//monthly graph data
//
// return
//		ret.data[]	graph data
//		ret.yaxis	title
D6.getMonthly = function () {
	var ret = {};
	var menu = {
		co2: { sort: "co2", title: "kg", round: 1, divide: 1 },
		energy: { sort: "jules", title: "MJ", round: 1, divide: 1000 },
		money: { sort: "cost", title: "yen", round: 1, divide: 1 }
	};
	var show = menu["money"];
	var ene1 = [
		{ r: 0, ene: "electricity", name: D6.Unit.name["electricity"] },
		{ r: 1, ene: "gas", name: D6.Unit.name["gas"] },
		{ r: 2, ene: "kerosene", name: D6.Unit.name["kerosene"] },
		{ r: 3, ene: "coal", name: D6.Unit.name["coal"] },
		{ r: 4, ene: "hotwater", name: D6.Unit.name["hotwater"] },
		{ r: 5, ene: "car", name: D6.Unit.name["car"] }
	];

	var month = [];
	var ri = 0;
	var e;
	for (var m = 1; m <= 12; m++) {
		for (e = 0; e < ene1.length; e++) {
			if (!D6.consShow["TO"].monthlyPrice[ene1[e].ene]) continue;
			month[ri] = {};
			month[ri]["month"] = m;
			month[ri][show.title] =
				Math.round(
					D6.consShow["TO"].monthlyPrice[ene1[e].ene][m - 1] /
					show.divide *
					show.round
				) / show.round;
			month[ri]["energyname"] = ene1[e].ene;
			ri++;
		}
	}
	ret.data = month;
	ret.yaxis = show.title;
	return ret;
};

// getGid(consName)  getter group id of consumption ------------------
//
// parameters
//		consName	consumption name
// retrun
//		groupID		0-9
//
D6.getGid = function (consName) {
	return D6.logicList[consName].groupID;
};

// getCommonParameters()  getter common result parameters such as co2 ------------------
//
// parameters
//		consCode: consumption code
// retrun
//		co2,cost: total consumption
//		consco2 : target consumption
//
D6.getCommonParameters = function (consCode) {
	var ret = {};
	ret.co2Original = D6.consShow["TO"].co2Original;
	ret.co2 = D6.consShow["TO"].co2;
	ret.costOriginal = D6.consShow["TO"].costOriginal;
	ret.cost = D6.consShow["TO"].cost;

	ret.consco2Original = D6.consShow[consCode].co2Original;
	ret.consco2 = D6.consShow[consCode].co2;
	ret.conscostOriginal = D6.consShow[consCode].costOriginal;
	ret.conscost = D6.consShow[consCode].cost;

	return ret;
};

// getConsShow()  getter common result parameters such as co2 ------------------
//
// retrun
//		co2,cost: total consumption
//		consco2 : target consumption
//
D6.getConsShow = function () {
	var ret = {};
	for (var consCode in D6.consShow) {
		ret[consCode] = {};
		ret[consCode].co2Original = D6.consShow[consCode].co2Original;
		ret[consCode].co2 = D6.consShow[consCode].co2;
		ret[consCode].costOriginal = D6.consShow[consCode].costOriginal;
		ret[consCode].cost = D6.consShow[consCode].cost;
	}

	return ret;
};
