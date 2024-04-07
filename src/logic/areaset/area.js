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

import { accons } from "./accons.js";
import { acload } from "./acload.js";
import { acadd } from "./acadd.js";

export class area {

  constructor(Unit) {
    this.Unit = Unit;
  }
    
  accons = accons;
  acload = acload;
  acadd = acadd;

  averageCostEnergy = [];

  //name of prefecture
  //	prefName[prefecture]
  //
  prefName = [
    "兵庫",
    "北海道", //1
    "青森",
    "岩手",
    "宮城",
    "秋田", //5
    "山形",
    "福島",
    "茨城",
    "栃木",
    "群馬", //10
    "埼玉",
    "千葉",
    "東京",
    "神奈川",
    "新潟", //15
    "富山",
    "石川",
    "福井",
    "山梨",
    "長野", //20
    "岐阜",
    "静岡",
    "愛知",
    "三重",
    "滋賀", //25
    "京都",
    "大阪",
    "兵庫",
    "奈良",
    "和歌山", //30
    "鳥取",
    "島根",
    "岡山",
    "広島",
    "山口", //35
    "徳島",
    "香川",
    "愛媛",
    "高知",
    "福岡", //40
    "佐賀",
    "長崎",
    "熊本",
    "大分",
    "宮崎", //45
    "鹿児島",
    "沖縄",
  ];

  prefDefault = 13; //not selected

  //electricity supply company price ratio
  electCompanyPrice = [1.2, 1, 1, 1, 1, 1, 1, 1, 1, 1.2];

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
  elecPrice = {
    1: [33.32, 33.32, 33.32, -1500, 0],
    2: [33.32, 33.32, 33.32, -1500, 280],
    3: [38.89, 27.32, 13.1, 2160, 0],
    4: [17.98, 16.53, 16.53, 0, 1054],
    5: [20.22, 18.56, 18.56, 64800, 0],
    6: [22.58, 17.36, 13.08, 0, 1733],
  };

  // meteorological annal average templature C
  //
  //		prefTemplature( prefecture )
  //
  //
  // in Unit.setArea() copy this to averageTemplature
  //
  prefTemplature = [
    17.4, //兵庫
    9.4, //北海道
    11.1, //青森
    10.7, //岩手
    13.1, //宮城
    12.4, //秋田
    12.2, //山形
    13.6, //福島
    14.4, //茨城
    14.6, //栃木
    15.3, //群馬
    15.8, //埼玉
    16.6, //千葉
    17.0, //東京
    16.5, //神奈川
    14.4, //新潟
    14.9, //富山
    15.1, //石川
    15.0, //福井
    15.3, //山梨
    12.5, //長野
    16.4, //岐阜
    17.1, //静岡
    16.6, //愛知
    16.6, //三重
    15.2, //滋賀
    16.3, //京都
    17.6, //大阪
    17.4, //兵庫
    15.3, //奈良
    17.3, //和歌山
    15.5, //鳥取
    15.7, //島根
    17.0, //岡山
    17.0, //広島
    16.2, //山口
    17.4, //徳島
    17.3, //香川
    17.3, //愛媛
    17.9, //高知
    18.0, //福岡
    17.4, //佐賀
    18.0, //長崎
    18.0, //熊本
    17.4, //大分
    18.1, //宮崎
    19.3, //鹿児島
    23.5, //沖縄
  ];

  // solar factor
  //
  //		prefPVElectricity( prefecture )
  //
  prefPVElectricity = [
    4.04, //兵庫
    3.95, //北海道
    3.66, //青森
    3.88, //岩手
    3.84, //宮城
    3.54, //秋田
    3.72, //山形
    3.87, //福島
    3.95, //茨城
    3.97, //栃木
    4.08, //群馬
    3.81, //埼玉
    4.0, //千葉
    3.74, //東京
    3.92, //神奈川
    3.54, //新潟
    3.56, //富山
    3.68, //石川
    3.57, //福井
    4.31, //山梨
    3.95, //長野
    4.25, //岐阜
    4.15, //静岡
    4.11, //愛知
    4.15, //三重
    3.46, //滋賀
    3.72, //京都
    3.92, //大阪
    4.04, //兵庫
    3.99, //奈良
    4.12, //和歌山
    3.66, //鳥取
    3.74, //島根
    4.06, //岡山
    4.26, //広島
    3.99, //山口
    4.13, //徳島
    4.18, //香川
    4.15, //愛媛
    4.32, //高知
    3.79, //福岡
    3.94, //佐賀
    3.97, //長崎
    4.05, //熊本
    3.95, //大分
    4.26, //宮崎
    4.01, //鹿児島
    4.15, //沖縄
  ];

  // heat load factore table
  //
  //エアコン・冷暖房負荷算出用
  //	配列は　  [朝、昼、夕、夜]の係数で、
  //	それぞれ　[暖房半月、暖房1ヶ月、暖房2ヶ月、暖房3ヶ月、暖房4ヶ月、暖房6ヶ月、暖房8ヶ月、
  //				冷房半月、冷房1ヶ月、冷房2ヶ月、冷房3ヶ月、冷房4ヶ月]
  //	の規定温度における消費量に対する割合を示す。
  //	この計算方法等については、京都府地球温暖化防止活動推進センター,2006より

