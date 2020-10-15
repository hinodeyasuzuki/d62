/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * diagnosis.js
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

//resolve D6
var D6 = D6 || {};

/* calcCons() -------------------------------------------------------
 *		calculate consumption in consumption instance
 */

D6.calcCons = function () {
	var i, j;

	//area parameters set
	D6.area.setCalcBaseParams();

	//pre calculation such as common parameters setting
	//priority 1-3 / none
	for (j = 1; j <= 4; j++) {
		for (i = 0; i < D6.consList.length; i++) {
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
		for (i = 0; i < D6.consList.length; i++) {
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
	this.calcConsAdjust();

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
D6.calcConsAdjust = function () {
	var ci, i, j;
	var consNum;
	var consSum;
	var energySum = Object.create(Energy);
	D6.energyAdj = Object.create(Energy); //adjust parameters by energy
	var singleArray = true;
	var lastname = "";

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

				if (D6.fg_calccons_not_calcConsAdjust || consSum.residueCalc == "no") {
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
			for (j in D6.Unit.co2) {
				energySum[j] += this.consShow[ci][j];
			}
		}
	}

	//parameters existence of extinct total data
	var nodataTotal =
		this.consShow["TO"].noConsData ||
		D6.fg_calccons_not_calcConsAdjust || //setting
		D6.averageMode; //toggle at calcAverage

	//residue is more than 10% of electricity
	energySum.electricity += this.consShow["TO"].electricity * 0.1;

	//execute adjust
	if (!nodataTotal) {
		//in case of exist in total consumption
		for (j in D6.Unit.co2) {
			if (energySum[j] == 0) {
				this.energyAdj[j] = 1; //any number
			} else {
				this.energyAdj[j] = this.consShow["TO"][j] / energySum[j];
				if (
					typeof this.consShow["TO"].noPriceData[j] !== "undefined" &&
					this.consShow["TO"].noPriceData[j]
				) {
					if (!D6.averageMode) {
						//価格データがない場合totalは補正しない
						//本来ならあまりに大幅な補正が必要なときにはtotalの数値を変更するが、ここでは平均値も算出するために補正が不要
						if (this.energyAdj[j] < 0.25) {
							this.consShow["TO"][j] *= 0.25 / this.energyAdj[j];
							this.energyAdj[j] = 0.25;
						}
						if (this.energyAdj[j] > 4 && j != "electricity") {
							this.consShow["TO"][j] *= 4 / this.energyAdj[j];
							this.energyAdj[j] = 4;
						}
					}
				}
				if (j == "electricity") {
					// adjust is less than triple and more than 0.2 times
					this.energyAdj[j] = Math.max(0.2, Math.min(5, this.energyAdj[j]));
				} else if (j == "water") {
					this.consShow["TO"][j] = energySum[j];
					this.energyAdj[j] = 1;
				} else {
					// adjust electricity not to be minus but residue is OK
					this.energyAdj[j] = Math.max(0.2, Math.min(2.5, this.energyAdj[j]));
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
		for (j in D6.Unit.co2) {
			if (j == "electricity") {
				if (this.consShow["TO"][j] < energySum[j]) {
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
D6.getTargetConsList = function (consName) {
	var i,
		c = 0;
	var target = new Array();
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

/* getGid(consName)  getter group id of consumption ------------------
 *
 * parameters
 *		consName	consumption name
 * retrun
 *		groupID		0-9
 */
D6.getGid = function (consName) {
	return D6.logicList[consName].groupID;
};
