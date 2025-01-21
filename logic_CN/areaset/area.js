/**
 * Home-Eco Diagnosis for JavaScript
 * AreaParameters area: parameters by prefecture for home
 *
 * @author Yasufumi SUZUKI  2011/04/15 Diagnosis5
 *								2011/05/06 actionscript3
 * 								2016/04/12 js
 */

D6.patch(D6.area, {
	//name of prefecture/city
	//	prefName[prefectureid/cityid]
	//
	//都道府県名
	prefName: [
		'北京',
		'河北',
		'山西',
		'辽宁',
		'吉林',
		'黑龙江',
		'江苏',
		'浙江',
		'安徽',
		'福建',
		'江西',
		'山东',
		'河南',
		'湖北',
		'湖南',
		'广东',
		'海南',
		'四川',
		'贵州',
		'云南',
		'陕西',
		'甘肃',
		'青海',
		'台湾',
		'内蒙古',
		'广西',
		'西藏',
		'宁夏',
		'新疆',
		'北京',
		'天津',
		'上海',
		'重庆',
		'香港',
		'澳门'
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
		2,
		2,
		2,
		1,
		1,
		1,
		4,
		4,
		4,
		5,
		4,
		3,
		3,
		4,
		4,
		6,
		6,
		4,
		3,
		4,
		2,
		1,
		1,
		6,
		1,
		5,
		1,
		1,
		1,
		2,
		2,
		4,
		4,
		6,
		6
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
	//気象庁｢気象庁年報｣ 平成19年　各都道府県の平均気温
	//数値は各都道府県の県庁所在地の気象官署の観測値。
	//  （ただし、埼玉県は熊谷市、滋賀県は彦根市の気象官署の観測値)
	// Unit.setArea()で　該当する地域について　averageTemplature　にコピーをして利用
	//
	prefTemplature: [
		11.1, //青森
		12.2, //山形
		11.1, //青森
		9.4, //北海道
		7,//旭川
		7,//旭川
		16.6, //千葉
		15.8, //埼玉
		15.8, //埼玉
		19.3, //鹿児島
		17.0, //広島
		13.1, //宮城
		13.6, //福島
		15.8, //埼玉
		17.0, //東京
		23.5, //沖縄
		23.5, //沖縄
		16.3, //京都
		13.6, //福島
		15.0, //福井
		12.2, //山形
		9.4, //北海道
		7,//旭川
		23.5, //沖縄
		7,//旭川
		19.3, //鹿児島
		7,//旭川
		9.4, //北海道
		9.4, //北海道
		11.1, //青森
		12.2, //山形
		16.6, //千葉
		18.0, //熊本
		23.5, //沖縄
		23.5, //沖縄
	],

	// solar factor
	//
	//		prefPVElectricity( prefecture )
	//
	// ex. JWA　monsola05
	//  annual solar energy input at most provable direction kWh/m2/day
	prefPVElectricity: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],

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
	seasonMonth: { winter: 4, spring: 5, summer: 3 },

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
	//　中国の電力消費 2011年 413kWh/年・人　http://www.chinaero.com.cn/zxdt/djxx/ycwz/2014/05/146440.shtml
	//　413×1元/kWh×3人÷12
	// おおむね3000kWh/年世帯程度か？
	//	2021年平均世帯人数2.62人　2019年の1人あたり電気消費量 759kWh/年
	//  https://www.stats.gov.cn/sj/ndsj/2024/indexch.htm
	prefKakeiEnergy: [
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 250],
		[200, 80, 0, 50, 5, 300],
		[200, 80, 0, 50, 5, 300],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 250],
		[200, 80, 0, 50, 5, 300],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 300],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 300],
		[200, 80, 0, 50, 5, 250],
		[200, 80, 0, 50, 5, 250],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 200],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0],
		[200, 80, 0, 50, 5, 0]
	],

	// Hot Water Supply by local government per m2 in Season
	//
	prefHotWaterPrice: [
		22,
		20,
		22,
		25,
		31,
		31,
		17,
		17,
		17,
		0,
		0,
		22,
		20,
		17,
		17,
		0,
		0,
		17,
		20,
		17,
		20,
		25,
		31,
		0,
		31,
		0,
		31,
		25,
		25,
		22,
		20,
		17,
		0,
		0,
		0
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
			[1.185, 1.0197, 1.8202, 1.0114],
			[0.9286, 1.0217, 0.7966, 0.9894],
			[0.8722, 0.9376, 0.2455, 1.0025]
		], //青森市
		[
			[1.1941, 1.1766, 1.9629, 0.9636],
			[0.8986, 0.9952, 0.6925, 0.9746],
			[0.9103, 0.7726, 0.2285, 1.091]
		], //山形市
		[
			[1.185, 1.0197, 1.8202, 1.0114],
			[0.9286, 1.0217, 0.7966, 0.9894],
			[0.8722, 0.9376, 0.2455, 1.0025]
		], //青森市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.1219, 1.3604, 2.4476, 1.0147],
			[0.881, 0.9263, 0.4213, 0.9324],
			[1.0359, 0.6424, 0.0343, 1.0931]
		], //千葉市
		[
			[1.1087, 1.3465, 2.5018, 0.8666],
			[0.8778, 0.9416, 0.3854, 0.9338],
			[1.0587, 0.6352, 0.0219, 1.2882]
		], //さいたま市
		[
			[1.1087, 1.3465, 2.5018, 0.8666],
			[0.8778, 0.9416, 0.3854, 0.9338],
			[1.0587, 0.6352, 0.0219, 1.2882]
		], //さいたま市
		[
			[1.0288, 1.2375, 2.4612, 0.9435],
			[0.8727, 0.966, 0.3749, 0.9441],
			[1.1738, 0.7401, 0.0937, 1.1685]
		], //鹿児島市
		[
			[1.1835, 1.3205, 2.2709, 0.9131],
			[0.8344, 0.9538, 0.5145, 0.986],
			[1.0313, 0.6496, 0.1146, 1.1393]
		], //広島市
		[
			[1.1606, 1.2125, 2.2116, 0.9972],
			[0.9272, 0.9747, 0.5783, 0.9563],
			[0.9071, 0.7588, 0.0873, 1.0766]
		], //仙台市
		[
			[1.1462, 1.1823, 1.9593, 0.9525],
			[0.9195, 0.9801, 0.6816, 0.987],
			[0.9393, 0.7901, 0.2515, 1.085]
		], //福島市
		[
			[1.1087, 1.3465, 2.5018, 0.8666],
			[0.8778, 0.9416, 0.3854, 0.9338],
			[1.0587, 0.6352, 0.0219, 1.2882]
		], //さいたま市
		[
			[1.1218, 1.3846, 2.4812, 1.0011],
			[0.8666, 0.9201, 0.393, 0.8726],
			[1.0599, 0.6203, 0.0368, 1.2109]
		], //東京都区部
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //那覇市
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //那覇市
		[
			[1.1548, 1.4195, 2.4335, 1.0361],
			[0.8259, 0.9153, 0.4398, 0.9566],
			[1.0838, 0.5819, 0.0223, 1.0242]
		], //京都市
		[
			[1.1462, 1.1823, 1.9593, 0.9525],
			[0.9195, 0.9801, 0.6816, 0.987],
			[0.9393, 0.7901, 0.2515, 1.085]
		], //福島市
		[
			[1.1454, 1.1327, 2.1399, 1.0077],
			[0.8642, 1.0102, 0.5938, 1.0036],
			[1.0325, 0.8059, 0.1572, 0.9838]
		], //福井市
		[
			[1.1941, 1.1766, 1.9629, 0.9636],
			[0.8986, 0.9952, 0.6925, 0.9746],
			[0.9103, 0.7726, 0.2285, 1.091]
		], //山形市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //那覇市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.0288, 1.2375, 2.4612, 0.9435],
			[0.8727, 0.966, 0.3749, 0.9441],
			[1.1738, 0.7401, 0.0937, 1.1685]
		], //鹿児島市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.149, 1.1094, 1.8254, 0.9243],
			[0.9482, 0.9876, 0.8169, 1.0159],
			[0.8876, 0.8749, 0.2047, 1.0743]
		], //札幌市
		[
			[1.185, 1.0197, 1.8202, 1.0114],
			[0.9286, 1.0217, 0.7966, 0.9894],
			[0.8722, 0.9376, 0.2455, 1.0025]
		], //青森市
		[
			[1.1941, 1.1766, 1.9629, 0.9636],
			[0.8986, 0.9952, 0.6925, 0.9746],
			[0.9103, 0.7726, 0.2285, 1.091]
		], //山形市
		[
			[1.1219, 1.3604, 2.4476, 1.0147],
			[0.881, 0.9263, 0.4213, 0.9324],
			[1.0359, 0.6424, 0.0343, 1.0931]
		], //千葉市
		[
			[1.0242, 1.1665, 2.303, 1.0177],
			[0.8686, 0.9761, 0.479, 0.9543],
			[1.1867, 0.8178, 0.131, 1.0525]
		], //熊本市
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		], //那覇市
		[
			[0.8457, 1.1222, 1.5081, 0.9201],
			[0.9351, 0.9941, 0.8528, 0.9802],
			[1.3139, 0.847, 0.5678, 1.1395]
		] //那覇市
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

		var ret = Array();
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
	//　　出典について複数の環境家計簿からの集計値（確認：評価基礎情報ではない）
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
	//郊外の場合の比率　家計調査より 2001～2007年
	//　都市部：大都市と中都市の平均
	//　郊外：小都市A、小都市B、町村の平均
	urbanCostCoefficient: [
		[8762, 9618],
		[6100, 5133],
		[828, 1898],
		[3415, 6228],
		[3, 20],
		[24, 5]
	],
	
	//base unit
	toukeiUnit : [ 1,1,1,1,1,1],

	//unit of this year 
	toukeiUnitNow : [ 1,1,1,1,1,1 ],

	//energy consumption statistic factor
	energyfactor : [ 1,1,1,1,1,1 ],

});