  // accons factor copy from D6.accons
  //月数別のエアコン負荷（初期設定は神戸市）
  airconFactor_mon = [
    [0.66, 0.62, 0.59, 0.55, 0.5, 0.41, 0.37, 0.39, 0.36, 0.31, 0.26, 0.2],
    [0.43, 0.39, 0.37, 0.34, 0.3, 0.27, 0.26, 0.79, 0.75, 0.67, 0.59, 0.49],
    [0.47, 0.45, 0.42, 0.39, 0.35, 0.3, 0.29, 0.57, 0.55, 0.49, 0.43, 0.35],
    [0.62, 0.58, 0.55, 0.51, 0.47, 0.39, 0.35, 0.34, 0.32, 0.27, 0.23, 0.18],
  ];

  // heat factor copy from D6.heatcons
  //月数別の熱需要負荷（初期設定は神戸市）
  heatFactor_mon = [
    [0.64, 0.61, 0.6, 0.57, 0.53, 0.53, 0.44, 0.54, 0.54, 0.43, 0.36, 0.28],
    [0.48, 0.45, 0.42, 0.39, 0.34, 0.3, 0.3, 0.88, 0.85, 0.78, 0.7, 0.59],
    [0.52, 0.49, 0.47, 0.43, 0.39, 0.33, 0.32, 0.72, 0.7, 0.64, 0.56, 0.46],
    [0.62, 0.59, 0.57, 0.54, 0.5, 0.42, 0.38, 0.48, 0.45, 0.39, 0.32, 0.25],
  ];

  // addac factor copy from D6.addac
  plusHeatFactor_mon = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

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
  prefKakeiEnergy = [
		[7712, 5113, 234, 2339 ],
		[11074, 4633, 5987, 5542 ],	//札幌
		[11833, 3726, 6433, 5637 ],
		[11621, 4611, 4076, 5858 ],
		[10416, 5203, 1738, 4908 ],
		[11085, 4702, 4267, 5772 ],
		[12472, 5430, 3792, 7303 ],	//山形
		[12577, 4654, 2516, 6797 ],
		[10806, 5234, 1034, 6762 ],
		[10296, 5154, 1170, 6213 ],
		[9380, 4335, 977, 6883 ],
		[10560, 5910, 479, 3452 ],	//さいたま
		[9848, 5270, 482, 4050 ],
		[10091, 6009, 218, 1570 ],
		[9563, 5746, 296, 2808 ],
		[11657, 6225, 2001, 6275 ],
		[13157, 3995, 2270, 7362 ],	//富山
		[13061, 4027, 1739, 7125 ],
		[13600, 3997, 1173, 5433 ],
		[10490, 4763, 1177, 5905 ],
		[9866, 4936, 2451, 6874 ],
		[11315, 5586, 908, 6599 ],	//岐阜
		[11002, 6102, 463, 4792 ],
		[9772, 6046, 305, 4204 ],
		[10213, 4899, 865, 6920 ],
		[10752, 4718, 846, 4587 ],
		[9660, 6021, 433, 2433 ],		//京都
		[10737, 6083, 183, 1615 ],
		[7712, 5113, 234, 2339 ],
		[10851, 5556, 590, 4474 ],
		[11366, 3776, 726, 4342 ],
		[10987, 3843, 1266, 7235 ],	//鳥取
		[11839, 4743, 922, 6442 ],
		[10763, 5096, 574, 5750 ],
		[10137, 5314, 536, 4872 ],
		[11249, 4047, 1002, 7912 ],
		[12138, 4602, 661, 5526 ],	//徳島
		[11611, 4274, 777, 6115 ],
		[11443, 4389, 592, 4738 ],
		[11123, 5381, 510, 5632 ],
		[9148, 5516, 386, 3795 ],
		[10973, 4331, 706, 6410 ],	//佐賀
		[9635, 5323, 533, 4249 ],
		[10105, 4694, 569, 5763 ],
		[9872, 3688, 585, 5896 ],
		[8904, 3336, 623, 6574 ],
		[9598, 4581, 492, 5777 ],		//鹿児島
		[9935, 4603, 371, 4631 ]
  ];

	//statistic unit price 
	toukeiUnit = [ 25.91, 557.07, 77.27, 130.07, 120.80 ];

