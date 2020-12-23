/* 2017/12/10  version 1.0
 * coding: utf-8, Tab as 4 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consRF.js 
 * 
 * calculate consumption and measures related to refrigerator
 * one unit of refrigarator
 * 
 * License: http://creativecommons.org/licenses/LGPL/2.1/
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

//Inherited class of D6.consRFsum
class ConsRF extends ConsRFsum {

	//initialize
	constructor() {
		super();
		
		this.consYear = 650; //ordinal electricity consumption per year(kWh/year)
		this.consYearAdvanced = 300; //energy saving type (kWh/year)
		this.reduceRateWall = 0.1; //reduction rate through make space between wall and refrigerator
		this.reduceRateTemplature = 0.12; //reduction rate through set saving temperature

		//construction setting
		this.consName = "consRF"; //code name of this consumption
		this.consCode = ""; //short code to access consumption, only set main consumption user for itemize
		this.title = "refrigerator"; //consumption title name
		this.orgCopyNum = 1; //original copy number in case of countable consumption, other case set 0
		this.addable = "refrigerator"; //the name of object shown as add target
		this.groupID = "3"; //number code in items
		this.color = "#a0ffa0"; //color definition in graph
		this.countCall = "th"; //how to point n-th equipment

		this.sumConsName = "consRFsum"; //code name of consumption sum up include this
		this.sumCons2Name = ""; //code name of consumption related to this

		//guide message in input page
		this.inputGuide = "How to use each refrigerator";
	}

	precalc() {
		this.clear();

		//prepare input value
		this.year = this.input("i711" + this.subID, 8); //equipment year
		this.type = this.input("i712" + this.subID, 1); //type
		this.size = this.input("i713" + this.subID, 350); //size (L)
		this.templature = this.input("i714" + this.subID, 4); //setting of temprature
		this.full = this.input("i715" + this.subID, 4); //stuffing too much
		this.space = this.input("i716" + this.subID, 3); //space beteween wall and refragerator
		this.performance = this.input("i721", 2); //performance

		var d = new Date();
		this.nowEquip = this.equip(d.getFullYear() - this.year, this.size);
		this.newEquip = this.equip(d.getFullYear(), this.size);
	}

	calc() {
		// now consumption (kWh/year)
		this.consYear = this.nowEquip.pf2 * (this.type == 2 ? 2 : 1);

		//new type of refregerator(kWh/year)
		this.consYearAdvanced = this.newEquip.pf1 * (this.type == 2 ? 2 : 1);

		//reduction rate to replace new one
		this.reduceRateChange = this.consYearAdvanced / this.consYear;

		// set 0-th equipment charactrictic to refregerator
		if (this.subID == 0) {
			if (this.input("i7111", -1) < 0 && this.input("i7131", -1) < 0) {
				//in case of no input set 0-th data as sumup by count
				this.electricity = this.consYear * this.count / 12;
			} else {
				this.electricity = 0;
			}
			return;
		}

		if (
			this.subID > 0 &&
			this.input("i711" + this.subID, -1) < 0 &&
			this.input("i713" + this.subID, -1) < 0
		) {
			//not calculate of no input
			return;
		}

		//monthly electricity consumption (kWh/month)
		this.electricity = this.consYear / 12;

		//fix in case of stuffing too much
		this.electricity =
			this.electricity * (this.full == 3 ? 1.1 : this.full == 1 ? 0.9 : 1);

		//fix in case of no space
		this.electricity =
			this.electricity * (this.space == 1 ? 0.95 : this.space == 2 ? 1.05 : 1);

		//fix by temperature
		this.electricity =
			this.electricity *
			(this.templature == 1 ? 1.1 : this.templature == 3 ? 0.95 : 1);

		//fix by performance
		this.electricity =
			this.electricity *
			(this.performance == 1 ? 0.8 : this.performance == 3 ? 1.2 : 1);

		if (this.year == 0) this.electricity = 0;
	}

	calcMeasure() {
		//mRFreplace
		this.measures["mRFreplace"].calcReduceRate(this.reduceRateChange);

		//mRFtemplature
		if (this.templature != 3) {
			this.measures["mRFtemplature"].calcReduceRate(this.reduceRateTemplature);
		}

		//mRFwall
		if (this.space != 1) {
			this.measures["mRFwall"].calcReduceRate(this.reduceRateWall);
		}

		//mRFstop
		if (this.count > 1) {
			if (this.subID == 0) {
				//in case of rough estimation
				this.measures["mRFstop"].calcReduceRate(1 / this.count);
			} else {
				this.measures["mRFstop"].electricity = 0;
			}
		}
	}

}

