/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consCKrice.js 
 * 
 * calculate consumption and measures related to rice cooker
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
class ConsCKrice extends ConsBase {

	constructor() {
		super();

		this.wattOrdinal = 30;				//electricity for keep hot（W)

		//construction setting
		this.consName = "consCKrice";  	//code name of this consumption 
		this.consCode = "CK";          	//short code to access consumption, only set main consumption user for itemize
		this.title = "rice cooker";			//consumption title name
		this.orgCopyNum = 0;            //original copy number in case of countable consumption, other case set 0
		this.groupID = "4";							//number code in items
		this.color = "#ffe4b5";					//color definition in graph
		this.countCall = "";						//how to point n-th equipment

		this.sumConsName = "consCKsum";		//code name of consumption sum up include this
		this.sumCons2Name = "";						//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "how to use rice cooker";
	}

	precalc() {
		this.clear();

		//prepare input value
		this.person = this.input("i001", 3);			//person number
		this.frequency = this.input("i802", 5);		//frequency of cooking
		this.time = this.input("i820", 6);				//keep hot time
	}

	calc() {
		//monthly electricity consumption kWh/month
		this.electricity = this.wattOrdinal * this.time * 30 / 1000;
	}

	calcMeasure() {
		//mPTstopRiceCooker
		this.measures["mPTstopRiceCooker"].clear();
		this.measures["mPTstopRiceCooker"].electricity = 0.1;
	}

}

