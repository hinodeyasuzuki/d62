/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * d6_calccons.js
 *
 * D6 calc Cons Class
 *
 * License: MIT
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2018/03/04 divide consumption calculation functions
 *
 * calcCons()					calculate consumption
 * calcConsAdjust()				adjust consumption
 * getTargetConsList()			get Cons by name
 * getGid()						get group id
 */

import Energy from "./energy.js";

/* calcCons() -------------------------------------------------------
 *		calculate consumption in consumption instance
 */

const calcCons = function () {
	var i, j;

	//area parameters set
	this.setPersonArea(
		this.doc.data.i001,
		this.doc.data.i021,
		this.doc.data.i023
	);

	//pre calculation such as common parameters setting
	//priority 1-3 / none
	for (j = 1; j <= 4; j++) {
		for (i = 0; i < this.consList.length; i++) {
			if (
				this.consList[i].calcpriority == j ||
				(j == 4 && !this.consList[i].calcpriority)
			) {
				this.consList[i].precalc();
			}
		}
	}
	//calculate each consumption at first time
	//priority 1-3 / none
	for (j = 1; j <= 4; j++) {
		for (i = 0; i < this.consList.length; i++) {
			if (
				this.consList[i].calcpriority == j ||
				(j == 4 && !this.consList[i].calcpriority)
			) {
				this.consList[i].calc();
				this.consList[i].calcCO2();
			}
		}
	}

	//calculate 2nd step
	for (i = 0; i < this.consList.length; i++) {
		this.consList[i].calc2nd();
		this.consList[i].calcCO2();
	}

	//adjust among each consumption
	// this.calcConsAdjust();

	//calculate cost and energy
	for (i = 0; i < this.consList.length; i++) {
		this.consList[i].calcCost();
		this.consList[i].calcJules();
		//set as original value, which is in case of no selection
		if (this.isOriginal) {
			this.consList[i].co2Original = this.consList[i].co2;
			this.consList[i].costOriginal = this.consList[i].cost;
			this.consList[i].julesOriginal = this.consList[i].jules;
			this.consList[i].electricityOriginal = this.consList[i].electricity;
			this.consList[i].gasOriginal = this.consList[i].gas;
			this.consList[i].keroseneOriginal = this.consList[i].kerosene;
			this.consList[i].carOriginal = this.consList[i].car;
		}
	}
};

/* calcConsAdjust() --------------------------------------------------
 *		adjust among each consumption
 *		called from calcCons()
 */
