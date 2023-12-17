/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consCKpot.js 
 * 
 * calculate consumption and measures related to pot
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

import ConsBase from "../base/consbase.js";

//Inherited class of ConsBase
export class ConsCKsum extends ConsBase {

  constructor() {
    super();

    //construction setting
    this.consName = "consCKsum";    	//code name of this consumption 
    this.consCode = "CK";            	//short code to access consumption, only set main consumption user for itemize
    this.title = "Cooking";						//consumption title name
    this.orgCopyNum = 0;              //original copy number in case of countable consumption, other case set 0
    this.groupID = "4";								//number code in items
    this.color = "#ffe4b5";						//color definition in graph
    this.countCall = "";							//how to point n-th equipment

    this.sumConsName = "consTotal";		//code name of consumption sum up include this
    this.sumCons2Name = "";						//code name of consumption related to this
    this.residueCalc = "no";					//calculate residue

    //guide message in input page
    this.inputGuide = "How to use cooking equipments";
  }


  calc() {
    this.clear();
  }

  calcMeasure() {
  }

}

