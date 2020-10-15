/* 2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consTV.js 
 * 
 * calculate consumption and measures related to television
 * total television
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
D6.consTVsum = Object.create(ConsBase);

//初期設定値
D6.consTVsum.init = function() {
	this.watt = 100; //electricity consumption default W

	this.reduceRateRadio = 0.5; //reduce rate by change to radio
	this.reduceRateBright = 0.2; //reduce rate by change brightness

	//construction setting
	this.consName = "consTVsum"; //code name of this consumption
	this.consCode = "TV"; //short code to access consumption, only set main consumption user for itemize
	this.title = "TV"; //consumption title name
	this.orgCopyNum = 0; //original copy number in case of countable consumption, other case set 0
	this.groupID = "7"; //number code in items
	this.color = "#00ff00"; //color definition in graph

	this.sumConsName = "consTotal"; //code name of consumption sum up include this
	this.sumCons2Name = ""; //code name of consumption related to this
	this.residueCalc = "sumup"; //calculate type of residue	no/sumup/yes

	//guide message in input page
	this.inputGuide = "how to use TV totally";
};
D6.consTVsum.init();

D6.consTVsum.calc = function() {
	this.useTime = this.input("i601", 8.5); //time to use hour

	//electiricy kWh/month
	this.electricity = this.watt / 1000 * this.useTime * 30;
};

D6.consTVsum.calc2nd = function() {
	var electricity = this.electricity; //backup
	this.clear();

	//add each terevition
	for (var id in this.partCons) {
		this.add(this.partCons[id]);
	}

	//use total electricity if sum of TV is smaller
	if (electricity > this.electricity) {
		this.electricity = electricity;
	}
};

/*performance and price of equipment
 * 	parameter
 *		year : product year include future1
 *		level : 1:good, 2:ordinal
 *		size : inch less than or equal to
 *	return value
 *		ret.pr1 : price of good one
 *		ret.pr2 : price of ordninal one
 *		ret.pf1 : performance of good one
 *		ret.pf2 : performance of ordninal one
 */
D6.consTVsum.equip = function(year, size) {
	var sizeThreshold = [20, 30, 40, 50, 60, 120]; //last is maxsize

	//definition of equip [size][year][code]
	//	code: pf1,pf2 performance 1 is good one
	//				pr1,pr2 price 1 is good one
	var defEquip = {
		20: {
			1900: { pf1: 100, pf2: 150, pr1: 500000, pr2: 400000 },
			1995: { pf1: 50, pf2: 100, pr1: 50000, pr2: 40000 },
			2005: { pf1: 40, pf2: 80, pr1: 40000, pr2: 30000 },
			2015: { pf1: 30, pf2: 50, pr1: 30000, pr2: 25000 },
			2030: { pf1: 20, pf2: 30, pr1: 30000, pr2: 25000 }
		},
		30: {
			1900: { pf1: 150, pf2: 300, pr1: 500000, pr2: 400000 },
			1995: { pf1: 80, pf2: 150, pr1: 80000, pr2: 60000 },
			2005: { pf1: 50, pf2: 100, pr1: 50000, pr2: 40000 },
			2015: { pf1: 40, pf2: 60, pr1: 40000, pr2: 35000 },
			2030: { pf1: 30, pf2: 40, pr1: 40000, pr2: 35000 }
		},
		40: {
			1900: { pf1: 400, pf2: 500, pr1: 500000, pr2: 400000 },
			1995: { pf1: 300, pf2: 500, pr1: 200000, pr2: 150000 },
			2005: { pf1: 100, pf2: 200, pr1: 120000, pr2: 100000 },
			2015: { pf1: 60, pf2: 120, pr1: 100000, pr2: 80000 },
			2030: { pf1: 40, pf2: 80, pr1: 80000, pr2: 70000 }
		},
		50: {
			1900: { pf1: 500, pf2: 700, pr1: 500000, pr2: 400000 },
			1995: { pf1: 500, pf2: 700, pr1: 400000, pr2: 300000 },
			2005: { pf1: 200, pf2: 400, pr1: 200000, pr2: 180000 },
			2015: { pf1: 100, pf2: 200, pr1: 140000, pr2: 120000 },
			2030: { pf1: 80, pf2: 160, pr1: 100000, pr2: 90000 }
		},
		60: {
			1900: { pf1: 500, pf2: 700, pr1: 500000, pr2: 400000 },
			1995: { pf1: 500, pf2: 700, pr1: 500000, pr2: 400000 },
			2005: { pf1: 250, pf2: 500, pr1: 400000, pr2: 300000 },
			2015: { pf1: 120, pf2: 200, pr1: 180000, pr2: 160000 },
			2030: { pf1: 100, pf2: 180, pr1: 160000, pr2: 150000 }
		},
		120: {
			1900: { pf1: 500, pf2: 700, pr1: 500000, pr2: 400000 },
			1995: { pf1: 500, pf2: 700, pr1: 500000, pr2: 400000 },
			2005: { pf1: 350, pf2: 500, pr1: 400000, pr2: 300000 },
			2015: { pf1: 200, pf2: 400, pr1: 180000, pr2: 160000 },
			2030: { pf1: 180, pf2: 250, pr1: 160000, pr2: 150000 }
		}
	};

	return this.getEquipParameters(year, size, sizeThreshold, defEquip);
};

D6.consTVsum.calcMeasure = function() {
	//mTVradio
	this.measures["mTVradio"].calcReduceRate(this.reduceRateRadio);
};