	//unit price 2022
	toukeiUnitNow = [ 31.72, 764.61, 111, 168.1, 148.2 ];

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
  prefSeasonFactorArray = [
    [
      [1.1084, 1.3537, 2.5436, 0.9465],
      [0.8664, 0.9165, 0.3546, 0.9764],
      [1.0782, 0.6675, 0.0175, 1.1107],
    ], //神戸市
    [
      [1.149, 1.1094, 1.8254, 0.9243],
      [0.9482, 0.9876, 0.8169, 1.0159],
      [0.8876, 0.8749, 0.2047, 1.0743],
    ], //札幌市
    [
      [1.185, 1.0197, 1.8202, 1.0114],
      [0.9286, 1.0217, 0.7966, 0.9894],
      [0.8722, 0.9376, 0.2455, 1.0025],
    ], //青森市
    [
      [1.2519, 1.176, 1.9527, 0.9121],
      [0.9035, 0.9891, 0.7324, 1.0333],
      [0.8249, 0.7835, 0.1757, 1.0616],
    ], //盛岡市
    [
      [1.1606, 1.2125, 2.2116, 0.9972],
      [0.9272, 0.9747, 0.5783, 0.9563],
      [0.9071, 0.7588, 0.0873, 1.0766],
    ], //仙台市
    [
      [1.1375, 1.1571, 1.962, 1.0131],
      [0.9253, 0.9971, 0.7264, 0.9946],
      [0.9411, 0.7954, 0.1733, 0.9915],
    ], //秋田市
    [
      [1.1941, 1.1766, 1.9629, 0.9636],
      [0.8986, 0.9952, 0.6925, 0.9746],
      [0.9103, 0.7726, 0.2285, 1.091],
    ], //山形市
    [
      [1.1462, 1.1823, 1.9593, 0.9525],
      [0.9195, 0.9801, 0.6816, 0.987],
      [0.9393, 0.7901, 0.2515, 1.085],
    ], //福島市
    [
      [1.1464, 1.252, 2.0957, 1.021],
      [0.9062, 0.9648, 0.5947, 0.9815],
      [0.9611, 0.7228, 0.2145, 1.0028],
    ], //水戸市
    [
      [1.1498, 1.2742, 1.934, 1.0276],
      [0.9069, 0.9497, 0.6857, 0.9587],
      [0.9555, 0.7183, 0.2786, 1.032],
    ], //宇都宮市
    [
      [1.1471, 1.2582, 1.9129, 0.9325],
      [0.8853, 0.948, 0.6602, 0.9919],
      [0.9949, 0.7424, 0.3491, 1.1035],
    ], //前橋市
    [
      [1.1087, 1.3465, 2.5018, 0.8666],
      [0.8778, 0.9416, 0.3854, 0.9338],
      [1.0587, 0.6352, 0.0219, 1.2882],
    ], //さいたま市
    [
      [1.1219, 1.3604, 2.4476, 1.0147],
      [0.881, 0.9263, 0.4213, 0.9324],
      [1.0359, 0.6424, 0.0343, 1.0931],
    ], //千葉市
    [
      [1.1218, 1.3846, 2.4812, 1.0011],
      [0.8666, 0.9201, 0.393, 0.8726],
      [1.0599, 0.6203, 0.0368, 1.2109],
    ], //東京都区部
    [
      [1.1243, 1.3369, 2.3761, 0.929],
      [0.8828, 0.9295, 0.4813, 0.9553],
      [1.0296, 0.6683, 0.0296, 1.1692],
    ], //横浜市
    [
      [1.1343, 1.3681, 2.2726, 0.9586],
      [0.893, 0.9273, 0.5639, 0.9968],
      [0.9993, 0.6303, 0.0302, 1.0607],
    ], //新潟市
    [
      [1.1048, 1.1422, 1.9012, 1.053],
      [0.8787, 0.9851, 0.7561, 0.9779],
      [1.0624, 0.8352, 0.205, 0.966],
    ], //富山市
    [
      [1.1945, 1.1597, 2.0031, 1.0081],
      [0.8731, 1.0076, 0.6543, 0.9632],
      [0.9521, 0.7745, 0.2386, 1.0505],
    ], //金沢市
    [
      [1.1454, 1.1327, 2.1399, 1.0077],
      [0.8642, 1.0102, 0.5938, 1.0036],
      [1.0325, 0.8059, 0.1572, 0.9838],
    ], //福井市
    [
      [1.1554, 1.1964, 1.8836, 0.9521],
      [0.8678, 0.9947, 0.689, 0.9717],
      [1.013, 0.747, 0.3402, 1.1109],
    ], //甲府市
    [
      [1.2328, 1.2225, 1.9588, 0.957],
      [0.8761, 0.9709, 0.7043, 0.9998],
      [0.896, 0.7519, 0.2145, 1.0576],
    ], //長野市
    [
      [1.0541, 1.199, 2.3036, 0.9536],
      [0.89, 0.9711, 0.4871, 0.9731],
      [1.1112, 0.7827, 0.1166, 1.1066],
    ], //岐阜市
    [
      [1.0731, 1.175, 2.3433, 0.9896],
      [0.8948, 0.9886, 0.453, 0.9589],
      [1.0778, 0.7857, 0.1207, 1.0824],
    ], //静岡市
    [
      [1.0842, 1.3188, 2.4434, 0.9445],
      [0.8755, 0.9435, 0.4371, 0.9695],
      [1.0953, 0.6692, 0.0136, 1.1248],
    ], //名古屋市
    [
      [1.079, 1.2873, 2.276, 1.0473],
      [0.8916, 0.964, 0.4966, 0.9682],
      [1.0753, 0.677, 0.1377, 0.9898],
    ], //津市
    [
      [1.1796, 1.3788, 2.4042, 0.9903],
      [0.8665, 0.9313, 0.4425, 0.9513],
      [0.983, 0.6095, 0.0569, 1.094],
    ], //大津市
    [
      [1.1548, 1.4195, 2.4335, 1.0361],
      [0.8259, 0.9153, 0.4398, 0.9566],
      [1.0838, 0.5819, 0.0223, 1.0242],
    ], //京都市
    [
      [1.051, 1.3736, 2.6546, 0.8413],
      [0.8319, 0.9203, 0.2663, 0.9845],
      [1.2122, 0.6347, 0.0167, 1.2374],
    ], //大阪市
    [
      [1.1084, 1.3537, 2.5436, 0.9465],
      [0.8664, 0.9165, 0.3546, 0.9764],
      [1.0782, 0.6675, 0.0175, 1.1107],
    ], //神戸市
    [
      [1.1301, 1.3407, 2.324, 0.9201],
      [0.8464, 0.9429, 0.4949, 0.9414],
      [1.0826, 0.6409, 0.0765, 1.2042],
    ], //奈良市
    [
      [1.0738, 1.2468, 2.1346, 0.9533],
      [0.875, 0.9801, 0.5627, 0.967],
      [1.1098, 0.7042, 0.216, 1.1172],
    ], //和歌山市
    [
      [1.1396, 1.2053, 2.116, 0.9945],
      [0.8942, 0.9914, 0.5994, 0.9753],
      [0.9902, 0.7406, 0.1796, 1.0486],
    ], //鳥取市
    [
      [1.1848, 1.2606, 2.2206, 0.9281],
      [0.8625, 0.9772, 0.5387, 0.9858],
      [0.9828, 0.6904, 0.1414, 1.1197],
    ], //松江市
    [
      [1.1117, 1.2538, 2.2167, 0.9359],
      [0.8468, 0.9675, 0.5474, 0.9602],
      [1.1063, 0.7157, 0.1321, 1.1519],
    ], //岡山市
    [
      [1.1835, 1.3205, 2.2709, 0.9131],
      [0.8344, 0.9538, 0.5145, 0.986],
      [1.0313, 0.6496, 0.1146, 1.1393],
    ], //広島市
    [
      [1.1315, 1.2583, 2.1551, 0.9978],
      [0.8563, 0.9579, 0.5741, 0.9821],
      [1.0642, 0.7259, 0.1697, 1.0328],
    ], //山口市
    [
      [1.1012, 1.1775, 1.9936, 0.974],
      [0.8708, 0.9956, 0.6212, 0.9728],
      [1.0805, 0.7707, 0.3065, 1.0799],
    ], //徳島市
    [
      [1.083, 1.219, 2.1848, 0.9868],
      [0.8645, 0.9739, 0.548, 0.9244],
      [1.1151, 0.7514, 0.1737, 1.1437],
    ], //高松市
    [
      [1.1214, 1.2011, 2.1502, 0.9629],
      [0.8572, 0.9762, 0.5598, 0.9506],
      [1.076, 0.7716, 0.2, 1.1317],
    ], //松山市
    [
      [1.0502, 1.203, 2.307, 0.9864],
      [0.8667, 0.9859, 0.4585, 0.9409],
      [1.1553, 0.7529, 0.1598, 1.1166],
    ], //高知市
    [
      [1.0572, 1.2804, 2.4313, 0.9451],
      [0.8802, 0.9628, 0.4214, 0.9737],
      [1.1234, 0.688, 0.056, 1.1171],
    ], //福岡市
    [
      [1.072, 1.2351, 2.2281, 0.9328],
      [0.8631, 0.9775, 0.5252, 0.9638],
      [1.1322, 0.724, 0.1539, 1.1499],
    ], //佐賀市
    [
      [1.0812, 1.2687, 2.4828, 0.9539],
      [0.876, 0.9636, 0.3415, 1.0029],
      [1.0984, 0.7025, 0.1204, 1.0566],
    ], //長崎市
    [
      [1.0242, 1.1665, 2.303, 1.0177],
      [0.8686, 0.9761, 0.479, 0.9543],
      [1.1867, 0.8178, 0.131, 1.0525],
    ], //熊本市
    [
      [1.084, 1.2347, 2.1746, 0.965],
      [0.8782, 0.972, 0.562, 0.9673],
      [1.0909, 0.7337, 0.1639, 1.1011],
    ], //大分市
    [
      [1.0268, 1.2281, 2.2258, 0.9817],
      [0.887, 0.9818, 0.5177, 0.939],
      [1.1527, 0.7262, 0.1694, 1.126],
    ], //宮崎市
    [
      [1.0288, 1.2375, 2.4612, 0.9435],
      [0.8727, 0.966, 0.3749, 0.9441],
      [1.1738, 0.7401, 0.0937, 1.1685],
    ], //鹿児島市
    [
      [0.8457, 1.1222, 1.5081, 0.9201],
      [0.9351, 0.9941, 0.8528, 0.9802],
      [1.3139, 0.847, 0.5678, 1.1395],
    ], //那覇市
  ];

