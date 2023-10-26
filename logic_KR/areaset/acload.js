/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 4 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * accons.js  for override
 *
 * AreaParameters  acload: heat load of house
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

D6.patch(D6.acload, {
	// getArray(param)  return paramArray
	//		param: prefecture(original)
	//
	//  return acloat[time_slot_index][heat_month_index]
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
	//

	factorPrefTimeMonth: [
		[
			[1.06, 1.05, 1.03, 1, 0.95, 0.95, 0.82, 0.09, 0.09, 0.05, 0.03, 0.02], //sapporo
			[0.93, 0.92, 0.9, 0.87, 0.83, 0.7, 0.59, 0.27, 0.23, 0.18, 0.14, 0.11],
			[0.99, 0.98, 0.96, 0.93, 0.88, 0.76, 0.64, 0.14, 0.11, 0.07, 0.05, 0.04],
			[1.05, 1.04, 1.02, 0.99, 0.95, 0.83, 0.7, 0.04, 0.03, 0.02, 0.01, 0.01]
		],

		[
			[1.06, 1.05, 1.03, 1, 0.95, 0.95, 0.82, 0.09, 0.09, 0.05, 0.03, 0.02], //sapporo
			[0.93, 0.92, 0.9, 0.87, 0.83, 0.7, 0.59, 0.27, 0.23, 0.18, 0.14, 0.11],
			[0.99, 0.98, 0.96, 0.93, 0.88, 0.76, 0.64, 0.14, 0.11, 0.07, 0.05, 0.04],
			[1.05, 1.04, 1.02, 0.99, 0.95, 0.83, 0.7, 0.04, 0.03, 0.02, 0.01, 0.01]
		],

		[
			[0.63, 0.62, 0.6, 0.57, 0.53, 0.53, 0.44, 0.43, 0.43, 0.35, 0.28, 0.23], //tokyo
			[0.44, 0.42, 0.4, 0.37, 0.34, 0.3, 0.29, 0.75, 0.7, 0.63, 0.56, 0.47],
			[0.48, 0.45, 0.44, 0.41, 0.37, 0.32, 0.3, 0.58, 0.54, 0.5, 0.43, 0.35],
			[0.6, 0.58, 0.56, 0.53, 0.5, 0.41, 0.37, 0.36, 0.33, 0.3, 0.24, 0.19]
		]
	]
});
