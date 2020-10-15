/* 2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consACcool.js 
 * 
 * calculate consumption and measures related to cooling in one room
 * 
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2016/04/12 devide file from consCOOL.js
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

//Inherited class of D6.consCOsum
D6.consACcool = Object.create(D6.consCOsum);

//initialize
D6.consACcool.init = function () {
	//construction setting
	this.consName = "consACcool"; 		//code name of this consumption 
	this.consCode = "";                 //short code to access consumption, only set main consumption user for itemize
	this.title = "room air conditioning";			//consumption title name
	this.orgCopyNum = 1;                //original copy number in case of countable consumption, other case set 0
	this.addable = "room air conditioning";	//the name of object shown as add target
	this.groupID = "2";					//number code in items
	this.color = "#0000ff";				//color definition in graph
	this.countCall = "th room";			//how to point n-th equipment

	this.sumConsName = "consCOsum";		//code name of consumption sum up include this
	this.sumCons2Name = "consAC";		//code name of consumption related to this

	//guide message in input page
	this.inputGuide = "how to use air conditioning for each room";

};
D6.consACcool.init();


D6.consACcool.precalc = function () {
	this.clear();
	this.houseSize = 1;

	//link to consAC
	this.ac = D6.consListByName["consAC"][this.subID];

	//prepare input value
	this.coolArea = this.input("i212" + this.subID, 12);		//size of room (m2)
	this.coolTime = this.input("i271" + this.subID, this.sumCons.coolTime);	//time of cooling per day (hour/day)
	this.coolTemp = this.input("i273" + this.subID, this.sumCons.coolTemp);	//temperature setting (degree-C)
	this.coolMonth = this.input("i274" + this.subID, this.sumCons.coolMonth);	//cooling month
};

D6.consACcool.calc = function () {
	//calculate cooling load ( kcal/month in cooling days )
	var coolKcal = this.calcCoolLoad(this.coolArea, this.coolTime, this.coolTemp, this.coolMonth);

	//calculate annual electricity from cooling season monthly one.
	coolKcal *= D6.area.seasonMonth.summer / 12;

	//monthly consumption electricity kWh/mon
	this.electricity = coolKcal / this.ac.apf / D6.Unit.calorie.electricity;

};

//calculation after all consumptions are calclated
D6.consACcool.calc2nd = function () {
	//in case of residue
	if (this.subID == 0) {
		this.electricity = this.sumCons.electricity;
		var cons = D6.consListByName[this.consName];
		for (var i = 1; i < cons.length; i++) {
			this.electricity -= cons[i].electricity;
		}
	}
};

D6.consACcool.calcMeasure = function () {
	if (this.subID > 0 || this.electriity == this.sumCons.electricity) return;

	//mCOtemplature
	if (this.coolTemp < 28 && this.coolTemp > 20) {
		this.measures["mCOtemplature"].calcReduceRate((28 - this.coolTemp) / 10);
	} else {
		this.measures["mCOtemplature"].calcReduceRate(0);
	}
};



