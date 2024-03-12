/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consCR.js 
 * 
 * calculate consumption and measures related to each car
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

import { ConsCRsum } from "./consCRsum.js";

//Inherited class of consCRsum
export class ConsCR extends ConsCRsum {

  constructor() {
    super();

    this.consName = "consCR"; 		//code name of this consumption
    this.consCode = ""; 					//short code to access consumption, only set main consumption user for itemize
    this.title = "vehicle"; 			//consumption title name
    this.orgCopyNum = 1; 					//original copy number in case of countable consumption, other case set 0
    this.groupID = "8"; 					//number code in items
    this.color = "#ee82ee"; 			//color definition in graph
    this.countCall = "th car"; 		//how to point n-th equipment
    this.addable = "vehicle";

    //consCR is sub aggrigation, consCRtrip is connected to  consCRsum
    this.sumConsName = ""; 						//code name of consumption sum up include this
    this.sumCons2Name = "consCRsum"; 	//code name of consumption related to this

    //guide message in input page
    this.inputGuide = "the performance and use of each car";
  }

  precalc() {
    this.clear();

    this.carType = this.input("i911" + Math.max(this.subID, 1), 1); //type of car
    this.performance = this.input("i912" + Math.max(this.subID, 1), 12); //performance km/L

    this.ordinalCarNum = this.input("i941", 0);
    this.elecCarNum = this.input("i943", 0);

    // car user
    this.user = this.input("i913" + this.subID, this.subID + this.countCall);
    this.ecoTier = this.input("i914" + this.subID, 3); //eco tier
  }

  calc() {
  }

  calc2nd() {
    let trsum = 0;
    let carnum = D6.consListByName["consCR"].length;
    let tripnum = D6.consListByName["consCRtrip"].length;
    for (let i = 1; i < tripnum; i++) {
      trsum += D6.consListByName["consCRtrip"][i].car;
    }
    if (!this.fg_calccons_not_calcConsAdjust) {
      if (trsum == 0) {
        if (this.subID == 0) {
          //residure
          this.car = this.sumCons2.car;
        } else {
          //in case of no residue
          this.car *= Math.pow(0.5, this.subID);
          if (this.subID == carnum - 1) {
            this.car *= 2;
          }
        }
      } else {
        //recalculate by rate of destination consumption, and calculated by gasoline
        this.car *= this.sumCons2.car / trsum;
      }
    }
  }

  calcMeasure() {
    //mCRreplace
    if (!this.isSelected("mCRreplaceElec")) {
      this.measures["mCRreplace"].calcReduceRate(
        (this.performanceNew - this.performanceNow) / this.performanceNew
      );
    }

    //mCRreplaceElec
    if (!this.isSelected("mCRreplace") &&
      this.carType != 5 &&
      this.ordinalCarNum == 0
    ) {
      this.measures["mCRreplaceElec"].clear();
      this.measures["mCRreplaceElec"].electricity =
        this.performanceNow * this.car / this.performanceElec;
    }

  }
}

