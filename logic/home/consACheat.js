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
 * 								2016/04/12 devide file from consHEAT.js
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
	}


	precalc() {
		this.clear();
		this.houseSize = 1;

		//link to consAC
		this.ac = D6.consListByName["consAC"][this.subID];
		this.consHeat = Object.getPrototypeOf(this);

		//parameters
		this.heatSpace = this.input("i212" + this.subID, 13);			//size of room (m2)
		this.heatEquip = this.input("i231" + this.subID, this.consHeat.heatEquip);	//equipment for heating
		this.heatTime = this.input("i233" + this.subID, this.consHeat.heatTime);	//heating time ( hour/day )
		this.heatTemp = this.input("i234" + this.subID, this.consHeat.heatTemp);	//temperature setting( degree-C )
		this.heatMonth = this.input("i235" + this.subID, this.consHeat.heatMonth);	//heating month
		this.windowArea = this.input("i213" + this.subID, -1);		//window size (m2)
		this.windowPerf = this.input("i214" + this.subID, -1);		//window insulation level

	}

	calc() {
		//calculate heat load ( kcal/month in heating days )
		var heatKcal = this.calcHeatLoad(this.heatSpace, this.heatTime, this.heatMonth, this.heatTemp);

		//calculate annual energy from heating season monthly one.
		heatKcal *= this.heatMonth / 12;
		this.endEnergy = heatKcal;

		//guess heat equipment
		if (this.heatEquip <= 0) {
			//use house total
			this.heatEquip = this.consHeat.heatEquip;
		}

		//guess main energy source
		if (this.heatEquip == 1 || this.heatEquip == 2) {
			this.mainSource = "electricity";
		} else if (this.heatEquip == 3) {
			this.mainSource = "gas";
		} else if (this.heatEquip == 4) {
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


		//mHTdanran
		if (this.person >= 2
			&& this.heatSpace > 0.3
			&& this.houseSize > 40
		) {
			this.measures["mHTdanran"].calcReduceRate(this.reduceRateDanran);
		}

		//mHTdouble
		if (!this.sumCons.isSelected("mHTdoubleAll")
			&& !this.sumCons.isSelected("mHTuchimadoAll")
			&& !this.sumCons.isSelected("mHTloweAll")
			&& !this.sumCons.isSelected("mHTuchimado")
			&& !this.sumCons.isSelected("mHTlowe")
		) {
			this.measures["mHTdouble"].calcReduceRate(this.reduceRateDouble);
		}

		//mHTuchimado
		if (!this.sumCons.isSelected("mHTuchimadoAll")
			&& !this.sumCons.isSelected("mHTloweAll")
			&& !this.sumCons.isSelected("mHTlowe")
		) {
			this.measures["mHTuchimado"].calcReduceRate(this.reduceRateUchimado);
		}

		//mHTlowe
		if (!this.sumCons.isSelected("mHTloweAll")) {
			this.measures["mHTlowe"].calcReduceRate(this.reduceRateLowe);
		}

		//mHTwindowSheet
		this.measures["mHTwindowSheet"].calcReduceRate(this.reduceRateInsulation);

		//mHTtemplature
		if (this.heatTemp >= 21) {
			this.measures["mHTtemplature"].calcReduceRate((this.heatTemp - 20) / 10);
		}

		//mHTtime
		if (this.heatTime > 2) {
			this.measures["mHTtime"].calcReduceRate(1 / (this.heatTime - 1));
		}

		//mHTuchimado
		this.measures["mHTuchimado"].calcReduceRate(0.15);

		//mHTceiling
		this.measures["mHTceiling"].calcReduceRate(0.1);

	}

}

