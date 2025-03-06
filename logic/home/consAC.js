/* 2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consAC.js 
 * 
 * calculate consumption and measures related to air conditioning incude heating and cooling in one room
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/10 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 * 
 * init()			initialize, set parameters when construction
 * precalc()		called just before calc(), input data treatment and clear consumption data
 * calc()			main formula to calculate consumption
 * calc2nd()		called just after calc(), in case of need to use other consumption data
 * calcMeasure()	main formula to calculate measures
 */

//resolve D6
var D6 = D6 || {};

//Inherited class of D6.consBase
class ConsAC extends ConsBase {

	constructor() {
		super();
		//construction setting
		this.consName = "consAC";           //code name of this consumption 
		this.consCode = "";                 //short code to access consumption, only set main consumption user for itemize
		this.title = "room air conditioning";			//consumption title name
		this.orgCopyNum = 1;                //original copy number in case of countable consumption, other case set 0
		this.groupID = "2";					//number code in items
		this.color = "#ff0000";				//color definition in graph
		this.countCall = "th room";			//how to point n-th equipment

		this.sumConsName = "";				//code name of consumption sum up include this
		this.sumCons2Name = "";				//code name of consumption related to this

		//code name of consumption in which input is shown, set only input page is hidden
		this.inputDisp = "consACcool";

		//guide message in input page
		this.inputGuide = "";

		//definition to point the part of this consumption  
		this.consAddSet = [
			"consACcool",
			"consACheat"
		];
	}


	precalc() {
		this.clear();

		//prepare input value
		this.acYear = this.input("i215" + this.subID, 6);		//year of equipment
		this.acPerf = this.input("i216" + this.subID, 2);		//1:low energy 2:other
		this.acFilter = this.input("i217" + this.subID, -1);	//cleaning action of filter
		this.roomSize = this.input("i212" + this.subID, 12);		//room size (m2)

		var now = new Date();
		if( this.acYear > 1900 ) this.acYear = now.getFullYear() - this.acYear;
		this.nowEquip = this.equip(now.getFullYear() - this.acYear, (this.roomSize < 16 ? 2.8 : 4));
		this.newEquip = this.equip(now.getFullYear(), (this.roomSize < 16 ? 2.8 : 4));
		this.apf = this.nowEquip.pf2 * 0.7 * (this.acPerf == 1 ? 0.8 : 1);
		this.apfMax = this.newEquip.pf1 * 0.7;

		//test code for performance
		if (D6.debugMode) {
			console.assert(this.equip(2015, 2.8).pf1 == 6.5, "2015 2.8kW");
			console.assert(this.equip(2030, 4.5).pf1 == 7, "2030 4.5kW");
			console.assert(this.equip(now.getFullYear(), 4.5).pr1 == 200000, "now 4.5kW price");
			console.assert(this.equip(now.getFullYear(), 4.5).pf1 > 6, "now 4.5kW price");
		}
	}

	calc() {
	}

	//calcuration after all consumptions are calcrated
	calc2nd() {
		//heating plus cooling
		this.acHeat = D6.consListByName["consACheat"][this.subID];
		this.acCool = D6.consListByName["consACcool"][this.subID];
		this.copy(this.acHeat);
		this.add(this.acCool);
	}

