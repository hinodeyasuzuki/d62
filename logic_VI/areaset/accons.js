/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
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
var D6 = D6 || {};

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
	//アメダス10分間データを元に算出:エアコン消費電力量
	//
	//	配列は　  [朝、昼、夕、夜]の係数で、
	//	それぞれ　[暖房半月、暖房1ヶ月、暖房2ヶ月、暖房3ヶ月、暖房4ヶ月、暖房6ヶ月、暖房8ヶ月、
	//				冷房半月、冷房1ヶ月、冷房2ヶ月、冷房3ヶ月、冷房4ヶ月]
	//	の規定温度における消費量に対する割合を示す。
	//
	// Unit.setArea()で　該当する地域について　airconFactor_mon　にコピーをして利用
	//

	factorPrefTimeMonth: [
		[
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.39, 0.38, 0.38, 0.36, 0.33], //那覇
			[0.08, 0.03, 0.02, 0.02, 0.02, 0.06, 0.06, 0.61, 0.59, 0.58, 0.56, 0.51],
			[0.09, 0.05, 0.03, 0.03, 0.02, 0.06, 0.06, 0.46, 0.45, 0.44, 0.43, 0.39],
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.35, 0.35, 0.34, 0.33, 0.3]
		],
		[
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.39, 0.38, 0.38, 0.36, 0.33], //那覇
			[0.08, 0.03, 0.02, 0.02, 0.02, 0.06, 0.06, 0.61, 0.59, 0.58, 0.56, 0.51],
			[0.09, 0.05, 0.03, 0.03, 0.02, 0.06, 0.06, 0.46, 0.45, 0.44, 0.43, 0.39],
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.35, 0.35, 0.34, 0.33, 0.3]
		],
		[
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.39, 0.38, 0.38, 0.36, 0.33], //那覇
			[0.08, 0.03, 0.02, 0.02, 0.02, 0.06, 0.06, 0.61, 0.59, 0.58, 0.56, 0.51],
			[0.09, 0.05, 0.03, 0.03, 0.02, 0.06, 0.06, 0.46, 0.45, 0.44, 0.43, 0.39],
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.35, 0.35, 0.34, 0.33, 0.3]
		],
		[
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.39, 0.38, 0.38, 0.36, 0.33], //那覇
			[0.08, 0.03, 0.02, 0.02, 0.02, 0.06, 0.06, 0.61, 0.59, 0.58, 0.56, 0.51],
			[0.09, 0.05, 0.03, 0.03, 0.02, 0.06, 0.06, 0.46, 0.45, 0.44, 0.43, 0.39],
			[0.11, 0.07, 0.06, 0.05, 0.04, 0.08, 0.08, 0.35, 0.35, 0.34, 0.33, 0.3]
		]
	]
});
