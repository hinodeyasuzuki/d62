/* 2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consTV.js 
 * 
 * calculate consumption and measures related to television
 * one unit of television
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/16 ver.1.0 set functions
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

//Inherited class of D6.consTVsum
class ConsTV extends ConsTVsum {

	constructor() {
		super();

		//construction setting
		this.consName = "consTV";           //code name of this consumption 
		this.consCode = "";                 //short code to access consumption, only set main consumption user for itemize
		this.title = "TV";					//consumption title name
		this.orgCopyNum = 1;                //original copy number in case of countable consumption, other case set 0
		this.addable = "TV";				//the name of object shown as add target
		this.groupID = "7";					//number code in items
		this.color = "#00ff00";				//color definition in graph
		this.countCall = "th";				//how to point n-th equipment

		this.sumConsName = "consTVsum";		//code name of consumption sum up include this
		this.sumCons2Name = "";				//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "How to use each TV";
	}

	precalc() {
		this.clear();

		this.size = this.input("i631" + this.subID, 32);	//size inch
		this.year = this.input("i632" + this.subID, 6);		//year to use

		//time to use hour/day
		if (this.subID == 1) {
			this.useTime = this.input("i633" + this.subID, this.input("i601", 8.5));
		} else if (this.subID == 0) {
			this.useTime = this.input("i633" + this.subID, 0);
		} else {
			//set 0 if not first one and not fill input
			this.useTime = this.input("i633" + this.subID, this.input("i601", 8.5)/2);
		}

		//equipment data set
		var d = new Date();
		if( this.year > 1900 ) this.year = d.getFullYear() - this.year;		
		this.nowEquip = this.equip(d.getFullYear() - this.year, this.size);
		this.newEquip = this.equip(d.getFullYear(), this.size);
		this.nowWatt = this.nowEquip.pf2;
		this.newWatt = this.newEquip.pf1;
	}

	calc() {
		//reduce rate by replace
		this.reduceRateReplace = (1 - this.newWatt / this.nowWatt);

		//electricity kWh/month
		this.electricity = this.useTime * this.nowWatt / 1000 * 30;

		//notuse
		if( this.year == 0 ) this.electricity = 0;
	}

	calc2nd() {
		//in case of residue #0
		if (this.subID == 0) {
			this.electricity = this.sumCons.electricity;
			var cons = D6.consListByName[this.consName];
			for (var i = 1; i < cons.length; i++) {
				this.electricity -= cons[i].electricity;
			}
		}
	}

	calcMeasure() {
		if (this.subID == 0 && D6.consListByName[this.consName][1].electricity > 0) return;

		//mTVtime
		if (this.useTime > 2) {
			this.measures["mTVtime"].calcReduceRate(1 / (this.useTime - 1));
		}

		//mTVbright
		this.measures["mTVbright"].calcReduceRate(this.reduceRateBright);

		//mTVreplace
		this.measures["mTVreplace"].calcReduceRate(this.reduceRateReplace);

	}
}


