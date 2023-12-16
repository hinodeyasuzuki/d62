/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consCRtrip.js 
 * 
 * calculate consumption and measures related to movement with cars
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

 import {ConsCRsum} from "./consCRsum.js";
 import {D6} from "../d6.js";

//Inherited class of this.consCRsum
export class ConsCRtrip extends ConsCRsum {

	//initialize
	constructor() {
		super();

		//construction setting
		this.consName = "consCRtrip";    	//code name of this consumption 
		this.consCode = "";            		//short code to access consumption, only set main consumption user for itemize
		this.title = "movement";					//consumption title name
		this.orgCopyNum = 1;             	//original copy number in case of countable consumption, other case set 0
		this.groupID = "8";								//number code in items
		this.color = "#ee82ee";						//color definition in graph
		this.countCall = "th places";			//how to point n-th equipment
		this.addable = "destination";

		this.sumConsName = "consCRsum";		//code name of consumption sum up include this
		this.sumCons2Name = "";						//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "how to use cars by destinations";
	}

	precalc() {
		this.clear();

		this.mesTitlePrefix = this.input("i921" + this.subID, this.mesTitlePrefix);	//destination
		this.frequency = this.input("i922" + this.subID, 250);		//frequency to visit
		this.km = this.input("i923" + this.subID, 0);		//distance
		this.carID = this.input("i924" + this.subID, 1);		//car to mainly use

		//instance of car
		this.consCar = D6.consListByName["consCR"][this.carID];
	}

	calc() {
		//performance
		this.performance = this.consCar.performance;

		//consumption of gasoline L/month
		this.car = this.km * 2 * this.frequency / 12 / this.performance;

		//add related car
		this.consCar.car += this.car;
	}

	calc2nd() {
		//calc residue
		if (this.subID == 0) {
			this.car = this.sumCons.car;
			let cons = D6.consListByName[this.consName];
			for (let i = 1; i < cons.length; i++) {
				this.car -= cons[i].car;
			}
		}
	}

	calcMeasure() {
		//mCRwalk
		if (this.km < 3) {
			this.measures["mCRwalk"].calcReduceRate(this.walkRate);
		}

		//mCR20percent
		this.measures["mCR20percent"].calcReduceRate(0.2);

		//mCRtrain
		this.measures["mCRtrain"].calcReduceRate(this.reduceRatePublic * this.publicRate);

	}

}