	/*performance and price of equipment
	* 	parameter
	*		year : product year include future1
	*		level : 1:good, 2:ordinal
	*		size : kw less than or equal to
	*	return value
	*		ret.pr1 : price of good one
	*		ret.pr2 : price of ordinal one
	*		ret.pf1 : performance of good one
	*		ret.pf2 : performance of ordinal one
	*/
	equip(year, size) {
		var sizeThreshold = [2.8, 4.5, 100];	//last is maxsize

		//definition of equip [size][year][code]
		//	code: pf1,pf2 performance 1 is good one
		//				pr1,pr2 price 1 is good one
		var defEquip = {
			2.8: {
				1900: { "pf1": 3, "pf2": 2, "pr1": 150000, "pr2": 120000 },
				1995: { "pf1": 3, "pf2": 2, "pr1": 150000, "pr2": 120000 },
				2005: { "pf1": 5, "pf2": 3.5, "pr1": 150000, "pr2": 120000 },
				2015: { "pf1": 6.5, "pf2": 5, "pr1": 150000, "pr2": 120000 },
				2030: { "pf1": 7, "pf2": 6, "pr1": 150000, "pr2": 120000 }
			},
			4.5: {
				1900: { "pf1": 3, "pf2": 2, "pr1": 200000, "pr2": 160000 },
				1995: { "pf1": 3, "pf2": 2, "pr1": 200000, "pr2": 160000 },
				2005: { "pf1": 4, "pf2": 2.5, "pr1": 200000, "pr2": 160000 },
				2015: { "pf1": 6, "pf2": 4, "pr1": 200000, "pr2": 160000 },
				2030: { "pf1": 7, "pf2": 6, "pr1": 200000, "pr2": 160000 }
			},
			100: {
				1900: { "pf1": 3, "pf2": 2, "pr1": 240000, "pr2": 220000 },
				1995: { "pf1": 3, "pf2": 2, "pr1": 240000, "pr2": 220000 },
				2005: { "pf1": 3.5, "pf2": 2.5, "pr1": 240000, "pr2": 220000 },
				2015: { "pf1": 4.5, "pf2": 3.5, "pr1": 240000, "pr2": 220000 },
				2030: { "pf1": 6, "pf2": 5, "pr1": 240000, "pr2": 220000 }
			}
		};

		return this.getEquipParameters(year, size, sizeThreshold, defEquip);
	}


	calcMeasure() {
		var mes;	//temporary variable of measure instance

		//mACreplace
		mes = this.measures["mACreplace"];
		if (!this.isSelected("mACreplaceHeat")) {
			if( D6.consListByName["consACcool"][0].electricity > 0 
				&& D6.consListByName["consACcool"][1].electricity > 0
				&& this.subID == 0
			) {
				//avoid double suggestion
			} else {
				mes.copy(this);
				if (this.acHeat.heatEquip == 1) {
					//in case of use air conditioner as heater
					mes.electricity = this.electricity * this.apf / this.apfMax;
					//calc part consumption room heating
					mes["consACheat"] = new Energy();
					mes["consACheat"].copy(this.acHeat);
					mes["consACheat"].electricity = this.acHeat.electricity * this.apf / this.apfMax;
				} else {
					mes.electricity -= this.acCool.electricity * (1 - this.apf / this.apfMax);
				}
				//calculate part consumption room cooling
				mes["consACcool"] = new Energy();
				mes["consACcool"].copy(this.acCool);
				mes["consACcool"].electricity = this.acCool.electricity * this.apf / this.apfMax;

				// in case of wide area heating
				if (this.acHeat.heatArea > 0.3
					&& this.acHeat.houseSize > 60
				) {
					var num = Math.round(Math.max(this.acHeat.houseSize * this.acHeat.heatArea, 25) / 25);
					mes.priceNew = num * mes.def["price"];
				}
			}
		}

		//mACreplaceHeat
		mes = this.measures["mACreplaceHeat"];
		if (this.acHeat.heatEquip != 1) {
			mes.clear();
			mes["consACheat"] = new Energy();
			mes["consACheat"].copy(this.acHeat);
			mes["consACheat"].electricity = this.acHeat.endEnergy / this.apfMax / D6.Unit.calorie.electricity;

			mes["consACcool"] = new Energy();
			mes["consACcool"].copy(this.acCool);
			mes["consACcool"].electricity = this.acCool.electricity * this.acHeat.apf / this.apfMax;

			mes.electricity = mes["consACheat"].electricity + mes["consACcool"].electricity;
			if (this.heatArea > 0.3
				&& this.houseSize > 60
			) {
				mes.priceNew = Math.round(Math.max(this.houseSize * this.heatArea, 25) / 25) * this.nowEquip.pr1;
			}
		}
	}

}