const calcConsAdjust = function () {
	let ci, i, j;
	let consNum;
	let consSum;
	let energySum = new Energy();
	let singleArray = true;
	let lastname = "";

	this.energyAdj = new Energy(); //adjust parameters by energy

	// calculate sum of part side consumptions of each consumption exclude total one
	for (ci in this.consShow) {
		consSum = this.consShow[ci];

		if (consSum.consName != "consTotal") {
			energySum.clear();

			if (consSum.partCons.length >= 1) {
				// countable consumption
				lastname = consSum.partCons[0].consName;
				for (i = 1; i < consSum.partCons.length; i++) {
					// sum from 1 not 0. #0 is residue
					energySum.add(consSum.partCons[i]);

					//check if different consName. true:different, false:same
					if (lastname != consSum.partCons[i].consName) {
						singleArray = false;
					}
				}
				energySum.calcCO2();

				if (this.fg_calccons_not_calcConsAdjust || consSum.residueCalc == "no") {
					// refrigerator pattern : each consumption is important
					consSum.copy(energySum);
					consSum.add(consSum.partCons[0]);
					consSum.calcCO2();
				} else {
					// top down pattern : group consumption is important
					if (energySum.co2 > consSum.co2) {
						//in case of sum of each consumption is bigger than sumCons divide each cons
						for (i = 1; i <= consNum; i++) {
							consSum.partCons[i].multiply(consSum.co2 / energySum.co2);
						}
						consSum.partCons[0].clear();
					} else {
						//calculate residue
						if (singleArray) {
							//set residue to partCons[0]
							energySum.sub(consSum);
							energySum.multiply(-1);
							consSum.partCons[0].copy(energySum);
						} else {
							//not to set partCons[0], because #0 is not residue
							consSum.copy(energySum);
							consSum.add(consSum.partCons[0]);
							consSum.calcCO2();
						}
					}
				}
			}
		}
	}

	// adjust total balance by energy type
	//		if sum of electricity/gas or etc. is over total consumption one,
	//		adjust each consumption not over total.
	energySum.clear();

	//sum of consumptions to home total
	for (ci in this.consShow) {
		if (ci != "TO") {
			for (j in this.Unit.co2) {
				energySum[j] += this.consShow[ci][j];
			}
		}
	}

	//parameters existence of extinct total data
	var nodataTotal =
		this.consShow["TO"].noConsData ||
		this.fg_calccons_not_calcConsAdjust || //setting
		this.averageMode; //toggle at calcAverage

	//residue is more than 10% of electricity
	energySum.electricity += this.consShow["TO"].electricity * 0.1;

	//execute adjust
	if (!nodataTotal) {
		//in case of exist in total consumption
		for (j in this.Unit.co2) {
			if (energySum[j] == 0) {
				this.energyAdj[j] = 1; //any number
			} else {
				this.energyAdj[j] = this.consShow["TO"][j] / energySum[j];
				if (
					typeof this.consShow["TO"].noPriceData[j] !== "undefined" &&
					this.consShow["TO"].noPriceData[j]
				) {
					if (!this.averageMode) {
						//価格データがない場合totalは補正しない
						//本来ならあまりに大幅な補正が必要なときにはtotalの数値を変更するが、ここでは平均値も算出するために補正が不要
						var adjustFactor = 2;
						if (this.energyAdj[j] < 1/adjustFactor) {
							this.consShow["TO"][j] *=  1/adjustFactor / this.energyAdj[j];
							this.energyAdj[j] =  1/adjustFactor;
						}
						if (this.energyAdj[j] > adjustFactor && j != "electricity") {
							this.consShow["TO"][j] *= adjustFactor / this.energyAdj[j];
							this.energyAdj[j] = adjustFactor;
						}
					}
				}
				if (j == "electricity") {
					// adjust is less than triple and more than 0.2 times
					var adjustFactorEle = 4;
					this.energyAdj[j] = Math.max(1/adjustFactorEle, Math.min(adjustFactorEle, this.energyAdj[j]));
				} else if (j == "water") {
					this.consShow["TO"][j] = energySum[j];
					this.energyAdj[j] = 1;
				} else {
					// adjust electricity not to be minus but residue is OK
					var adjustFactorOther = 2.5;
					this.energyAdj[j] = Math.max(1/adjustFactorOther, Math.min(adjustFactorOther, this.energyAdj[j]));
				}
			}
		}

		//execute adjust
		for (ci in this.consList) {
			if (this.consList[ci].consName != "consTotal") {
				this.consList[ci].calcAdjust(this.energyAdj);
			}
		}
	} else {
		//no total value
		for (j in this.Unit.co2) {
			this.energyAdj[j] = 1;
		}
		for (j in this.Unit.co2) {
			if (j == "electricity") {
				if (this.consShow["TO"][j]*0.9 > energySum[j]) {
					this.energyAdj[j] = (this.consShow["TO"][j]*0.9)/energySum[j];
					for (ci in this.consList) {
						if (this.consList[ci].consName != "consTotal") {
							this.consList[ci].calcAdjust(this.energyAdj);
						}
					}				
				} else if( this.consShow["TO"][j] < energySum[j]) {
					this.consShow["TO"][j] = energySum[j];
				}
			} else {
				this.consShow["TO"][j] = energySum[j];
			}
		}
	}
	this.consShow["TO"].calcCO2(); //consTotalのCO2計算しなおし
};

/* getTargetConsList(consName)  getter consumption object ------------------
 *
 * parameters
 *		consName	consumption name
 * retrun
 *		consumption object / object array
 */
const getTargetConsList = function (consName) {
	let i, c = 0;
	let target = [];
	var ret;

	if (consName != "") {
		for (i = 0; i < this.consList.length; i++) {
			if (this.consList[i].consName == consName) {
				target[c++] = this.consList[i];
			}
		}
		if (target.length == 1) {
			//in case of single
			ret = target[0];
		} else {
			//in case of array
			ret = target;
		}
	}
	return ret;
};


export {calcCons, calcConsAdjust, getTargetConsList};