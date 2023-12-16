/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consHWdishwash.js 
 * 
 * calculate consumption and measures related to dish wash
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2013/10/03 created as ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/14 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 * 
 * init()			initialize, set parameters when construction
 * precalc()		called just before calc(), input data treatment and clear consumption data
 * calc()			main formula to calculate consumptionb
 * calc2nd()		called just after calc(), in case of need to use other consumption data
 * calcMeasure()	main formula to calculate measures
 * 
 */

 import ConsBase from "../base/consbase.js";

//Inherited class of ConsBase
export class ConsHWdishwash extends ConsBase {

	constructor() {
		super();

		this.reduceRateWashTank = 0.3;			//reduction rate wash with stored water
		this.reduceRateWashNotSummer = 0.5;	//reduction rate with cold water in summer
		this.reduceRateDishWasher = 0.2;		//reduction rate with wash machine
		this.reduceRateShowerTap = 0.4; 	//reduce rate by saving shower head

		//construction setting
		this.consName = "consHWdishwash";  	//code name of this consumption 
		this.consCode = "HW";            		//short code to access consumption, only set main consumption user for itemize
		this.title = "Dish Wash";						//consumption title name
		this.orgCopyNum = 0;                //original copy number in case of countable consumption, other case set 0
		this.groupID = "1";									//number code in items
		this.color = "#ffb700";							//color definition in graph
		this.countCall = "";								//how to point n-th equipment

		this.sumConsName = "consHWsum";			//code name of consumption sum up include this
		this.sumCons2Name = "";							//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "How to use the dishwasher";
	}
	precalc() {
		this.clear();

		//prepare input value
		this.savetype = this.input("i804", 2);		//sessui 
	}


	calc() {
		this.copy(this.sumCons);
		this.multiply(this.sumCons.consHWdishwashRate);
	}

	calcMeasure() {
		//mHWdishTank
		if (this.sumCons.dishWashWater != 1) {
			this.measures["mHWdishTank"].calcReduceRate(this.reduceRateWashTank);
		}

		//mHWdishWater
		if (this.sumCons.dishWashWater != 1) {
			this.measures["mHWdishWater"].calcReduceRate(this.reduceRateWashNotSummer);
		}

		if (this.sumCons.dishWashWater != 1 && this.savetype == 2 ) {
			this.measures["mHWtap"].calcReduceRate(this.reduceRateShowerTap);
		}
	}

}

