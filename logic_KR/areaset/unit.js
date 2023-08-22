/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 4 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * unit.js
 *
 * any kind of unit related to energy type is defined here, change here
 *
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2018/05/07 for korea
 */

//fix D6.Unit

// unit price   won(in Korea)/each unit
D6.Unit.price = {
	electricity: 100, // override in D6.area.setPersonArea by supplyer
	nightelectricity: 100,
	sellelectricity: 150,
	nagas: 1000,
	lpgas: 3000,
	kerosene: 700,
	gasoline: 800,
	lightoil: 700,
	heavyoil: 600,
	coal: 300,
	biomass: 0,
	hotwater: 3.6,
	waste: 0,
	water: 0,
	gas: 1000,
	car: 800
};

D6.Unit.defaultPriceElectricity = D6.Unit.price.electricity;

// intercept price when consumption is zero
D6.Unit.priceBase = {
	electricity: 0,
	nightelectricity: 0,
	sellelectricity: 0,
	nagas: 0,
	lpgas: 0,
	kerosene: 0,
	gasoline: 0,
	lightoil: 0,
	heavyoil: 0,
	coal: 0,
	biomass: 0,
	hotwater: 5000,
	waste: 0,
	water: 0,
	gas: 0,
	car: 0
};

// names ( dataset is now witten in Japanse )
D6.Unit.name = {
	electricity: "전기",
	nightelectricity: "전기",
	sellelectricity: "売電",
	nagas: "도시가스",
	lpgas: "LP 가스",
	kerosene: "등유",
	gasoline: "가솔린",
	lightoil: "경유",
	heavyoil: "중유",
	coal: "연탄",
	biomass: 0,
	hotwater: "지역 열",
	waste: 0,
	water: 0,
	gas: "가스",
	car: "가솔린"
};

// unit discription text
D6.Unit.unitChar = {
	electricity: "kWh",
	nightelectricity: "kWh",
	sellelectricity: "kWh",
	nagas: "m3",
	lpgas: "m3",
	kerosene: "L",
	gasoline: "L",
	lightoil: "L",
	heavyoil: "L",
	coal: "kg",
	biomass: 0,
	hotwater: "MJ",
	waste: 0,
	water: 0,
	gas: "m3",
	car: "L"
};

// second energy(end-use)  kcal/each unit
D6.Unit.calorie = {
	electricity: 860,
	nightelectricity: 860,
	sellelectricity: 860,
	nagas: 11000,
	lpgas: 36000,
	kerosene: 8759,
	gasoline: 8258,
	lightoil: 9117,
	heavyoil: 9000,
	coal: 8000,
	biomass: 0,
	hotwater: 225,
	waste: 0,
	water: 0,
	gas: 11000,
	car: 8258
};

// primary energy  MJ/each unit
D6.Unit.jules = {
	electricity: 9.6,
	nightelectricity: 9.6,
	sellelectricity: 9.6,
	nagas: 46,
	lpgas: 60,
	kerosene: 38,
	gasoline: 38,
	lightoil: 38,
	heavyoil: 38,
	coal: 32,
	biomass: 0,
	hotwater: 1,
	waste: 0,
	water: 0,
	gas: 45,
	car: 38
};

// costToCons( cost, energy_name, elecType, kw ) -----------------------------
//		estimate consumption from cost, per month
// parameters
//		cost: energy fee/cost per month
//		energy_name: energy code
//		elecType: type of electricity supply
//			1:従量電灯A, 2:従量電灯B、3:時間帯別、4:低圧、5:低圧総合、6:高圧 in Japan
//		kw:	contract demand
// return
//		cons: energy consumption per month
D6.Unit.costToCons = function(cost, energy_name, elecType, kw) {
	var ret;
	if (cost == -1 || cost == "") {
		ret = "";
	}
	if (energy_name != "electricity" || typeof D6.area.elecPrice == undefined) {
		// not electricity or no regional parameters
		if (cost < D6.Unit.priceBase[energy_name] * 2) {
			// estimation in case of nealy intercept price
			ret = cost / D6.Unit.price[energy_name] / 2;
		} else {
			// ordinal estimation
			ret =
				(cost - D6.Unit.priceBase[energy_name]) / D6.Unit.price[energy_name];
		}
	} else {
		//regional electricity
		if (elecType < 0 || !elecType) {
			if (D6.consShow["TO"].allDenka) {
				elecType = 3;
			} else {
				elecType = 1;
			}
		}
		var def = D6.area.elecPrice[elecType];
		ret = (cost - kw * def[4] - def[3]) / ((def[1] + def[2]) / 2);
	}
	return ret;
};

//consToCost( cons, energy_name, elecType, kw ) -----------------------
//		estimate cost from energy consumption
// parameters
//		cons: energy consumption per month
//		energy_name: energy code
//		elecType: type of electricity supply
//			1:従量電灯A, 2:従量電灯B、3:時間帯別、4:低圧、5:低圧総合、6:高圧 in Japan
//		kw:	contract demand
// return
//		cost: energy fee/cost per month, not include intercept price
D6.Unit.consToCost = function(cons, energy_name, elecType, kw) {
	var ret;

	if (cons == -1 || cons == "") {
		ret = "";
	}
	//		if ( energy_name != "electricity" || typeof(D6.area.elecPrice) == undefined  ) {
	// this is rough method, multify only unit price
	// it will better to fix regionally
	ret = cons * D6.Unit.price[energy_name];
	/*
		} else {
			// electricity
			if ( elecType < 0 || !elecType ) {
				if ( D6.consShow["TO"].allDenka ) {
					elecType = 3;
				} else {
					elecType = 1;
				}
			}
			var def = D6.area.elecPrice[elecType];
			ret  = kw * def[4] + cons * ( def[1] + def[2] ) / 2;
			if( ret > def[3] * 2 ) {
				ret -= def[3];
			} else {
				ret /= 2;
			}
		}
*/
	return ret;
};

// consToEnergy( cons, energy_name ) --------------------------------
//		calculate energy from energy consumption
// parameters
//		cons: energy consumption per month
//		energy_name: energy code
// return
//		ret: energy MJ per month
consToEnergy = function(cons, energy_name) {
	var ret;

	if (cons == -1 || cons == "") {
		ret = "";
	}
	//static function
	ret = (cons * D6.Unit.jules[energy_name]) / 1000000;

	return ret;
};
