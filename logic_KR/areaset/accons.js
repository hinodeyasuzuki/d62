/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 4 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * accons.js  for override
 *
 * AreaParameters  accons: electricity consumption rate of air conditioner used as heater
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

D6.patch(D6.accons, {
	// getArray(param)  return paramArray
	//		param: prefecture(original)
	//
	//  return accons[time_slot_index][heat_month_index]
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

	factorPrefTimeMonth: [
		[
			[1.24, 1.22, 1.21, 1.18, 1.13, 0.94, 0.77, 0.06, 0.05, 0.03, 0.02, 0.02], //sapporo
			[1.14, 1.13, 1.1, 1.05, 0.98, 0.8, 0.67, 0.2, 0.17, 0.13, 0.1, 0.08],
			[1.2, 1.19, 1.16, 1.13, 1.06, 0.88, 0.72, 0.1, 0.08, 0.05, 0.04, 0.03],
			[1.24, 1.22, 1.21, 1.18, 1.13, 0.95, 0.79, 0.03, 0.02, 0.01, 0.01, 0.01]
		],

		[
			[1.24, 1.22, 1.21, 1.18, 1.13, 0.94, 0.77, 0.06, 0.05, 0.03, 0.02, 0.02], //sapporo
			[1.14, 1.13, 1.1, 1.05, 0.98, 0.8, 0.67, 0.2, 0.17, 0.13, 0.1, 0.08],
			[1.2, 1.19, 1.16, 1.13, 1.06, 0.88, 0.72, 0.1, 0.08, 0.05, 0.04, 0.03],
			[1.24, 1.22, 1.21, 1.18, 1.13, 0.95, 0.79, 0.03, 0.02, 0.01, 0.01, 0.01]
		],

		[
			[0.64, 0.63, 0.6, 0.55, 0.5, 0.41, 0.37, 0.31, 0.28, 0.25, 0.21, 0.16], //tokyo
			[0.39, 0.37, 0.35, 0.32, 0.29, 0.26, 0.25, 0.62, 0.57, 0.52, 0.45, 0.37],
			[0.42, 0.4, 0.39, 0.36, 0.33, 0.28, 0.26, 0.43, 0.4, 0.37, 0.32, 0.26],
			[0.58, 0.56, 0.54, 0.5, 0.46, 0.38, 0.34, 0.25, 0.23, 0.21, 0.17, 0.13]
		]
	]
});
