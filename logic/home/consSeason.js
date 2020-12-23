/*  2017/12/15  version 1.0
 * coding: utf-8, Tab as 4 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consSeason.js 
 * 
 * calculate seasonal consumption
 * 
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2016/06/09 original JavaScript
 * 								2017/12/15 ver.1.0 set functions
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
var D6 = D6||{};

//Inherited class of ConsBase
D6.consSeason = new ConsBase();

class ConsSeason extends ConsBase {

	constructor() {
		super();

		this.titleList = ["","winter","spring/fall","summer"];	//season name

		//construction setting
		this.consName = "consSeason";   	//code name of this consumption 
		this.consCode = "";            		//short code to access consumption, only set main consumption user for itemize
		this.title = "";					//consumption title name
		this.orgCopyNum = 3;                //original copy number in case of countable consumption, other case set 0
		this.groupID = "2";					//number code in items
		this.color = "#ff0000";				//color definition in graph
		this.countCall = "";				//how to point n-th equipment
		this.residueCalc = "sumup";			//calculate method	no/sumup/yes

		this.sumConsName = "";				//code name of consumption sum up include this
		this.sumCons2Name = "consTotal";	//code name of consumption related to this

		//guide message in input page
		this.inputDisp = "consTotal";		//question display group
		this.inputGuide = "For monthly water and electricity charges per season. Please fill in the approximate value.";

	}
	calc() {
		this.clear();
	}

	calcMeasure() {
	}
}