  // 郵便番号を気候区分に変換
  // 一部対応していない場合もあるので、変換後に修正してもらえるようにする
  zipCode2areaHeating = function (zipCode7) {
    var zipCode = parseInt(zipCode7.substr(0, 4));
    var areaHeating;
    var i;

    var zip2heating = [
      //P1未満の場合はP2が気候区分
      [10, 1],
      [12, 3],
      [16, 2],
      [17, 3],
      [21, 2],
      [23, 3],
      [26, 2],
      [28, 3],
      [29, 2],
      [31, 3],
      [44, 2],
      [49, 1],
      [51, 2],
      [100, 1],
      [323, 4],
      [325, 3],
      [378, 4],
      [379, 3],
      [380, 4],
      [382, 3],
      [386, 2],
      [391, 3],
      [392, 2],
      [400, 3],
      [403, 4],
      [404, 2],
      [413, 4],
      [414, 5],
      [415, 4],
      [417, 5],
      [644, 4],
      [645, 5],
      [647, 4],
      [648, 5],
      [718, 4],
      [719, 3],
      [728, 4],
      [729, 3],
      [780, 4],
      [789, 5],
      [810, 4],
      [811, 5],
      [815, 4],
      [816, 5],
      [850, 4],
      [853, 5],
      [855, 4],
      [856, 5],
      [857, 4],
      [860, 5],
      [866, 4],
      [868, 5],
      [880, 4],
      [885, 5],
      [887, 4],
      [900, 5],
      [910, 6],
      [940, 4],
      [942, 3],
      [946, 4],
      [950, 3],
      [952, 4],
      [953, 3],
      [959, 4],
      [966, 3],
      [967, 2],
      [968, 3],
      [969, 2],
      [974, 3],
      [975, 4],
      [991, 3],
      [994, 2],
      [996, 3],
      [997, 2],
      [1000, 3],
    ];

    for (i = 0; i < zip2heating.length; i++) {
      if (zipCode < zip2heating[i][0]) {
        areaHeating = zip2heating[i][1];
        break;
      }
    }
    return areaHeating;
  };

