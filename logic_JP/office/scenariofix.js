/* 2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * scenariofix.js
 *
 * fix area function and data between home and office
 * fix scenario.js
 * fix logic definition
 *
 * Lisence: MIT
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/16 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 *
 *
 */

// D6.scenario.areafix
// called by diagnosis.js  just after create scenario
D6.scenario.areafix = function() {
	D6.Unit.name = {
		electricity: "電気",
		nightelectricity: "夜間電気",
		sellelectricity: "売電",
		nagas: "都市ガス",
		lpgas: "LPガス",
		kerosene: "灯油",
		gasoline: "ガソリン",
		lightoil: "軽油",
		heavyoil: "重油",
		coal: 0,
		biomass: 0,
		hotwater: 0,
		waste: 0,
		water: 0,
		gas: "都市ガス",
		car: "ガソリン"
	};
};
