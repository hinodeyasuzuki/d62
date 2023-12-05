/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * diagnosis.js 
 * 
 * D6 Main Class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * need d6_construct, d6_calccons, d6_calcmeasures, d6_calcaverage, d6_setvalue, d6_tools
 * 
 * construct();
 *   setscenario()					initialize diagnosis structure by scenario file
 *   addMeasureEachCons()			add measure definition
 *   addConsSetting()				add consumption definition 
 
 * calcCons()					calculate consumption
 * calcConsAdjust()				adjust consumption

 * calcMeasures()				calculate measure
 * calcMeasuresLifestyle()		calculate all measures and select lifestyle
 * calcMeasuresNotLifestyle()	calculate all measures and select not lifestyle
 * calcMeasuresOne()			calculate in temporal selection
 * calcMaxMeasuresList()		automatic select max combination 

 * calcAverage()				get avearage consumption
 * rankIn100()					get rank				

 * inSet()						input data setter
 * measureAdd()					set select flag and not calculate 
 * measureDelete()				clear select flag and not calculate 

 * getGid()						get group id
 * getCommonParameters()		result common parameters
 * 
 * toHalfWidth()
 * ObjArraySort()
 * 
 * other D6 class
 * 		D6.disp		disp.js, disp_input.js, disp_measure.js
 * 		D6.senario	scenarioset.js
 * 
 */

//resolve D6
class D6 {

	//instances
	consList = []; //consumption full list
	consListByName = []; //consumption list by consname
	consShow = []; //major consumption list by conscode
	measureList = []; //measure list
	monthly = []; //monthly energy
	resMeasure = []; //result of measures list

	mesCount = 0; //count of measures
	consCount = 0; //count of consumptions

	average = {
		consList: ""
	}; //average of consumptions

	isOriginal = true; //in case of no measure is selected
	sortTarget = "co2ChangeOriginal"; //by which measureas are sorted, changeable by input

	//view / Debug set. set in workercalc(start,*)
	viewparam = {};
	debugMode = false;

	//constructor
	construct = function (a, b, c) {
		D6.setscenario(a, b, c);
	};

	//calculate
	calculateAll = function () {
		D6.area.setCalcBaseParams();
		//D6.calcCons();
		D6.calcAverage();
		D6.calcMeasures(-1);
	};

	//log
	calclog = "";
	calcshow = "";
}

export default class {D6}
