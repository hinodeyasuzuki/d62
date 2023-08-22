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
 
D6.patch( D6.acload, {
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

factorPrefTimeMonth: [
  
[ [ 0.87, 0.85, 0.83, 0.8, 0.77, 0.77, 0.66, 0.24, 0.24, 0.14, 0.1, 0.08],   //akita
  [ 0.79, 0.77, 0.74, 0.71, 0.66, 0.55, 0.49, 0.52, 0.48, 0.38, 0.3, 0.24], 
  [ 0.82, 0.8, 0.78, 0.74, 0.7, 0.6, 0.51, 0.38, 0.34, 0.25, 0.19, 0.14], 
  [ 0.86, 0.84, 0.82, 0.8, 0.76, 0.66, 0.56, 0.16, 0.13, 0.09, 0.06, 0.05] ], 
[ [ 0.87, 0.85, 0.83, 0.8, 0.77, 0.77, 0.66, 0.24, 0.24, 0.14, 0.1, 0.08],   //akita
  [ 0.79, 0.77, 0.74, 0.71, 0.66, 0.55, 0.49, 0.52, 0.48, 0.38, 0.3, 0.24], 
  [ 0.82, 0.8, 0.78, 0.74, 0.7, 0.6, 0.51, 0.38, 0.34, 0.25, 0.19, 0.14], 
  [ 0.86, 0.84, 0.82, 0.8, 0.76, 0.66, 0.56, 0.16, 0.13, 0.09, 0.06, 0.05] ], 

[ [ 0.75, 0.74, 0.72, 0.69, 0.65, 0.65, 0.55, 0.4, 0.4, 0.26, 0.2, 0.15],   //niigata
  [ 0.68, 0.64, 0.61, 0.58, 0.53, 0.45, 0.41, 0.72, 0.65, 0.54, 0.43, 0.35], 
  [ 0.71, 0.68, 0.65, 0.62, 0.58, 0.48, 0.43, 0.53, 0.47, 0.37, 0.28, 0.22], 
  [ 0.74, 0.73, 0.71, 0.68, 0.64, 0.55, 0.47, 0.31, 0.27, 0.19, 0.14, 0.11] ], 
[ [ 0.55, 0.53, 0.49, 0.45, 0.41, 0.41, 0.36, 0.51, 0.51, 0.43, 0.39, 0.32],   //kagoshima
  [ 0.35, 0.32, 0.27, 0.23, 0.2, 0.21, 0.21, 0.82, 0.79, 0.75, 0.7, 0.61], 
  [ 0.41, 0.38, 0.33, 0.29, 0.25, 0.24, 0.24, 0.69, 0.67, 0.64, 0.59, 0.5], 
  [ 0.53, 0.51, 0.46, 0.43, 0.38, 0.34, 0.32, 0.48, 0.46, 0.42, 0.37, 0.3] ]]


} );
