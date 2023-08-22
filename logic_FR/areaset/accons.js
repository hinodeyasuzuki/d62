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
 
D6.patch( D6.accons, {
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
//

factorPrefTimeMonth : [
  
[ [ 1.06, 1.03, 1, 0.95, 0.89, 0.73, 0.61, 0.17, 0.14, 0.1, 0.07, 0.05],   //akita
  [ 0.92, 0.89, 0.85, 0.79, 0.71, 0.58, 0.51, 0.41, 0.37, 0.29, 0.22, 0.18], 
  [ 0.98, 0.94, 0.91, 0.85, 0.78, 0.64, 0.54, 0.28, 0.25, 0.18, 0.14, 0.1], 
  [ 1.05, 1.01, 0.98, 0.94, 0.88, 0.73, 0.61, 0.11, 0.09, 0.06, 0.04, 0.03] ], 
[ [ 1.06, 1.03, 1, 0.95, 0.89, 0.73, 0.61, 0.17, 0.14, 0.1, 0.07, 0.05],   //akita
  [ 0.92, 0.89, 0.85, 0.79, 0.71, 0.58, 0.51, 0.41, 0.37, 0.29, 0.22, 0.18], 
  [ 0.98, 0.94, 0.91, 0.85, 0.78, 0.64, 0.54, 0.28, 0.25, 0.18, 0.14, 0.1], 
  [ 1.05, 1.01, 0.98, 0.94, 0.88, 0.73, 0.61, 0.11, 0.09, 0.06, 0.04, 0.03] ], 
[ [ 0.84, 0.83, 0.79, 0.74, 0.68, 0.56, 0.48, 0.29, 0.25, 0.19, 0.14, 0.11],   //niigata
  [ 0.72, 0.67, 0.63, 0.58, 0.52, 0.43, 0.4, 0.6, 0.53, 0.43, 0.34, 0.27], 
  [ 0.77, 0.72, 0.68, 0.63, 0.58, 0.47, 0.42, 0.4, 0.35, 0.27, 0.21, 0.16], 
  [ 0.83, 0.81, 0.77, 0.73, 0.67, 0.56, 0.47, 0.22, 0.19, 0.14, 0.1, 0.08] ], 
[ [ 0.54, 0.51, 0.46, 0.42, 0.37, 0.33, 0.31, 0.36, 0.34, 0.31, 0.28, 0.22],   //kagosima
  [ 0.31, 0.28, 0.23, 0.2, 0.18, 0.19, 0.19, 0.69, 0.66, 0.61, 0.56, 0.48], 
  [ 0.36, 0.33, 0.29, 0.26, 0.22, 0.21, 0.21, 0.53, 0.51, 0.48, 0.44, 0.37], 
  [ 0.52, 0.48, 0.43, 0.39, 0.35, 0.31, 0.29, 0.33, 0.32, 0.29, 0.26, 0.21] ] 
]
});

 