/**
 * Home-Eco Diagnosis for JavaScript
 * AreaParameters area: parameters by prefecture for home
 *
 * @author Yasufumi SUZUKI  2011/04/15 Diagnosis5
 *								2011/05/06 actionscript3
 * 								2016/04/12 js
 */
var D6 = D6 || {};

D6.patch(D6.area, {
	//name of prefecture/city
	//	prefName[prefectureid/cityid]
	//
	//都道府県名
	prefName: [
		"Hồ Chí Minh",
		"Hà Nội", //1
		"Đà Nẵng",
		"Hồ Chí Minh"
	],

	prefDefault: 2, //not selected

	// heat category with prefecture
	//	prefHeatingLevel[prefecture]
	//
	//	return code
	//		1:cold area in Japan(Hokkaido)
	//			.
	//			.
	//		6:hot area in Japan(Okinawa)
	//
	//
	prefHeatingLevel: [
		7, //18,10,33,25 "広州",				//7 那覇 20, 15, 32, 27
		7, //18,10,33,25 "広州",				//7 那覇 20, 15, 32, 27
		7, //18,10,33,25 "広州",				//7 那覇 20, 15, 32, 27
		7 //21,15,33,25 "海口"					//7
	],

	// CO2 emittion factor
	//	co2ElectCompanyUnit[elec_company]
	//
	//	elec_company
	//		1:hokkaido electric power company.
	//			.
	//			.
	//		9:okinawa electric power company.
	//
	co2ElectCompanyUnit: [
		0.55,
		0.55,
		0.55,
		0.55,
		0.55,
		0.55,
		0.55,
		0.55,
		0.55,
		0.55,
		0.55
	],

	//	electricity company code by prefecture
	//
	//	prefToEleArea[prefecture]
	//
	//都道府県の電力会社コード
	// 0:北海道、1:東北電力 2:東京電力 3:中部電力 4:北陸電力 5:関西電力
	// 6:中国電力 7:四国電力 8:九州電力 9:沖縄電力
	prefToEleArea: [
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		2,
		1,
		4,
		4,
		4,
		2,
		3,
		3,
		3,
		3,
		3,
		5,
		5,
		5,
		5,
		5,
		5,
		6,
		6,
		6,
		6,
		6,
		7,
		7,
		7,
		7,
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		9
	],

	//electricity supply company price ratio
	electCompanyPrice: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

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
	elecPrice: {
		// 1:従量電灯A, 2:従量電灯B、3:時間帯別、4:低圧、5:低圧総合、6:高圧
		// ピーク単価,標準単価,割引単価,切片,kW契約単価
		1: [33.32, 33.32, 33.32, -1500, 0],
		2: [33.32, 33.32, 33.32, -1500, 280],
		3: [38.89, 27.32, 13.1, 2160, 0],
		4: [17.98, 16.53, 16.53, 0, 1054],
		5: [20.22, 18.56, 18.56, 64800, 0],
		6: [22.58, 17.36, 13.08, 0, 1733]
	},

	//electricity supply company price
	elecCompanyPrice: {},

	// meteorological annal average templature C
	//
	//		prefTemplature( prefecture )
	//
	//
	//気象庁｢気象庁年報｣ 平成19年 各都道府県の平均気温
	//数値は各都道府県の県庁所在地の気象官署の観測値。
	//  （ただし、埼玉県は熊谷市、滋賀県は彦根市の気象官署の観測値)
	// Unit.setArea()で 該当する地域について averageTemplature にコピーをして利用
	//
	prefTemplature: [
		26, //18,10,33,25 "広州",
		26, //18,10,33,25 "広州",
		26, //18,10,33,25 "広州",
		30 //21,15,33,25 "海口"
	],

	// solar factor
	//
	//		prefPVElectricity( prefecture )
	//
	// ex. JWA monsola05
	//  annual solar energy input at most provable direction kWh/m2/day
	prefPVElectricity: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],

	// convert energy name to energy_type id
	//
	//	energyCode2id[energy_name]	: get energy code
	//
	energyCode2id: {
		electricity: 0,
		gas: 1,
		kerosene: 2,
		coal: 4,
		hotwater: 5,
		car: 3
	},

	//convert season name to season id.
	//
	//	seasonCode2id[season_name]	: get season code
	//
	seasonCode2id: {
		winter: 0,
		spring: 1,
		summer: 2
	},

	// months include to each season
	//	seasonMonth[seasonName]
	//
	//	seasonName
	//		winter/spring/summer  , autumn include to spring
	//
	seasonMonth: { winter: 2, spring: 4, summer: 6 },

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
	//地域別平均光熱費 2人以上世帯（補正後）
	// 中国の電力消費 2011年 413kWh/年・人 http://www.chinaero.com.cn/zxdt/djxx/ycwz/2014/05/146440.shtml
	// 413×1元/kWh×3人÷12
	// おおむね3000kWh/年世帯程度か？
	prefKakeiEnergy: [
		[250, 80, 0, 50, 5, 0], //那覇市
		[250, 80, 0, 50, 5, 0], //那覇市
		[250, 80, 0, 50, 5, 0], //那覇市
		[250, 80, 0, 50, 5, 0] //那覇市
	],

	// Hot Water Supply by local government per m2 in Season
	//
	prefHotWaterPrice: [
		0, //18,10,33,25 "広州",
		0, //18,10,33,25 "広州",
		0, //18,10,33,25 "広州",
		0, //18,10,33,25 "広州",
		0 //21,15,33,25 "海口"
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
	prefSeasonFactorArray: [

		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //naha
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //naha
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //naha
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		] //naha
	],

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
	getSeasonParam: function(pref) {
		var param = this.getSeasonFactor(pref);

		ret = Array();
		ret["electricity"] = [param[0][0], param[1][0], param[2][0]];
		ret["gas"] = [param[0][1], param[1][1], param[2][1]];
		ret["kerosene"] = [param[0][2], param[1][2], param[2][2]];
		ret["hotwater"] = [1, 0, 0]; //original

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
	//世帯人数別の支出金額比率（標準値に対する割合:家計調査より）
	//	[電気、ガス、灯油、ガソリン]
	//	[1人世帯、2人世帯、3人世帯、4人世帯、5人世帯、6人以上世帯]
	//		出典について複数の環境家計簿からの集計値（確認：評価基礎情報ではない）
	kakeiNumCoefficent: [
		[0.47, 0.52, 0.37, 0.45, 0.4, 0.4],
		[0.86, 0.83, 0.9, 0.79, 0.8, 0.8],
		[0.99, 1.0, 0.9, 0.98, 1.0, 1.0],
		[1.07, 1.1, 0.85, 1.16, 1.1, 1.1],
		[1.24, 1.17, 1.1, 1.26, 1.3, 1.3],
		[1.55, 1.19, 1.67, 1.33, 1.4, 1.4]
	],

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
	//郊外の場合の比率 家計調査より 2001～2007年
	//  都市部：大都市と中都市の平均
	//  郊外：小都市A、小都市B、町村の平均
	urbanCostCoefficient: [
		[8762, 9618],
		[6100, 5133],
		[828, 1898],
		[3415, 6228],
		[3, 20],
		[24, 5]
	]
});