  // 郵便番号をISOの都道府県コードに変換
  // 一部対応していない場合もあるので、変換後に修正してもらえるようにする
  zipCode2prefNum = function (zipCode) {
    if (zipCode) {
      zipCode = parseInt(zipCode.substr(0, 3));
    }
    var prefNum;
    if (zipCode < 1) {
      prefNum = 28;
    } else if (zipCode < 10) {
      prefNum = 1;
    } else if (zipCode < 20) {
      prefNum = 5;
    } else if (zipCode < 30) {
      prefNum = 3;
    } else if (zipCode < 40) {
      prefNum = 2;
    } else if (zipCode < 100) {
      prefNum = 1;
    } else if (zipCode < 210) {
      prefNum = 13;
    } else if (zipCode < 260) {
      prefNum = 14;
    } else if (zipCode < 300) {
      prefNum = 12;
    } else if (zipCode < 320) {
      prefNum = 8;
    } else if (zipCode < 330) {
      prefNum = 9;
    } else if (zipCode < 370) {
      prefNum = 11;
    } else if (zipCode < 380) {
      prefNum = 10;
    } else if (zipCode < 400) {
      prefNum = 20;
    } else if (zipCode < 410) {
      prefNum = 19;
    } else if (zipCode < 440) {
      prefNum = 22;
    } else if (zipCode < 500) {
      prefNum = 23;
    } else if (zipCode < 510) {
      prefNum = 21;
    } else if (zipCode < 520) {
      prefNum = 24;
    } else if (zipCode < 530) {
      prefNum = 25;
    } else if (zipCode < 600) {
      prefNum = 27;
    } else if (zipCode < 630) {
      prefNum = 26;
    } else if (zipCode < 640) {
      prefNum = 29;
    } else if (zipCode < 650) {
      prefNum = 30;
    } else if (zipCode < 680) {
      prefNum = 28;
    } else if (zipCode < 685) {
      prefNum = 31;
    } else if (zipCode < 686) {
      prefNum = 32;
    } else if (zipCode < 690) {
      prefNum = 31;
    } else if (zipCode < 700) {
      prefNum = 32;
    } else if (zipCode < 720) {
      prefNum = 33;
    } else if (zipCode < 740) {
      prefNum = 34;
    } else if (zipCode < 760) {
      prefNum = 35;
    } else if (zipCode < 770) {
      prefNum = 37;
    } else if (zipCode < 780) {
      prefNum = 36;
    } else if (zipCode < 790) {
      prefNum = 39;
    } else if (zipCode < 800) {
      prefNum = 38;
    } else if (zipCode < 817) {
      prefNum = 40;
    } else if (zipCode < 818) {
      prefNum = 42;
    } else if (zipCode < 840) {
      prefNum = 40;
    } else if (zipCode < 850) {
      prefNum = 41;
    } else if (zipCode < 860) {
      prefNum = 42;
    } else if (zipCode < 870) {
      prefNum = 43;
    } else if (zipCode < 880) {
      prefNum = 44;
    } else if (zipCode < 890) {
      prefNum = 45;
    } else if (zipCode < 900) {
      prefNum = 46;
    } else if (zipCode < 910) {
      prefNum = 47;
    } else if (zipCode < 920) {
      prefNum = 18;
    } else if (zipCode < 930) {
      prefNum = 17;
    } else if (zipCode < 940) {
      prefNum = 16;
    } else if (zipCode < 960) {
      prefNum = 15;
    } else if (zipCode < 980) {
      prefNum = 7;
    } else if (zipCode < 990) {
      prefNum = 4;
    } else if (zipCode < 1000) {
      prefNum = 6;
    } else {
      prefNum = 1;
    }

    return prefNum;
  };

