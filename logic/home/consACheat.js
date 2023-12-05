/* 2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consACheat.js 
 * 
 * calculate consumption and measures related to heating in one room
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2016/04/12 devide file from sumCons.js
 * 								2017/12/10 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 * 
 * init()			initialize, set parameters when construction
 * precalc()		called just before calc(), input data treatment and clear consumption data
 * calc()			main formula to calculate consumption
 * calc2nd()		called just after calc(), in case of need to use other consumption data
 * calcMeasure()	main formula to calculate measures
 */

import ConsHTsum from "./consHTsum";

// Inherited class of D6.consHTsum
class ConsACheat extends ConsHTsum {

	// initialize
	constructor() {
		super();

		//construction setting
		this.consName = "consACheat"; 		//code name of this consumption 
		this.consCode = "";                 //short code to access consumption, only set main consumption user for itemize
		this.title = "room heating";		//consumption title name
		this.orgCopyNum = 1;                //original copy number in case of countable consumption, other case set 0
		this.addable = "room air conditioning";	//the name of object shown as add target
		this.sumConsName = "consHTsum";		//code name of consumption sum up include this
		this.sumCons2Name = "consAC";		//code name of consumption related to this
		this.groupID = "2";					//number code in items
		this.color = "#ff0000";				//color definition in graph
		this.countCall = "th room";			//how to point n-th equipment

		//guide message in input page
		this.inputGuide = "how to use each room heating";

		this.partialWatt = 130;
	}


	precalc() {
		this.clear();
		this.houseSize = 1;

		//link to consAC
		this.ac = D6.consListByName["consAC"][this.subID];

		//parameters
		this.heatSpace = this.input("i212" + this.subID, 13);			//size of room (m2)
		this.heatEquip = this.input("i231" + this.subID, this.sumCons.heatEquip);	//equipment for heating
		this.heatTime = this.input("i233" + this.subID, this.sumCons.heatTime);	//heating time ( hour/day )
		this.heatTemp = this.input("i234" + this.subID, this.sumCons.heatTemp);	//temperature setting( degree-C )
		this.heatMonth = this.input("i235" + this.subID, this.sumCons.heatMonth);	//heating month
		this.windowArea = this.input("i213" + this.subID, -1);		//window size (m2)
		this.windowPerf = this.input("i214" + this.subID, -1);		//window insulation level

		this.consHTsum = D6.consListByName["consHTsum"][0];
		this.reduceRateDouble = this.consHTsum.reduceRateDouble;
		this.reduceRateUchimado = this.consHTsum.reduceRateUchimado;
		this.reduceRateLowe = this.consHTsum.reduceRateLowe;
		this.reduceRateInsulation= this.consHTsum.reduceRateInsulation;
	}

	calc() {
		//calculate heat load ( kcal/month in heating days )
		var heatKcal = this.calcHeatLoad(this.heatSpace, this.heatTime, this.heatMonth, this.heatTemp, this.sumCons.heatMonth);

		//calculate annual energy from heating season monthly one.
		heatKcal *= this.heatMonth / 12;
		this.endEnergy = heatKcal;

		//guess heat equipment
		if (this.heatEquip <= 0) {
			//use house total
			this.heatEquip = this.sumCons.heatEquip;
		}

		//guess main energy source
		//220715 use 1st place for energy
		if (this.heatEquip%10 == 1 || this.heatEquip%10 == 2) {
			this.mainSource = "electricity";
		} else if (this.heatEquip%10 == 3) {
			this.mainSource = "gas";
		} else if (this.heatEquip%10 == 4) {
			this.mainSource = "kerosene";
		} else {
			//use house total
			this.mainSource = this.sumCons.mainSource;
		}

		//air conditioner consumption when which is used
		this.calcACkwh = heatKcal / this.ac.apf / D6.Unit.calorie.electricity;
		if (this.mainSource == "electricity" && this.heatEquip != 2) {
			//set air conditioner value
			this[this.mainSource] = this.calcACkwh;
		} else {
			this[this.mainSource] = heatKcal / D6.Unit.calorie[this.mainSource];
		}

	}

