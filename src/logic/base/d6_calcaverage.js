/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * diagnosis.js 
 * 
 * D6 Main Class calc average functions
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2018/03/04 divided as average functions
 * 
 * calcAverage()				get avearage consumption
 * rankIn100()					get rank				
 * 
 */


/*
 * calcAverage()  get avearage consumption ------------------
 *
 * parameters
 *		none
 * return
 *		none
 *
 * set D6.average.consList[]
 *
 */
const calcAverage = function () {
  // 基本は全体だけだが、用途別にも平均値を算出するため
  // 値をでフォルト値にして計算する（灯油だけ補正がかかる）

  this.averageMode = true;			//not use input parameters
  this.calcCons();				//and calculate, then get average
  this.average.consList = {};

  for (var c in this.consShow) {
    this.average.consList[c] = {};
    this.average.consList[c].co2 = this.consShow[c].co2;
    this.average.consList[c].co2Original = this.consShow[c].co2Original;
    this.average.consList[c].electricity = this.consShow[c].electricity;
    this.average.consList[c].gas = this.consShow[c].gas;
    this.average.consList[c].kerosene = this.consShow[c].kerosene;
    this.average.consList[c].car = this.consShow[c].car;
    this.average.consList[c].electricityOriginal = this.consShow[c].electricityOriginal;
    this.average.consList[c].gasOriginal = this.consShow[c].gasOriginal;
    this.average.consList[c].keroseneOriginal = this.consShow[c].keroseneOriginal;
    this.average.consList[c].carOriginal = this.consShow[c].carOriginal;
    this.average.consList[c].water = this.consShow[c].water;
    this.average.consList[c].cost = this.consShow[c].cost;
    this.average.consList[c].costOriginal = this.consShow[c].costOriginal;
    this.average.consList[c].jules = this.consShow[c].jules;
    this.average.consList[c].title = this.consShow[c].title;
    if (c == "TO") {
      this.average.consList[c].priceEle = this.consShow[c].priceEle;
      this.average.consList[c].priceGas = this.consShow[c].priceGas;
      this.average.consList[c].priceKeros = this.consShow[c].priceKeros;
      this.average.consList[c].priceCar = this.consShow[c].priceCar;
    }
  }
  this.averageMode = false;			//standard mode
  //this.calcCons();				//and calculate　単体で呼ばれることはないため不要
};



/* rankIn100(ratio)  calculate rank by ratio to average ------------------
 * 130410うちエコ診断
 *
 * parameters
 *		ratio	ratio to average
 * return
 *		rank 	number 1-100 in 100 
 */
const rankIn100 = function (ratio) {
  let ret;
  let i;
  let th = [0.0, 0.3, 0.5, 0.6, 0.8, 1.0, 1.3, 1.5, 1.8, 2.1, 2.4, 3.0, 4.0];
  let thrank = [0.50, 0.99, 4.68, 9.63, 27.32, 50, 71.86, 81.96, 91.01, 95.47, 97.56, 99.34, 100.19];

  if (ratio < th[0]) {
    ret = 1;
    return ret;
  }

  //4倍以上初期値
  ret = 100;

  for (i = 1; i < th.length; i++) {
    if (ratio < th[i]) {
      ret = ((ratio - th[i - 1]) * thrank[i] + (th[i] - ratio) * thrank[i - 1])
        / (th[i] - th[i - 1]);
      break;
    }
  }

  return Math.round(ret);
};

export { calcAverage, rankIn100 };


