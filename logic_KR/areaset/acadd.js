/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * acadd.js for override
 *
 * AreaParameters acadd: additional heat load cannot supply with  air conditioner
 *
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/16 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 */

D6.patch(D6.acadd, {
	// getArray(param)  return paramArray
	//		param: prefecture(original)
	//
	//  return acadd[time_slot_index][heat_month_index]
	//
	//		time_slot_index:
	//				0:morning
	//				1:noon
	//				2:evening
	//				3:night
	//		heat_month_index
	//				0:use heat for a half month
	//				1:use heat for one month
	//				2:use heat for 2 months
	//				3:use heat for 3 months
	//				4:use heat for 4 months
	//				5:use heat for 6 months
	//				6:use heat for 8 months
	//
	// this data is transformed by AMEDAS ( meteorological data ) in Japan
	//
	// factorPrefTimeMonth[Prefecture Code][Time Code][Month Code]
	//
	// used in Unit.setArea() function and set Unit.plusHeatFactor_mon
	//
	factorPrefTimeMonth: [
		[
			[0.17, 0.16, 0.14, 0.12, 0.09, 0.06, 0.05], //hokkaido
			[0.06, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01],
			[0.09, 0.09, 0.07, 0.06, 0.04, 0.03, 0.02],
			[0.16, 0.15, 0.13, 0.11, 0.09, 0.06, 0.04]
		],

		[
			[0.17, 0.16, 0.14, 0.12, 0.09, 0.06, 0.05], //hokkaido
			[0.06, 0.05, 0.04, 0.04, 0.03, 0.02, 0.01],
			[0.09, 0.09, 0.07, 0.06, 0.04, 0.03, 0.02],
			[0.16, 0.15, 0.13, 0.11, 0.09, 0.06, 0.04]
		],

		[
			[0, 0, 0, 0, 0, 0, 0], //tokyo
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]
		]
	]
});