  // heat category with prefecture
  //	prefHeatingLevel[prefecture]
  //
  //	return code
  //		1:cold area in Japan(Hokkaido)
  //			.
  //			.
  //		6:hot area in Japan(Okinawa)
  //
  prefHeatingLevel = [
    4, 1, 2, 2, 3, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 3, 3, 3, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 4, 4,
    5, 5, 6,
  ];

  // CO2 emittion factor
  //	co2ElectCompanyUnit[elec_company]
  //
  //	elec_company
  //		1:hokkaido electric power company.
  //			.
  //			.
  //		9:okinawa electric power company.
  //
  co2ElectCompanyUnit = [0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55];

  //	electricity company code by prefecture
  //
  //	prefToEleArea[prefecture]
  //
  // 0:hokkaido、1:tohoku 2:tokyo 3:chubu 4:hokuritu 5:kansai
  // 6:tyugoku 7:shikoku 8:kyusyu 9:okinawa
  prefToEleArea = [
    5, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 4, 4, 4, 2, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8,
    8, 8, 9,
  ];

  //electricity supply company price ratio
  electCompanyPrice = [1.44, 1.31, 1.31, 1.25, 1.13, 1.14, 1.24, 1.21, 1.15, 1.32];

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
  elecPrice = {
    1: [33.32, 33.32, 33.32, -1500, 0],
    2: [33.32, 33.32, 33.32, -1500, 280],
    3: [38.89, 27.32, 13.1, 2160, 0],
    4: [17.98, 16.53, 16.53, 0, 1054],
    5: [20.22, 18.56, 18.56, 64800, 0],
    6: [22.58, 17.36, 13.08, 0, 1733],
  };

  // convert energy name to energy_type id
  //
  //	energyCode2id[energy_name]	: get energy code
  //
  //
  energyCode2id = {
    electricity: 0,
    gas: 1,
    kerosene: 2,
    car: 3,
  };

  //convert season name to season id.
  //
  //	seasonCode2id[season_name]	: get season code
  //
  seasonCode2id = {
    winter: 0,
    spring: 1,
    summer: 2,
  };

  // months include to each season
  //	seasonMonth[seasonName]
  //
  //	seasonName
  //		winter/spring/summer  , autumn include to spring
  //
  seasonMonth = { winter: 4, spring: 5, summer: 3 };

  // heat load factore table get from acload/accons/acadd
  //
  // accons factor copy from this.accons
  airconFactor_mon = [
    [0.66, 0.62, 0.59, 0.55, 0.5, 0.41, 0.37, 0.39, 0.36, 0.31, 0.26, 0.2],
    [0.43, 0.39, 0.37, 0.34, 0.3, 0.27, 0.26, 0.79, 0.75, 0.67, 0.59, 0.49],
    [0.47, 0.45, 0.42, 0.39, 0.35, 0.3, 0.29, 0.57, 0.55, 0.49, 0.43, 0.35],
    [0.62, 0.58, 0.55, 0.51, 0.47, 0.39, 0.35, 0.34, 0.32, 0.27, 0.23, 0.18],
  ];
  // heat factor copy from this.heatcons
  heatFactor_mon = [
    [0.64, 0.61, 0.6, 0.57, 0.53, 0.53, 0.44, 0.54, 0.54, 0.43, 0.36, 0.28],
    [0.48, 0.45, 0.42, 0.39, 0.34, 0.3, 0.3, 0.88, 0.85, 0.78, 0.7, 0.59],
    [0.52, 0.49, 0.47, 0.43, 0.39, 0.33, 0.32, 0.72, 0.7, 0.64, 0.56, 0.46],
    [0.62, 0.59, 0.57, 0.54, 0.5, 0.42, 0.38, 0.48, 0.45, 0.39, 0.32, 0.25],
  ];
  // addac factor copy from this.addac
  plusHeatFactor_mon = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  // get electric power company from prefecture
  getElectCompany = function (pref) {
    return this.prefToEleArea[pref];
  };

  // get average templature from prefecture
  getTemplature = function (pref) {
    return this.prefTemplature[pref];
  };

  // get average solar generation
  getPVElectricity = function (pref) {
    return this.prefPVElectricity[pref];
  };

  // get heat category
  getHeatingLevel = function (pref) {
    return this.prefHeatingLevel[pref];
  };

  // get electricity CO2 emission factor
  getCo2Unit = function (electCompany) {
    return this.co2ElectCompanyUnit[electCompany];
  };

  // get avearge fee depend on person,prefecture,urban/ural
  // 	ret[energy_name]
  //
  //	energy_name: electricity,gas,kerosene,car
  //
  getAverageCostEnergy = function (num, pref, urban) {
    var ret;
    ret = {};

    var id;
    for (var i in this.energyCode2id) {
      id = this.energyCode2id[i];
      ret[i] =
        (this.prefKakeiEnergy[pref][id] 
					/ this.toukeiUnit[id] *  this.toukeiUnitNow[id] //price unit change				
          * this.kakeiNumCoefficent[(num > 6 ? 6 : num) - 1][id] 
          * this.urbanCostCoefficient[id][urban]) 
          / this.urbanCostCoefficient[id][0];
    }

    return ret;
  };

