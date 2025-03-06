/* 2017/12/15  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consLI.js 
 * 
 * calculate consumption and measures related to light
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
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

//resolve D6
var D6 = D6 || {};

//Inherited class of D6.consLIsum
class ConsLI extends ConsLIsum {

	constructor() {
		super();

		//construction setting
		this.consName = "consLI";   		//code name of this consumption 
		this.consCode = "";            	//short code to access consumption, only set main consumption user for itemize
		this.title = "light";						//consumption title name
		this.orgCopyNum = 1;            //original copy number in case of countable consumption, other case set 0
		this.addable = "room for lighting";		//add message
		this.groupID = "6";							//number code in items
		this.color = "#ffff00";					//color definition in graph
		this.countCall = "th room";			//how to point n-th equipment

		this.sumConsName = "consLIsum";	//code name of consumption sum up include this
		this.sumCons2Name = "";					//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "how to use each room lighting";
	}

	precalc() {
		this.clear();

		// room name
		var roomNames = ["", "玄関", "門灯", "廊下", "トイレ", "脱衣所", "風呂", "居室"];
		this.rid = this.input("i511" + this.subID, 0);					//room ID
		this.mesTitlePrefix = this.rid ? roomNames[this.rid]
			: this.mesTitlePrefix;										//set room name

		this.type = this.input("i512" + this.subID, 2);				//type of light
		this.watt = this.input("i513" + this.subID, 0);				//electricity W/tube
		this.num = this.input("i514" + this.subID, 0);					//tube number
		this.time = this.input("i515" + this.subID, this.lightTime);	//time to use hour/day
	}

	calc() {
		//in case of no electricity input
		if (!(this.watt > 0)) {
			if (this.type == 1) {
				//LED
				this.watt = 10;
			} else if (this.type == 2) {
				//fluorescent lump 
				this.watt = 20;
			} else {
				//bulb
				this.watt = 60;
			}
		}
		this.electricity = this.watt * this.time * this.num / 1000 * 365 / 12;
	}

	calc2nd() {
		if (this.subID == 0) {
			//in case of residue
			this.electricity = this.sumCons.electricity;
			var cons = D6.consListByName[this.consName];
			for (var i = 1; i < cons.length; i++) {
				this.electricity -= cons[i].electricity;
			}

			//lighttype in consLIsum
			if (this.lightType == 1) {
				this.type = 1;
			} else if (this.lightType == 3) {
				this.type = 5;
			} else {
				this.type = 2;
			}
			this.watt = this.sumWatt;
			this.num = 1;
		}
	}

	calcMeasure() {
		var rejectSelect = false;
		//var mes;

		//can or not install good light
		if (
			this.isSelected("mLILED")
			|| this.isSelected("mLIceilingLED")
			|| this.isSelected("mLIsensor")
		) {
			rejectSelect = true;
		}

		//mLILED
		if ((this.type == 5 || this.type == 6)
			|| this.watt < 20
			|| rejectSelect
		) {
		} else {
			if (this.type == 1) {
				this.measures["mLILED"].calcReduceRate(this.reduceRateLED);
			} else if (this.type == 2 || this.type == 3) {
				this.measures["mLILED"].calcReduceRate(
					(this.reduceRateLED - this.reduceRateBulb) / this.reduceRateLED);
			}
		}

		//mLIceilingLED
		if (this.type == 3
			&& this.watt * this.num > 50
			&& !rejectSelect
		) {
			this.measures["mLIceilingLED"].calcReduceRate(this.reduceRateCeiling);
		}

		//mLIsensor
		if (this.rid >= 1 && this.rid <= 3) {
			this.measures["mLIsensor"].electricity =
				(this.outdoorWatt * this.outdoorTime + this.sensorWatt * 24)
				* 365 / 1000 / 12;
		}

		//mLItime
		if (this.time >= 2) {
			this.measures["mLItime"].calcReduceRate(1 / (this.time - 1));
		}
	}

}

