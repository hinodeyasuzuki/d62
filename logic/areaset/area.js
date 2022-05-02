/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * area.js 
 * 
 * AreaParameters area: parameters by prefecture for home
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 */

D6.area = {

	//name of prefecture
	//	prefName[prefecture]
	//
	prefName : [ 
		"hyogo",
		"hokkaido",	//1
	],

	prefDefault : 0,	//not selected


	// heat category with prefecture
	//	prefHeatingLevel[prefecture]
	//
	//	return code
	//		1:cold area in Japan(Hokkaido)
	//			.
	//			.
	//		6:hot area in Japan(Okinawa)
	//
	prefHeatingLevel : [ 4,
		1, 2, 2, 3, 2, 2, 3,
		3, 3, 3, 4, 4, 4, 4,
		3, 3, 3, 4, 4, 3, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4,
		4, 4, 4, 4, 4, 4, 4, 4, 5,
		4, 4, 4, 4, 4, 5, 5, 6 ],

								
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
		1.44,
		1.31,
		1.31,
		1.25,
		1.13,
		1.14,
		1.24,
		1.21,
		1.15,
		1.32
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

		17.4	,	//hyogo
		9.4	,	//hokkaido
	],

	// solar factor
	//
	//		prefPVElectricity( prefecture ) generation kWH/year per 3kW of solar panel
	//
	prefPVElectricity : [

		4.04	,	//hyogo
		3.95	,	//hokkaido
	],

	
	// convert energy name to energy_type id
	//
	//	energyCode2id[energy_name]	: get energy code
	//		
	//
	energyCode2id : {
		"electricity" : 0,
		"gas" : 1,
		"kerosene" : 2,
		"car" : 3 
	},

	//convert season name to season id.
	//
	//	seasonCode2id[season_name]	: get season code
	//
	seasonCode2id : {
		"winter" : 0,
		"spring" : 1,
		"summer" : 2
	},

	// months include to each season
	//	seasonMonth[seasonName]
	//	
	//	seasonName
	//		winter/spring/summer  , autumn include to spring
	//
	seasonMonth : { winter:4, spring:5, summer:3 },

	
	// heat load factore table get from acload/accons/acadd
	//
	// accons factor copy from D6.accons
	airconFactor_mon :
		[ [ 0.66, 0.62, 0.59, 0.55, 0.50, 0.41, 0.37, 0.39, 0.36, 0.31, 0.26, 0.20 ],
			[ 0.43, 0.39, 0.37, 0.34, 0.30, 0.27, 0.26, 0.79, 0.75, 0.67, 0.59, 0.49 ],
			[ 0.47, 0.45, 0.42, 0.39, 0.35, 0.30, 0.29, 0.57, 0.55, 0.49, 0.43, 0.35 ],
			[ 0.62, 0.58, 0.55, 0.51, 0.47, 0.39, 0.35, 0.34, 0.32, 0.27, 0.23, 0.18 ] ],
	// heat factor copy from D6.heatcons
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


	// get electric power company from prefecture
	getElectCompany : function( pref ) {
		return this.prefToEleArea[pref];
	},

	// get average templature from prefecture
	getTemplature : function( pref ) {
		return this.prefTemplature[pref];
	},

	// get average solar generation
	getPVElectricity : function( pref ) {
		return this.prefPVElectricity[pref];
	},

	// get heat category
	getHeatingLevel : function( pref ) {
		return this.prefHeatingLevel[pref];
	},

	// get electricity CO2 emission factor
	getCo2Unit : function( electCompany ) {
		return this.co2ElectCompanyUnit[electCompany];
	},

	// get avearge fee depend on person,prefecture,urban/ural
	// 	ret[energy_name]
	//
	//	energy_name: electricity,gas,kerosene,car
	//
	getAverageCostEnergy: function( num, pref, urban ) {
		var ret;
		ret = {};

		var id;
		for ( var i in this.energyCode2id) {
			id = this.energyCode2id[i];
			ret[i] = this.prefKakeiEnergy[pref][id] 
					* this.kakeiNumCoefficent[( num>6 ? 6 : num )-1][id]
					* this.urbanCostCoefficient[id][urban] / this.urbanCostCoefficient[id][0];
		}

		return ret;
	},


	// get average tap water templature
	getWaterTemplature: function()
	{
		var temp = Math.max( 5, Math.min( 23, 0.9137 * this.averageTemplature + 1.303 ) );
		return temp;
	},

	// get heat load 
	//
	//	getHeatFactor( month, hour )
	//		month:	heat month ( 0.5-12 )
	//		hour:	heat hour per day ( 0.5-24 )
	//
	//	return factor[code]
	//
	//	code:
	//		0: air conditioner heat factor
	//		1: heat factor
	//		2: additional heat factor
	//
	getHeatFactor : function( month, hour )
	{
		var mIndex;
		var sum = [ 0, 0, 0];
		var factor = [ 0, 0, 0];
		var count = 0;

		if ( month <= 0.7 ) {
			mIndex = 0;
		} else if ( month <= 1.5 ) {
			mIndex = 1;
		} else if ( month <= 2.5 ) {
			mIndex = 2;
		} else if ( month <= 3.5 ) {
			mIndex = 3;
		} else if ( month <= 5 ) {
			mIndex = 4;
		} else if ( month <= 7 ) {
			mIndex = 5;
		} else {
			mIndex = 6;
		}

		//estimate use timezone
		if ( hour >= 0 ) {
			//evening
			sum[0] += this.airconFactor_mon[2][mIndex];
			sum[1] += this.heatFactor_mon[2][mIndex];
			sum[2] += this.plusHeatFactor_mon[2][mIndex];
			count++;
		}
		if ( hour > 6 ) {
			//morning
			sum[0] += this.airconFactor_mon[0][mIndex];
			sum[1] += this.heatFactor_mon[0][mIndex];
			sum[2] += this.plusHeatFactor_mon[0][mIndex];
			count++;
		}
		if ( hour > 10 ) {
			//noon
			sum[0] += this.airconFactor_mon[1][mIndex];
			sum[1] += this.heatFactor_mon[1][mIndex];
			sum[2] += this.plusHeatFactor_mon[1][mIndex];
			count++;
		}
		if ( hour > 16 ) {
			//night
			sum[0] += this.airconFactor_mon[3][mIndex];
			sum[1] += this.heatFactor_mon[3][mIndex];
			sum[2] += this.plusHeatFactor_mon[3][mIndex];
			count++;
		}

		factor[0] = sum[0] / count;
		factor[1] = sum[1] / count;
		factor[2] = sum[2] / count;

		return factor;
	},

	// get cooling load 
	//
	//	getCoolFactor( month, hour )
	//		month:	heat month ( 0.5-12 )
	//		hour:	heat hour per day ( 0.5-24 )
	//
	//	return factor
	//
	getCoolFactor : function( month, hour )
	{
		var mIndex;
		var sum = [ 0, 0, 0];
		var factor = [ 0, 0, 0];
		var count = 0;

		if ( month <= 0.7 ) {
			mIndex = 7;
		} else if ( month <= 1.5 ) {
			mIndex = 8;
		} else if ( month <= 2.5 ) {
			mIndex = 9;
		} else if ( month <= 3.5 ) {
			mIndex = 10;
		} else {
			mIndex = 11;
		}

		//estimate timezone
		if ( hour >= 0 ) {
			//evening
			sum[0] += this.airconFactor_mon[2][mIndex];
			sum[1] += this.heatFactor_mon[2][mIndex];
			count++;
		}
		if ( hour > 6 ) {
			//noon
			sum[0] += this.airconFactor_mon[1][mIndex];
			sum[1] += this.heatFactor_mon[1][mIndex];
			count++;
		}
		if ( hour > 12 ) {
			//night
			sum[0] += this.airconFactor_mon[3][mIndex];
			sum[1] += this.heatFactor_mon[3][mIndex];
			count++;
		}
		if ( hour > 18 ) {
			//morning
			sum[0] += this.airconFactor_mon[0][mIndex];
			sum[1] += this.heatFactor_mon[0][mIndex];
			count++;
		}

		factor[0] = sum[0] / count;
		factor[1] = sum[1] / count;
		factor[2] = sum[2] / count;

		return factor;
	},



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
		[ 7959, 5661, 313, 2647],	//hyogo
		[ 7568, 5400, 3772, 3984],  //hokkaido
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
	//季節別負荷係数
	prefSeasonFactorArray : [

		[ [ 1.1084, 1.3537, 2.5436, 0.9465 ], [ 0.8664, 0.9165, 0.3546, 0.9764 ], [ 1.0782, 0.6675, 0.0175, 1.1107 ] ],   //hyogo
		[ [ 1.149, 1.1094, 1.8254, 0.9243 ], [ 0.9482, 0.9876, 0.8169, 1.0159 ], [ 0.8876, 0.8749, 0.2047, 1.0743 ] ],   //hokkaido

	],

	// get season month
	getSeasonFactor : function( area )
	{
		return this.prefSeasonFactorArray[area];
	},

	// get seasonal fee factor table
	//
	//	ret[energy_name][season]
	//
	//	energy_name: electricity, gas, kerosene
	//  season: 
	//		0:winter
	//		1:spring
	//		2:summer
	//
	getSeasonParam : function( pref ) {
		var param = this.getSeasonFactor(pref);
		
		var ret = Array();
		ret["electricity"] = [ param[0][0], param[1][0], param[2][0] ];
		ret["gas"] = [ param[0][1], param[1][1], param[2][1] ];
		ret["kerosene"] = [ param[0][2], param[1][2], param[2][2] ];

		return ret;
	},


	//	factor to average fee
	//		kakeiNumCoefficent[person_in_home][energy_type]
	//
	//		pserson_in_home
	//			0: single home
	//			1: 2 person in home
	//			2: 3 person in home
	//			3: 4 person in home
	//			4: 5 person in home
	//			5: more than 6 person in home
	//		energy_type
	//			0:electicity
	//			1:gas
	//			2:kerosene
	//			3:gasoline
	//
	kakeiNumCoefficent:
		[ [ 0.47, 0.52,  0.37, 0.45 ],
			[ 0.86, 0.83,  0.90, 0.79 ],
			[ 0.99, 1.00,  0.90, 0.98 ],
			[ 1.07, 1.10,  0.85, 1.16 ],
			[ 1.24, 1.17,  1.10, 1.26 ],
			[ 1.55, 1.19,  1.67, 1.33 ]],


	//	urban / ural area fee per month
	//		urbanCostCoefficient[energy_type][area_type]
	//
	//		energy_type
	//			0:electicity
	//			1:gas
	//			2:kerosene
	//			3:gasoline
	//		area_type
	//			0:urban
	//			1:ural
	//
	urbanCostCoefficient :
		[ [ 8762, 9618 ],
			[ 6100, 5133 ],
			[ 828,  1898 ],
			[ 3415, 6228 ]],

	// calc parameters depend on person and area 
	//
	//	setPersonArea( numPerson, areaId, urbanId  )
	//		numPerson: 	person in home
	//		areaId:		prefecture
	//		urbanId:	urban/ural
	//
	setPersonArea : function( numPerson, areaId, urbanId  )
	{
		if ( urbanId == 1 || urbanId == 2  ) {
			this.urban = 1;
		} else {
			this.urban = 0;
		}

		if ( areaId < 0 ) {
			areaId = this.prefDefault;
		}

		//set this.area(prefecture)
		this.area = Math.round(areaId ? areaId : 0);	

		//electricity supply company
		this.electCompany = this.getElectCompany(this.area);

		//electricity price unit by supplyer
		D6.Unit.price.electricity = D6.Unit.defaultPriceElectricity * this.electCompanyPrice[this.electCompany];

		//electricity CO2 emisstion unit by supplyer
		D6.Unit.co2.electricity = this.getCo2Unit( this.electCompany );
		D6.Unit.co2.nightelectricity = D6.Unit.co2.electricity;
		D6.Unit.co2.sellelectricity = D6.Unit.co2.electricity;
		
		
		//set air conditioner load
		this.airconFactor_mon = D6.accons.getArray( this.area );
		this.heatFactor_mon = D6.acload.getArray( this.area );
		this.plusHeatFactor_mon = D6.acadd.getArray( this.area );
		
		//templature
		this.averageTemplature = this.getTemplature( this.area );
		
		//solar generation rate kWh/kW
		this.unitPVElectricity = 1000 * this.getPVElectricity( this.area ) / 3.6;

		//heat area level
		this.heatingLevel = this.getHeatingLevel( this.area );

		//month of heating / cooling
		switch( this.heatingLevel ) {
		case 1:
			this.seasonMonth = { winter:8, spring:3, summer:1 };
			break;
		case 2:
			this.seasonMonth = { winter:6, spring:4, summer:2 };
			break;
		case 3:
			this.seasonMonth = { winter:5, spring:5, summer:2 };
			break;
		case 5:
			this.seasonMonth = { winter:3, spring:5, summer:4 };
			break;
		case 6:
			this.seasonMonth = { winter:2, spring:5, summer:5 };
			break;
		case 4:
		default:
			this.seasonMonth = { winter:4, spring:5, summer:3 };
			break;
		}
		
		//calculate average cost
		this.averageCostEnergy = this.getAverageCostEnergy( 
			( numPerson<=0 ? 3 : numPerson ) ,
			Math.floor(this.area), 
			this.urban );
		
		//calculate average CO2
		this.averageCO2Energy = {};
		for( var i in this.averageCostEnergy ) {
			this.averageCO2Energy[i] = 
						D6.Unit.costToCons( this.averageCostEnergy[i] , i )
						* D6.Unit.co2[i];
		}
	},
	
	// get seasonal average consumption
	//
	//	getAverageCons( energy_name)
	//
	//	ret[season_name]
	//		season_name: winter,spring,summer
	//
	//	case energy_name == electricity : kWh/one month
	//	case energy_name == gas : L/one month
	//	case energy_name == kerosene : L/one month
	//	case energy_name == car : L/one month
	//
	//
	getAverageCons : function( energy_name )
	{
		var ret = [0, 0, 0];
		var eid = this.energyCode2id(energy_name) ;

		//get average
		var avCost = this.averageCostEnergy[energy_name];
		var seasonArray = this.getSeasonFactor( this.area );

		// calc consumption by fee
		ret["winter"] = this.Unit.costToCons( avCost * seasonArray[0][eid], energy_name );
		ret["spring"] = this.Unit.costToCons( avCost * seasonArray[1][eid], energy_name );
		ret["summer"] = this.Unit.costToCons( avCost * seasonArray[2][eid], energy_name );

		return ret;
	},

	// get seasonal average fee
	//
	//	getAverageCostSeason( energy_name, season_name )
	//
	//
	getAverageCostSeason : function( energy_name, season_name )
	{
		var eid = this.energyCode2id(energy_name) ;
		var avCost = this.averageCostEnergy[energy_name];
		var seasonArray = this.getSeasonFactor( this.area );

		return avCost * seasonArray[this.seasonCode2id(season_name)][eid];
	}
	
};


