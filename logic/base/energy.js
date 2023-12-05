/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * Energy.js 
 * 
 * Energy calculate base Class
 * 	type: 				electricity, gas, kerosene, galsoline et.al.
 * 	results:			co2, cost , jules
 * 	calculation:	clear, add, sub, multiply, calcCO2, calcCost
 * 
 *   base of consbase, measurebase
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/08/23 original ActionScript3
 * 								2016/04/12 ported to JavaScript
 */


class Energy {
	//value of each energy type
	constructor(){
		this.electricity = 0;
		this.nightelectricity = 0;
		this.sellelectricity = 0;
		this.nagas = 0;
		this.lpgas = 0;
		this.kerosene = 0;
		this.gasoline = 0;
		this.lightoil = 0;
		this.heavyoil = 0;
		this.coal = 0;
		this.biomass = 0;
		this.hotwater = 0;
		this.waste = 0;
		this.water = 0;
		this.gas = 0;
		this.car = 0;

		//calculated values
		this.co2 = 0;
		this.jules = 0;
		this.cost = 0;
	}

	//clear() --------------------------------------------
	//		clear values
	clear() {
		for (var i in D6.Unit.co2) {
			this[i] = 0;
		}
		this.co2 = 0;
		this.jules = 0;
		this.cost = 0;

		//for consbase objects
		if (typeof (this.subID) !== undefined && this.subID != 0) {
			if (D6.viewparam.countfix_pre_after == 1) {
				this.mesTitlePrefix = this.countCall + this.subID;
			} else {
				this.mesTitlePrefix = this.subID + this.countCall;
			}
		}
	}

	//calcCO2() ------------------------------------------
	//		calculate total co2
	calcCO2() {
		this.co2 = 0;
		for (var i in D6.Unit.co2) {
			this.co2 += this[i] * D6.Unit.co2[i];
		}
	}

	//calcJules() ----------------------------------------
	//		calculate total energy
	calcJules() {
		this.jules = 0;
		for (var i in D6.Unit.co2) {
			this.jules += this[i] * D6.Unit.jules[i];
		}
	}

	calcHeat(apf) {
		var kcal = 0;
		for (var i in D6.Unit.co2) {
			if (i == "electricity") {
				kcal += this[i] * D6.Unit.calorie[i] / apf;
			} else {
				kcal += this[i] * D6.Unit.calorie[i];
			}
		}
		return kcal;
	}

	//calcCost() ----------------------------------------
	//		calculate total cost
	calcCost() {
		this.cost = 0;
		for (var i in D6.Unit.co2) {
			this.cost += this[i] * D6.Unit.price[i];
		}
	}

	//multiply( rate) -------------------------------------
	//		multiply rate to each energy
	multiply(rate) {
		for (var i in D6.Unit.co2) {
			this[i] *= rate;
		}
		this.co2 *= rate;
		this.jules *= rate;
		this.cost *= rate;
	}

	//multiplyArray( marray) -------------------------------------
	//		multiply as array to each energy
	multiplyArray(marray) {
		for (var i in D6.Unit.co2) {
			this[i] *= marray[i];
		}
		this.calcCO2();
		this.calcJules();
		this.calcCost();
	}


	//copy( source ) --------------------------------------------
	//		copy souce data to this instance
	copy(source) {
		for (var i in D6.Unit.co2) {
			this[i] = source[i];
		}
		this.co2 = source.co2;
		this.jules = source.jules;
		this.cost = source.cost;
		//this.endEnergy = ( source.endEnergy ? source.endEnergy : 0 );
		// 190327 calc by energy consumption in each consumption class 
	}

	//sub( target ) ---------------------------------------------
	//		calculate this minus target
	sub(target) {
		for (var i in D6.Unit.co2) {
			this[i] -= target[i];
		}
		this.co2 -= target.co2;
		this.jules -= target.jules;
		this.cost -= target.cost;
		//this.endEnergy -= ( target.endEnergy ? target.endEnergy : 0 );
	}

	//add( target ) ---------------------------------------------
	//		add target cons to this cons
	add(target) {
		for (var i in D6.Unit.co2) {
			this[i] += target[i];
		}
		this.co2 += target.co2;
		this.jules += target.jules;
		this.cost += target.cost;
		//this.endEnergy += ( target.endEnergy ? target.endEnergy : 0 );
	}

	//isSame(target) -------------------------------------------
	//		compare to target
	// return
	//		true : same, false : different
	isSame(target) {
		var same = true;
		for (var i in D6.Unit.co2) {
			if (this[i] != target[i]) {
				same = false;
				break;
			}
		}
		return same;
	}

}


export default class {Energy}
