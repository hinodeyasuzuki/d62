/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consCOsum.js 
 * 
 * calculate consumption and measures related to cooling of total home
 * cons
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
export class ConsCOsum extends ConsBase {
  constructor() {
    super();

    this.coolLoadUnit_Wood = 220;			//standard wood house cool load（W/m2）
    this.coolLoadUnit_Steel = 145;			//standard steel house cool load（W/m2）
    this.apf = 4;							//APF Annual performance factor

    this.reduceRateSunCut = 0.1;			//reduce rate by sun cut

    //construction setting
    this.consName = "consCOsum";    	//code name of this consumption 
    this.consCode = "CO";            	//short code to access consumption, only set main consumption user for itemize
    this.title = "cooling";				//consumption title name
    this.orgCopyNum = 0;                //original copy number in case of countable consumption, other case set 0
    this.groupID = "2";					//number code in items
    this.color = "#0000ff";				//color definition in graph
    this.countCall = "";				//how to point n-th equipment

    this.sumConsName = "consTotal";		//code name of consumption sum up include this
    this.sumCons2Name = "";				//code name of consumption related to this

    //guide message in input page
    this.inputGuide = "how to use air cooling in the whole house";
  }

  precalc() {
    this.clear();

    this.person = this.input("i001", 3);			//person number
    this.houseSize = this.input("i003",
      (this.person == 1 ? 60 : (80 + this.person * 10)));	//space of house
    this.houseType = this.input("i002", 1);		//standalone / collective
    this.coolArea = this.input("i201", 0.5);		//rate by space of cooling
    this.coolTime = this.input("i261", 4);		//time
    this.coolTemp = this.input("i263", 27);		//temperature
    this.coolMonth = this.input("i264", window.Area.seasonMonth.summer);		//month
  }

  calc() {
    let coolArea_m2;				//area of cooling m2
    coolArea_m2 = this.houseSize * this.coolArea;
    if (this.coolArea > 0.05) {
      coolArea_m2 = Math.max(coolArea_m2, 13);		//minimun 13m2
    }

    let coolKcal = this.calcCoolLoad(coolArea_m2, this.coolTime, this.coolMonth, this.coolTemp);

    //calculate year average from seasonal average
    coolKcal *= this.coolMonth / 12;

    //monthly electricity
    this.electricity = coolKcal / this.apf / D6.Unit.calorie.electricity;
  }


  calcMeasure() {
    //mCOsunCut
    this.measures["mCOsunCut"].calcReduceRate(this.reduceRateSunCut);
  }


  //cool load calculation kcal/month
  //
  //		cons.houseType : type of structure
  //		cons.houseSize : floor size(m2)
  //		cons.heatArea : area rate of heating(-)
  calcCoolLoad(coolArea_m2, coolTime, coolMonth, coolTemp) {
    let energyLoad = 0;

    let coolLoadUnit = 0;				//cool load kcal/m2/hr
    if (this.houseType == 1) {
      coolLoadUnit = this.coolLoadUnit_Wood;
    } else {
      coolLoadUnit = this.coolLoadUnit_Steel;
    }

    //coefficient of cooling
    let coolFactor = window.Area.getCoolFactor(coolMonth, coolTime);

    let coefTemp;					//difference by temperature
    coefTemp = (27 - coolTemp) / 10 + 1;

    energyLoad = coolLoadUnit * coolFactor[0] * coolArea_m2 * coolTime * 30 * coefTemp;

    return energyLoad;
  }

}