	//calculation after all consumptions are calculated
	calc2nd() {
		//calculate residue
		if (this.subID == 0) {
			this.copy(this.sumCons);
			var cons = D6.consListByName[this.consName];
			for (var i = 1; i < cons.length; i++) {
				this.sub(cons[i]);
			}
			if( this.gas < 0 ) this.gas = 0;
			if( this.kerosene < 0 ) this.kerosene = 0;
		}
		var nowapf = 1;
		if (this.ac.heatEquip != 2) {
			nowapf = this.ac.apf;
		}
		var heatKcal = this.electricity * D6.Unit.calorie.electricity * nowapf
			+ this.gas * D6.Unit.calorie.gas
			+ this.kerosene * D6.Unit.calorie.kerosene;
		this.endEnergy = heatKcal;
	}

	calcMeasure() {
		//var mes;

		//not show 1st room
		var notshow1st = ( (this.subID == 1) && this.input("i2121",-1) == -1 )
			|| ( (this.subID == 0) && this.input("i2121",-1) != -1);

		if ( notshow1st) return;


		//mACFilter,mACchangeHeat
		if (this.heatEquip == 1) {
			//in case of air-conditioner heater
			this.measures["mACfilter"].copy(this);
			this.measures["mACfilter"]["electricity"] =
				this.electricity * (1 - this.reduceRateFilter)
				- D6.consShow["CO"].electricity * this.reduceRateFilterCool;

		} else {
			//mACchangeHeat
			this.measures["mACchangeHeat"].clear();
			this.measures["mACchangeHeat"].electricity = this.endEnergy / this.ac.nowEquip.pf2
				/ D6.Unit.calorie.electricity;

			//mACFilter
			this.measures["mACfilter"].copy(this);
			this.measures["mACfilter"].electricity = this.electricity
				- D6.consShow["CO"].electricity * this.reduceRateFilterCool;
		}

		//mHTdouble
		if (!this.sumCons.isSelected("mHTdoubleAll")
			&& !this.sumCons.isSelected("mHTuchimadoAll")
			&& !this.sumCons.isSelected("mHTloweAll")
			&& !this.sumCons.isSelected("mHTuchimado")
			&& !this.sumCons.isSelected("mHTlowe")
			&& !this.sumCons.isSelected("mHTreformLV5")
			&& !this.sumCons.isSelected("mHTreformLV6")
			&& !D6.consTotal.isSelected("mTOzeh")
		) {
			this.measures["mHTdouble"].calcReduceRate(this.reduceRateDouble);
		}

		//mHTuchimado
		if (!this.sumCons.isSelected("mHTuchimadoAll")
			&& !this.sumCons.isSelected("mHTloweAll")
			&& !this.sumCons.isSelected("mHTlowe")
			&& !this.sumCons.isSelected("mHTreformLV5")
			&& !this.sumCons.isSelected("mHTreformLV6")
			&& !D6.consTotal.isSelected("mTOzeh")
		) {
			this.measures["mHTuchimado"].calcReduceRate(this.reduceRateUchimado);
		}

		//mHTlowe
		if (
			!this.sumCons.isSelected("mHTloweAll") 
			&& !this.sumCons.isSelected("mHTuchimadoAll")
			&& !this.sumCons.isSelected("mHTreformLV5")
			&& !this.sumCons.isSelected("mHTreformLV6")
			&& !D6.consTotal.isSelected("mTOzeh")
		) {
			this.measures["mHTlowe"].calcReduceRate(this.reduceRateLowe);
		}

		//mHTwindowSheet
		this.measures["mHTwindowSheet"].calcReduceRate(this.reduceRateInsulation);

		//mHTtemplature
		if (this.subID == 0 && this.input("i2341",-1) == -1 ) {
			this.measures["mHTtemplature"].calcReduceRate( 2 / 10);
			this.measures["mHTtemplature"].title = "暖かく過ごす工夫をして暖房設定温度を控えめにする";
			this.measures["mHTtemplature"].titleShort = "暖かく過ごす工夫をする";
		} else if (this.heatTemp >= 21) {
			this.measures["mHTtemplature"].calcReduceRate((this.heatTemp - 20) / 10);
		}

		//mHTtime
		if (this.heatTime > 2 ) {
			this.measures["mHTtime"].calcReduceRate(1 / (this.heatTime - 1));
		}

		//mHTuchimado
		this.measures["mHTuchimado"].calcReduceRate(0.15);

		//mHTceiling
		this.measures["mHTceiling"].calcReduceRate(0.1);

		//mHTpartialHeating
		this.measures["mHTpartialHeating"].calcReduceRate(0.3);
		this.measures["mHTpartialHeating"].electricity += this.partialWatt * this.heatTime * 30 * this.heatMonth / 12 / 1000;

	}

}

export default class {consACheat}
