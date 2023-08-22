/* 2017/12/16  version 1.0
 * coding: utf-8, Tab as 4 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * area.js  for override
 * 
 * AreaParameters area: parameters by prefecture for home
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

D6.patch( D6.area, {

	//name of prefecture
	//	prefName[prefecture]
	//
	prefName : [ 
		'Paris',
		"Paris",	//1 - 5	akita
		"Lyon",		//2 -15	niigata
		"Marseille",//3	-46	kagoshima
	],

	prefDefault : 1,	//not selected


	// heat category with prefecture
	//	prefHeatingLevel[prefecture]
	//
	//	return code
	//		1:cold area in Japan(Hokkaido)
	//			.
	//			.
	//		6:hot area in Japan(Okinawa)
	//
	prefHeatingLevel : [ 2, 2, 3, 5],

								
	// CO2 emittion factor
	//	co2ElectCompanyUnit[elec_company]
	//
	//	elec_company
	//		1:hokkaido electric power company.
	//			.
	//			.
	//		9:okinawa electric power company.
	//
	co2ElectCompanyUnit : [ 0.55, 0.55, 0.55, 0.55, 0.55, 0.55
										, 0.55, 0.55, 0.55, 0.55, 0.55 ],

	//	electricity company code by prefecture
	//
	//	prefToEleArea[prefecture]
	//
	// 0:hokkaido、1:tohoku 2:tokyo 3:chubu 4:hokuritu 5:kansai
	// 6:tyugoku 7:shikoku 8:kyusyu 9:okinawa
	prefToEleArea : [ 5,
				0, 1, 1, 1, 1, 1, 1,
				2, 2, 2, 2, 2, 2, 2,
				1, 4, 4, 4, 2, 3, 3, 3, 3,
				3, 5, 5, 5, 5, 5, 5,
				6, 6, 6, 6, 6, 7, 7, 7, 7,
				8, 8, 8, 8, 8, 8, 8, 9 ],

	//electricity supply company price ratio
	electCompanyPrice : [
		1.2,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1.2
	],

	//	electricity charge unit table
	//
	//	elecPrice[electicity_type][calc_type]
	//
	//	electicity_type
	//		1:depend on consumption type A
	//		2:depend on consumption type B
	//		3:demand pricing 
	//		4:low voltage 
	//		5:integrated low voltage 
	//		6:high voltage 
	//	calc_type
	//		1:peak time unit
	//		2:average unit
	//		3:price down unit
	//		4:cut off
	//		5:base charge to contract kW
	//
	//	
	elecPrice : {
		1: [ 33.32, 33.32, 33.32, -1500, 0 ],
		2: [ 33.32, 33.32, 33.32, -1500, 280 ],
		3: [ 38.89, 27.32, 13.10, 2160, 0 ],
		4: [ 17.98, 16.53, 16.53, 0, 1054 ],
		5: [ 20.22, 18.56, 18.56, 64800, 0 ],
		6: [ 22.58, 17.36, 13.08, 0, 1733 ]
	},


	// meteorological annal average templature C
	//
	//		prefTemplature( prefecture )
	//
	//
	// in Unit.setArea() copy this to averageTemplature
	//
	prefTemplature : [

	12.4	,	//akita
	12.4	,	//akita
	14.4	,	//niigata
	19.3	,	//kagoshima
	],

	// solar factor
	//
	//		prefPVElectricity( prefecture )
	//
	prefPVElectricity : [

	3.54	,	//akita
	3.54	,	//akita
	3.54	,	//niigata
	4.01	,	//kagoshima
	],

	// heat load factore table
	//
	airconFactor_mon :
			  [ [ 0.66, 0.62, 0.59, 0.55, 0.50, 0.41, 0.37, 0.39, 0.36, 0.31, 0.26, 0.20 ],
   				[ 0.43, 0.39, 0.37, 0.34, 0.30, 0.27, 0.26, 0.79, 0.75, 0.67, 0.59, 0.49 ],
     			[ 0.47, 0.45, 0.42, 0.39, 0.35, 0.30, 0.29, 0.57, 0.55, 0.49, 0.43, 0.35 ],
     			[ 0.62, 0.58, 0.55, 0.51, 0.47, 0.39, 0.35, 0.34, 0.32, 0.27, 0.23, 0.18 ] ],
	heatFactor_mon:
			  [ [ 0.64, 0.61, 0.60, 0.57, 0.53, 0.53, 0.44, 0.54, 0.54, 0.43, 0.36, 0.28 ],
     			[ 0.48, 0.45, 0.42, 0.39, 0.34, 0.30, 0.30, 0.88, 0.85, 0.78, 0.70, 0.59 ],
     			[ 0.52, 0.49, 0.47, 0.43, 0.39, 0.33, 0.32, 0.72, 0.70, 0.64, 0.56, 0.46 ],
     			[ 0.62, 0.59, 0.57, 0.54, 0.50, 0.42, 0.38, 0.48, 0.45, 0.39, 0.32, 0.25 ] ],
	// addac factor copy from D6.addac
	plusHeatFactor_mon:  
			  [ [ 0, 0, 0, 0, 0, 0, 0 ],
     			[ 0, 0, 0, 0, 0, 0, 0 ],
     			[ 0, 0, 0, 0, 0, 0, 0 ],
     			[ 0, 0, 0, 0, 0, 0, 0 ] ],


	// home original function/data set ==================================

	// average energy fee per month
	//		prefKakeiEnergy[prefecture][energy_type]
	//
	//		prefecture(0-47 in Japan)
	//		energy_type
	//			0:electicity
	//			1:gas
	//			2:kerosene
	//			3:gasoline
	//
	prefKakeiEnergy : [ 
		[ 81.34, 48.16, 42.84, 55.73],  //akita 0
		[ 81.34, 48.16, 42.84, 55.73],  //akita 5
		[ 86.85, 66.83, 13.70, 51.20],  //niigata 15
		[ 77.90, 60.01, 4.69, 54.01],  //kagosima		46
	],
	

	// seasonal energy fee factor to average
	//
	//	prefSeasonFactorArray[prefecture][season][energy_type]
	//
	//	prefecture:
	//	season:
	//		0:wihter
	//		1:spring
	//		2:summer
	//	energy_type
	//		0:electicity
	//		1:gas
	//		2:kerosene
	//		3:gasoline
	//
	prefSeasonFactorArray : [

	[ [ 1.1375, 1.1571, 1.962, 1.0131 ], [ 0.9253, 0.9971, 0.7264, 0.9946 ], [ 0.9411, 0.7954, 0.1733, 0.9915 ] ],   //akita
	[ [ 1.1375, 1.1571, 1.962, 1.0131 ], [ 0.9253, 0.9971, 0.7264, 0.9946 ], [ 0.9411, 0.7954, 0.1733, 0.9915 ] ],   //akita
	[ [ 1.1343, 1.3681, 2.2726, 0.9586 ], [ 0.893, 0.9273, 0.5639, 0.9968 ], [ 0.9993, 0.6303, 0.0302, 1.0607 ] ],   //niigata
	[ [ 1.0288, 1.2375, 2.4612, 0.9435 ], [ 0.8727, 0.966, 0.3749, 0.9441 ], [ 1.1738, 0.7401, 0.0937, 1.1685 ] ],   //kagoshima

	]

});



