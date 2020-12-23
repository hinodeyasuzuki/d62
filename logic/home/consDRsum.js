/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consDRsum.js 
 * 
 * calculate consumption and measures related to washer drier of cloth
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/14 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 * 
 * init()			initialize, set parameters when construction
 * precalc()		called just before calc(), input data treatment and clear consumption data
 * calc()			main formula to calculate consumption
 * calc2nd()		called just after calc(), in case of need to use other consumption data
 * calcMeasure()	main formula to calculate measures
 * 
 */

//resolve D6
var D6 = D6 || {};

//Inherited class of ConsBase
class ConsDRsum extends ConsBase {

	constructor() {
		super();

		this.whWash = 100; // only wash wh/day in case of 3 persons
		this.whDry = 1000; // use dry wh/day in case of 3 persons

		this.reduceRateHeatPump = 0.65; //reduce rate by heatpump type
		this.res2Freq = [0, 1, 0.5, 0.2, 0.07, 0];

		//construction setting
		this.consName = "consDRsum"; 		//code name of this consumption
		this.consCode = "DR"; 					//short code to access consumption, only set main consumption user for itemize
		this.title = "laundry washing"; //consumption title name
		this.orgCopyNum = 0; 						//original copy number in case of countable consumption, other case set 0
		this.groupID = "5"; 						//number code in items
		this.color = "#00ffff"; 				//color definition in graph

		this.sumConsName = "consTotal"; //code name of consumption sum up include this
		this.sumCons2Name = ""; 				//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "How to use the cleaner, washing machine and clothes dryer";
	}

	precalc() {
		this.clear();

		this.dryUse = this.input("i401", 0); //use dryer or not
		this.washFreq = this.input("i403", 1); //use dryer or not
		this.person = D6.consShow["TO"].person; //person number
	}

	calc() {
		//rate of dry
		this.rateDry =
			this.whDry *
			this.res2Freq[this.dryUse] /
			(this.whWash + this.whDry * this.res2Freq[this.dryUse]);

		//electricity kWh/month
		this.electricity =
			(this.whWash * this.washFreq + this.whDry * this.res2Freq[this.dryUse]) /
			1000 *
			this.person /
			3 *
			30;
	}

	calcMeasure() {
		//mDRheatPump
		this.measures["mDRheatPump"].calcReduceRate(
			this.rateDry * this.reduceRateHeatPump
		);

		//mDRsolar
		this.measures["mDRsolar"].calcReduceRate(this.rateDry);
	}

}

