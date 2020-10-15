/* 2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consRFsum.js 
 * 
 * calculate consumption and measures related to refrigerator in your hourse
 * total use
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/10 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 */

//resolve D6
var D6 = D6||{};

//Inherited class of ConsBase
D6.consRFsum = Object.create(ConsBase);

//initialize
D6.consRFsum.init = function() {
	//construction setting
	this.consName = "consRFsum";      	//code name of this consumption 
	this.consCode = "RF";              	//short code to access consumption, only set main consumption user for itemize
	this.title = "refrigerator";				//consumption title name
	this.orgCopyNum = 0;                //original copy number in case of countable consumption, other case set 0
	this.sumConsName = "consTotal";		//code name of consumption sum up include this
	this.sumCons2Name = "";				//code name of consumption related to this
	this.groupID = "3";					//number code in items
	this.color = "#a0ffa0";				//color definition in graph

	this.residueCalc = "no";			//evaluate residue as #0 or not	no/sumup/yes

	//guide message in input page
	this.inputGuide = "usage of refrigerator";
};
D6.consRFsum.init();


D6.consRFsum.calc = function( ) {
	this.clear();	
	this.count =this.input( "i701", 1 );		//number of refragerator
};


D6.consRFsum.calcMeasure = function( ) {
};

/*performance and price of equipment
 * 	parameter
 *		year : product year include future1
 *		level : 1:good, 2:ordinal
 *		size : L less than or equal to
 *	return value
 *		ret.pr1 : price of good one
 *		ret.pr2 : price of ordninal one
 *		ret.pf1 : performance of good one
 *		ret.pf2 : performance of ordninal one
 */
D6.consRFsum.equip = function( year, size ) {
	var sizeThreshold = [ 100, 200, 300, 400, 500, 1100 ];	//last is maxsize

	//definition of equip [size][year][code]
	//	code: pf1,pf2 performance 1 is good one
	//				pr1,pr2 price 1 is good one
	var defEquip = {
		100 : {
			1900 : { "pf1" : 300, "pf2" : 400, "pr1" : 50000, "pr2" : 40000 } ,
			2005 : { "pf1" : 300, "pf2" : 400, "pr1" : 50000, "pr2" : 40000 } ,
			2015 : { "pf1" : 250, "pf2" : 350, "pr1" : 50000, "pr2" : 40000 } ,
			2030 : { "pf1" : 250, "pf2" : 350, "pr1" : 50000, "pr2" : 40000 }
		},
		200 : {
			1900 : { "pf1" : 350, "pf2" : 450, "pr1" : 90000, "pr2" : 70000 } ,
			2005 : { "pf1" : 350, "pf2" : 450, "pr1" : 90000, "pr2" : 70000 } ,
			2015 : { "pf1" : 350, "pf2" : 450, "pr1" : 90000, "pr2" : 70000 } ,
			2030 : { "pf1" : 350, "pf2" : 450, "pr1" : 90000, "pr2" : 70000 }
		},
		300 : {
			1900 : { "pf1" : 500, "pf2" : 750, "pr1" : 120000, "pr2" : 100000 } ,
			2005 : { "pf1" : 450, "pf2" : 550, "pr1" : 120000, "pr2" : 100000 } ,
			2015 : { "pf1" : 350, "pf2" : 450, "pr1" : 90000, "pr2" : 70000 } ,
			2030 : { "pf1" : 350, "pf2" : 450, "pr1" : 90000, "pr2" : 70000 }
		},
		400 : {
			1900 : { "pf1" : 700, "pf2" : 950, "pr1" : 140000, "pr2" : 120000 } ,
			1995 : { "pf1" : 650, "pf2" : 900, "pr1" : 140000, "pr2" : 120000 } ,
			2015 : { "pf1" : 300, "pf2" : 550, "pr1" : 120000, "pr2" : 100000 } ,
			2030 : { "pf1" : 300, "pf2" : 400, "pr1" : 120000, "pr2" : 100000 }
		},
		500 : {
			1900 : { "pf1" : 900, "pf2" : 1300, "pr1" : 200000, "pr2" : 180000 } ,
			1995 : { "pf1" : 900, "pf2" : 1200, "pr1" : 200000, "pr2" : 180000 } ,
			2015 : { "pf1" : 300, "pf2" : 550, "pr1" : 160000, "pr2" : 140000 } ,
			2030 : { "pf1" : 300, "pf2" : 400, "pr1" : 160000, "pr2" : 140000 }
		},
		1100 : {
			1900 : { "pf1" : 1000, "pf2" : 1500, "pr1" : 220000, "pr2" : 200000 } ,
			1995 : { "pf1" : 900, "pf2" : 1400, "pr1" : 220000, "pr2" : 200000 } ,
			2015 : { "pf1" : 400, "pf2" : 750, "pr1" : 200000, "pr2" : 180000 } ,
			2030 : { "pf1" : 400, "pf2" : 500, "pr1" : 200000, "pr2" : 180000 }
		}
	};

	return this.getEquipParameters( year, size, sizeThreshold, defEquip );
};