  // get average tap water templature
  getWaterTemplature = function () {
    var temp = Math.max(5, Math.min(23, 0.9137 * this.averageTemplature + 1.303));
    return temp;
  };

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
  getHeatFactor = function (month, hour) {
    var mIndex;
    var sum = [0, 0, 0];
    var factor = [0, 0, 0];
    var count = 0;

    if (month <= 0.7) {
      mIndex = 0;
    } else if (month <= 1.5) {
      mIndex = 1;
    } else if (month <= 2.5) {
      mIndex = 2;
    } else if (month <= 3.5) {
      mIndex = 3;
    } else if (month <= 5) {
      mIndex = 4;
    } else if (month <= 7) {
      mIndex = 5;
    } else {
      mIndex = 6;
    }

    //estimate use timezone
    if (hour >= 0) {
      //evening
      sum[0] += this.airconFactor_mon[2][mIndex];
      sum[1] += this.heatFactor_mon[2][mIndex];
      sum[2] += this.plusHeatFactor_mon[2][mIndex];
      count++;
    }
    if (hour > 6) {
      //morning
      sum[0] += this.airconFactor_mon[0][mIndex];
      sum[1] += this.heatFactor_mon[0][mIndex];
      sum[2] += this.plusHeatFactor_mon[0][mIndex];
      count++;
    }
    if (hour > 10) {
      //noon
      sum[0] += this.airconFactor_mon[1][mIndex];
      sum[1] += this.heatFactor_mon[1][mIndex];
      sum[2] += this.plusHeatFactor_mon[1][mIndex];
      count++;
    }
    if (hour > 16) {
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
  };

  // get cooling load
  //
  //	getCoolFactor( month, hour )
  //		month:	heat month ( 0.5-12 )
  //		hour:	heat hour per day ( 0.5-24 )
  //
  //	return factor
  //
  getCoolFactor = function (month, hour) {
    var mIndex;
    var sum = [0, 0, 0];
    var factor = [0, 0, 0];
    var count = 0;

    if (month <= 0.7) {
      mIndex = 7;
    } else if (month <= 1.5) {
      mIndex = 8;
    } else if (month <= 2.5) {
      mIndex = 9;
    } else if (month <= 3.5) {
      mIndex = 10;
    } else {
      mIndex = 11;
    }

    //estimate timezone
    if (hour >= 0) {
      //evening
      sum[0] += this.airconFactor_mon[2][mIndex];
      sum[1] += this.heatFactor_mon[2][mIndex];
      count++;
    }
    if (hour > 6) {
      //noon
      sum[0] += this.airconFactor_mon[1][mIndex];
      sum[1] += this.heatFactor_mon[1][mIndex];
      count++;
    }
    if (hour > 12) {
      //night
      sum[0] += this.airconFactor_mon[3][mIndex];
      sum[1] += this.heatFactor_mon[3][mIndex];
      count++;
    }
    if (hour > 18) {
      //morning
      sum[0] += this.airconFactor_mon[0][mIndex];
      sum[1] += this.heatFactor_mon[0][mIndex];
      count++;
    }

    factor[0] = sum[0] / count;
    factor[1] = sum[1] / count;
    factor[2] = sum[2] / count;

    return factor;
  };

  // get season month
  getSeasonFactor = function (area) {
    return this.prefSeasonFactorArray[area];
  };

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
  getSeasonParam = function (pref) {
    var param = this.getSeasonFactor(pref);

    var ret = Array();
    ret["electricity"] = [param[0][0], param[1][0], param[2][0]];
    ret["gas"] = [param[0][1], param[1][1], param[2][1]];
    ret["kerosene"] = [param[0][2], param[1][2], param[2][2]];

    return ret;
  };

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
  kakeiNumCoefficent = [
    [0.47, 0.52, 0.37, 0.45],
    [0.86, 0.83, 0.9, 0.79],
    [0.99, 1.0, 0.9, 0.98],
    [1.07, 1.1, 0.85, 1.16],
    [1.24, 1.17, 1.1, 1.26],
    [1.55, 1.19, 1.67, 1.33],
  ];

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
  urbanCostCoefficient = [
    [8762, 9618],
    [6100, 5133],
    [828, 1898],
    [3415, 6228],
  ];

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
  getAverageCons = function (energy_name) {
    var ret = [0, 0, 0];
    var eid = this.energyCode2id(energy_name);

    //get average
    var avCost = this.averageCostEnergy[energy_name];
    var seasonArray = this.getSeasonFactor(this.area.area);

    // calc consumption by fee
    ret["winter"] = this.costToCons(avCost * seasonArray[0][eid], energy_name);
    ret["spring"] = this.costToCons(avCost * seasonArray[1][eid], energy_name);
    ret["summer"] = this.costToCons(avCost * seasonArray[2][eid], energy_name);

    return ret;
  };

  // get seasonal average fee
  //
  //	getAverageCostSeason( energy_name, season_name )
  //
  //
  getAverageCostSeason = function (energy_name, season_name) {
    var eid = this.energyCode2id(energy_name);
    var avCost = this.averageCostEnergy[energy_name];
    var seasonArray = this.getSeasonFactor(this.area.area);

    return avCost * seasonArray[this.seasonCode2id(season_name)][eid];
  };

  // calc parameters depend on person and area
  //
  //	setPersonArea( numPerson, areaId, urbanId  )
  //		numPerson: 	person in home
  //		areaId:		prefecture
  //		urbanId:	urban/ural
  //
  setPersonArea = function (numPerson, areaId, urbanId) {
    let urban = 0;
    if (urbanId == 1 || urbanId == 2) {
      urban = 1;
    }
    this.urban = urban;

    if (areaId < 0) {
      areaId = this.prefDefault;
    }

    //set this.area(prefecture)
    let area = Math.round(areaId ? areaId : 0);
    this.area = area;

    //electricity supply company
    this.electCompany = this.getElectCompany(area);

    //electricity price unit by supplyer
    this.Unit.price.electricity = this.Unit.defaultPriceElectricity * this.electCompanyPrice[this.electCompany];

    //electricity CO2 emisstion unit by supplyer
    this.Unit.co2.electricity = this.getCo2Unit(this.electCompany);
    this.Unit.co2.nightelectricity = this.Unit.co2.electricity;
    this.Unit.co2.sellelectricity = this.Unit.co2.electricity;

    //set air conditioner load
    this.airconFactor_mon = this.accons.getArray(area);
    this.heatFactor_mon = this.acload.getArray(area);
    this.plusHeatFactor_mon = this.acadd.getArray(area);

    //templature
    this.averageTemplature = this.getTemplature(area);

    //solar generation rate kWh/kW
    this.unitPVElectricity = (1000 * this.getPVElectricity(area)) / 3.6;

    //heat area level
    let heatingLevel = this.getHeatingLevel(area);

    //month of heating / cooling
    switch (heatingLevel) {
      case 1:
        this.seasonMonth = { winter: 8, spring: 3, summer: 1 };
        break;
      case 2:
        this.seasonMonth = { winter: 6, spring: 4, summer: 2 };
        break;
      case 3:
        this.seasonMonth = { winter: 5, spring: 5, summer: 2 };
        break;
      case 5:
        this.seasonMonth = { winter: 3, spring: 5, summer: 4 };
        break;
      case 6:
        this.seasonMonth = { winter: 2, spring: 5, summer: 5 };
        break;
      case 4:
      default:
        this.seasonMonth = { winter: 4, spring: 5, summer: 3 };
        break;
    }

    //calculate average cost
    this.averageCostEnergy = this.getAverageCostEnergy(numPerson <= 0 ? 3 : numPerson, Math.floor(this.area), this.urban);

    //calculate average CO2
    this.averageCO2Energy = {};
    for (var i in this.averageCostEnergy) {
      this.averageCO2Energy[i] = this.costToCons(this.averageCostEnergy[i], i) * this.Unit.co2[i];
    }
  };

  // costToCons( cost, energy_name, elecType, kw ) -----------------------------
  //		estimate consumption from cost, per month
  // parameters
  //		cost: energy fee/cost per month
  //		energy_name: energy code
  //		elecType: type of electricity supply
  //		kw:	contract demand
  // return
  //		cons: energy consumption per month
  costToCons = function (cost, energy_name, elecType, kw) {
    if (typeof kw === "undefined") kw = 0;
    var ret;
    if (cost == -1 || cost == "") {
      ret = "";
    }
    if (energy_name != "electricity" || typeof this.elecPrice == undefined) {
      // not electricity or no regional parameters
      if (cost < this.Unit.priceBase[energy_name] * 2) {
        // estimation in case of nealy intercept price
        ret = cost / this.Unit.price[energy_name] / 2;
      } else {
        // ordinal estimation
        ret = (cost - this.Unit.priceBase[energy_name]) / this.Unit.price[energy_name];
      }
    } else {
      //regional electricity
      elecType = 1;
      var def = this.elecPrice[elecType];
      ret = (cost - kw * def[4] - def[3]) / ((def[1] + def[2]) / 2);
    }
    return ret;
  };

  //consToCost( cons, energy_name, elecType, kw ) -----------------------
  //		estimate cost from energy consumption
  // parameters
  //		cons: energy consumption per month
  //		energy_name: energy code
  //		elecType: type of electricity supply
  //		kw:	contract demand
  // return
  //		cost: energy fee/cost per month, not include intercept price
  consToCost = function (cons, energy_name, elecType, kw) {
    var ret;

    if (cons == -1 || cons == "") {
      ret = "";
    }
    if (energy_name != "electricity" || typeof this.elecPrice == undefined) {
      // this is rough method, multify only unit price
      // it will better to fix regionally
      ret = cons * this.Unit.price[energy_name];
    } else {
      // electricity
      if (elecType < 0 || !elecType) {
        elecType = 1;
      }
      var def = this.elecPrice[elecType];
      ret = kw * def[4] + (cons * (def[1] + def[2])) / 2;
      if (ret > def[3] * 2) {
        ret -= def[3];
      } else {
        ret /= 2;
      }
    }
    return ret;
  };

}

