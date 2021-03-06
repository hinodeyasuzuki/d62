﻿/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consEnergy.js 
 * 
 * calculate consumption and measures related to total energy
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 *								2016/06/09 divided from consBase
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

//Inherited class of D6.consCRsum
class ConsEnergy extends ConsBase {

	constructor() {
		super();

		//construction setting
		this.consName = "consEnergy";    				//code name of this consumption 
		this.consCode = "";            					//short code to access consumption, only set main consumption user for itemize
		this.title = "General Energy Setting";	//consumption title name
		this.orgCopyNum = 0;                		//original copy number in case of countable consumption, other case set 0
		this.groupID = "0";											//number code in items
		this.color = "#ff0000";									//color definition in graph
		this.countCall = "";										//how to point n-th equipment

		this.sumConsName = "consTotal";		//code name of consumption sum up include this
		this.sumCons2Name = "";						//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "the use of energy of the whole house, monthly bills";

		// add instance combined to this class
		this.partConsName = [
		];
	}


	calc() {
		this.clear();
	}

	calcMeasure() {
	}
}

