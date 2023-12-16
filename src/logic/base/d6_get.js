/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_get.js 
 * 
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

 import {D6} from "../d6.js";

//result total values
//	param
//		consName : ex. "consTotal"
//  return
//		graphItemize,graphMonthly,average,cons,measure
const getAllResult = function (consName) {
	let ret = {};
	if (consName) {
		if (!this.logicList[consName]) consName = "consTotal";
		this.nowConsPageName = consName;
	} else {
		consName = "consTotal";
	}
	//if( this.nowConsPageName ) {
	//	consName = this.nowConsPageName;
	//}

	//get consCode
	let consCode = this.consListByName[consName][0].consCode;

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
const getAverage = function (consCode) {
	let ret = {};

	ret.you = this.consShow[consCode].co2Original * 12; //yearly co2 emission
	ret.youc = this.consShow[consCode].costOriginal * 12; //yearly cost
	ret.after = this.consShow[consCode].co2 * 12; //yearly co2 after set measures
	ret.afterc = this.consShow[consCode].cost * 12; //yearly cost after set measures

	ret.av = this.average.consList[consCode].co2Original * 12; //yearly average co2
	ret.avc = this.average.consList[consCode].costOriginal * 12; //yearly average cost

	ret.rank100 = this.rankIn100(ret.you / ret.av); //rank( 1-100 )
	ret.afterrank100 = this.rankIn100(ret.after / ret.av); //rank after set measures( 1-100 )

	let thisi012 = this.doc.data["i021"];
	ret.samehome =
		this.scenario.defSelectValue.sel021[thisi012 && thisi012 > 0 ? thisi012 : 13];

	//same home's name
	ret.sameoffice = this.scenario.defSelectValue.sel001[this.doc.data["i001"]];
	//same office's name

	ret.consCode = consCode;
	return ret;
};

//average compare result
const getAverage_graph = function () {
	let ret = {};
	ret.cost = [];
	ret.co2 = [];

	//  co2[0], cost[0] user
	ret.co2[0] = {};
	ret.co2[0].electricity =
		this.consShow["TO"].electricityOriginal * this.Unit.co2.electricity;
	ret.co2[0].gas = this.consShow["TO"].gasOriginal * this.Unit.co2.gas;
	ret.co2[0].kerosene = this.consShow["TO"].keroseneOriginal * this.Unit.co2.kerosene;
	ret.co2[0].car = this.consShow["TO"].carOriginal * this.Unit.co2.gasoline;
	ret.co2[0].total = this.consShow["TO"].co2Original;

	//user cost
	ret.cost[0] = {};
	//230126 include sell price 
	ret.cost[0].electricity = this.consShow["TO"].priceEle - this.consShow["TO"].priceEleSell;
	ret.cost[0].gas = this.consShow["TO"].priceGas;
	// ret.cost[0].kerosene = this.consShow["TO"].priceKeros;
	ret.cost[0].kerosene = this.consShow["TO"].keroseneOriginal * this.Unit.price.kerosene;
	ret.cost[0].car = this.consShow["TO"].priceCar;

	//	co2[1], cost[1] average
	//ret.cost[1] = this.area.averageCostEnergy; この値とkeroseneの値が異なる
	ret.co2[1] = {};
	ret.co2[1].total = this.average.consList["TO"].co2;	//221210 originalではなく直値
	ret.co2[1].electricity =
		this.average.consList["TO"].electricity * this.Unit.co2.electricity;
	ret.co2[1].gas = this.average.consList["TO"].gas * this.Unit.co2.gas;
	ret.co2[1].kerosene =
		this.average.consList["TO"].kerosene * this.Unit.co2.kerosene;
	ret.co2[1].car = this.average.consList["TO"].car * this.Unit.co2.car;

	//average cost
	ret.cost[1] = {};
	ret.cost[1].electricity = this.average.consList["TO"].priceEle;
	ret.cost[1].gas = this.average.consList["TO"].priceGas;
	// ret.cost[1].kerosene = this.average.consList["TO"].priceKeros;
	ret.cost[1].kerosene = this.average.consList["TO"].kerosene * this.Unit.price.kerosene;
	ret.cost[1].car = this.average.consList["TO"].priceCar;

	return ret;
};

//itemized value
// parameter
// 		consCode : consumption category
// result
//		ret[nowConsCode] : itemized data for table( all items )
//
const getItemize = function (consCode) {
	let ret = {};
	let cons;
	let i = 0;

	for (let cid in this.consList) {
		cons = this.consList[cid];
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
		ret[i].co2Total = this.consShow["TO"].co2;

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
const getItemizeGraph = function (consCode, sort) {
	let otherCaption = "other";
	let cid;

	if (consCode) {
		this.nowConsCode = consCode;
	}
	consCode = this.nowConsCode;
	if (sort) {
		this.nowSortTarget = sort;
	}
	sort = this.nowSortTarget;

	//graph data
	let menu = {
		co2: { sort: "co2", title: "kg", round: 1, divide: 1 },
		energy: { sort: "jules", title: "GJ", round: 1, divide: 1000 },
		money: { sort: "cost", title: "yen", round: 10, divide: 1 } // same code to view
	};
	let show = menu[sort ? sort : "co2"];

	let ret = {};

	//in function getItemizeGraph( return one target of graph data )
	// params
	//		target:   co2/jules/cost
	//		scenario:
	//		original: "original" or ""
	//		consCode: 2 charactors
	// result
	//		ret[]
	let gdata = function (target, scenario, original, consCode) {
		let sorttarget = show.sort;
		if (original) sorttarget += "Original";
		let sum = 0;
		let data = [];
		let di = 0;
		if (consCode == "TO") {
			//in case of Total consumption
			for (cid in target) {
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
				let target2 = target[consCode].partCons;
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

	let captions = ["you", "after", "average"]; //same code to view
	let averageCaption = "";
	if (this.targetMode == 1) {
		averageCaption = this.scenario.defSelectValue.sel021[this.area.area];
	} else {
		averageCaption =
			this.scenario.defSelectValue.sel001[Math.max(1, this.doc.data["i001"])];
	}
	let data = gdata(this.consShow, captions[0], true, consCode);
	Array.prototype.push.apply(
		data,
		gdata(this.consShow, captions[1], false, consCode)
	);
	Array.prototype.push.apply(
		data,
		gdata(this.average.consList, captions[2], false, consCode)
	);

	//graph color list ( get from each cons** class )
	let clist = [];
	for (cid in this.consShow) {
		if (cid == "TO") continue;
		if (consCode == "TO" || cid == consCode) {
			clist.push({
				title: this.consShow[cid].title,
				//co2:this.consShow[cid].co2,
				target: this.consShow[cid][show.sort + "Original"],
				color: this.consShow[cid].color
			});
		}
	}

	//graph order set(sort)
	let ord = [];
	if (consCode == "TO") {
		this.ObjArraySort(clist, "target", "desc");
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
	ret.consTitle = this.consShow[consCode].title;

	return ret;
};

//CO2 itemize array
//
// return
//		consObject array ( [0] is consTotal ) only for graph
//
const dataItemize = function () {
	let consShow = this.consShow;

	let cons_temp = new Array();
	//let cons_rebuild = new Array();
	let ci;

	//remove consTotal
	for (ci in consShow) {
		if (consShow[ci].consCode != "TO") {
			cons_temp.push(consShow[ci]);
		}
	}

	//sort
	let NUMERIC = 16; //function parameter stable definition
	let DESCENDING = 2; //function parameter stable definition
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
const getMonthly = function () {
	let ret = {};
	let menu = {
		co2: { sort: "co2", title: "kg", round: 1, divide: 1 },
		energy: { sort: "jules", title: "MJ", round: 1, divide: 1000 },
		money: { sort: "cost", title: "yen", round: 1, divide: 1 }
	};
	let show = menu["money"];
	let ene1 = [
		{ r: 0, ene: "electricity", name: this.Unit.name["electricity"] },
		{ r: 1, ene: "gas", name: this.Unit.name["gas"] },
		{ r: 2, ene: "kerosene", name: this.Unit.name["kerosene"] },
		{ r: 3, ene: "coal", name: this.Unit.name["coal"] },
		{ r: 4, ene: "hotwater", name: this.Unit.name["hotwater"] },
		{ r: 5, ene: "car", name: this.Unit.name["car"] }
	];

	let month = [];
	let ri = 0;
	let e;
	for (let m = 1; m <= 12; m++) {
		for (e = 0; e < ene1.length; e++) {
			if (!this.consShow["TO"].monthlyPrice[ene1[e].ene]) continue;
			month[ri] = {};
			month[ri]["month"] = m;
			month[ri][show.title] =
				Math.round(
					this.consShow["TO"].monthlyPrice[ene1[e].ene][m - 1] /
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
const getGid = function (consName) {
	return this.logicList[consName].groupID;
};

// getCommonParameters()  getter common result parameters such as co2 ------------------
//
// parameters
//		consCode: consumption code
// retrun
//		co2,cost: total consumption
//		consco2 : target consumption
//
const getCommonParameters = function (consCode) {
	let ret = {};
	ret.co2Original = this.consShow["TO"].co2Original;
	ret.co2 = this.consShow["TO"].co2;
	ret.costOriginal = this.consShow["TO"].costOriginal;
	ret.cost = this.consShow["TO"].cost;

	ret.consco2Original = this.consShow[consCode].co2Original;
	ret.consco2 = this.consShow[consCode].co2;
	ret.conscostOriginal = this.consShow[consCode].costOriginal;
	ret.conscost = this.consShow[consCode].cost;

	return ret;
};

// getConsShow()  getter common result parameters such as co2 ------------------
//
// retrun
//		co2,cost: total consumption
//		consco2 : target consumption
//
const getConsShow = function () {
	let ret = {};
	for (let consCode in this.consShow) {
		ret[consCode] = {};
		ret[consCode].co2Original = this.consShow[consCode].co2Original;
		ret[consCode].co2 = this.consShow[consCode].co2;
		ret[consCode].costOriginal = this.consShow[consCode].costOriginal;
		ret[consCode].cost = this.consShow[consCode].cost;
	}

	return ret;
};

export { getAllResult , getAverage , getAverage_graph , getItemize , getItemizeGraph , dataItemize , getMonthly , getGid , getCommonParameters , getConsShow};