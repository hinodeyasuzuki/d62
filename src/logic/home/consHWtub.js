/* 2017/12/15  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consHWdresser.js 
 * 
 * calculate consumption and measures related to bathtub
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2013/10/03 original ActionScript3
 * 								2016/04/12 ported to JavaScript
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

import ConsBase from "../base/consbase.js";

//Inherited class of ConsBase
export class ConsHWtub extends ConsBase {

  constructor() {
    super();

    this.autoKeepRate = 0.5;			//reduce rate to change auto heating to demand heating

    //construction setting
    this.consName = "consHWtub";   	 	//code name of this consumption 
    this.consCode = "HW";            	//short code to access consumption, only set main consumption user for itemize
    this.title = "Bathtub";				//consumption title name
    this.orgCopyNum = 0;                //original copy number in case of countable consumption, other case set 0
    this.groupID = "1";					//number code in items
    this.color = "#ffb700";				//color definition in graph
    this.countCall = "";				//how to point n-th equipment

    this.sumConsName = "consHWsum";		//code name of consumption sum up include this
    this.sumCons2Name = "";				//code name of consumption related to this

    //guide message in input page
    this.inputGuide = "how to use hot water in bath tub";

  }

  calc() {
    this.copy(this.sumCons);
    this.multiply(this.sumCons.consHWtubRate);
  }

  calcMeasure() {
    //mHWinsulation
    this.measures["mHWinsulation"].calcReduceRate(this.sumCons.reduceRateInsulation);

    //mHWkeep
    this.measures["mHWkeep"].calcReduceRate(this.sumCons.reduceRateTabKeep);

    //mHWstopAutoKeep 
    if (this.sumCons.keepMethod > 2) {
      this.measures["mHWstopAutoKeep"].calcReduceRate(this.sumCons.reduceRateTabKeep * this.autoKeepRate);
    }

    //mHWonlyShower
    this.measures["mHWonlyShower"].calcReduceRate(this.sumCons.reduceRateStopTabSummer);
  }
}

