/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_calcmonthly.js 
 * 
 * D6 Monthly Class, calculate season or monthly difference
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2012/08/20 created as ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 */

import { costToCons } from "../areaset/unit";

const calcMonthly = function (ave, season, monthly, seasonPatternP, energyCode) {
  // first use monthly, season
  // next  use seasonPattern

  let month2season = [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 0];
  let seasonPatternCons = [0, 0, 0];	//winter, spring, summer
  let seasonPattern = [0, 0, 0];
  let seasonCount = [0, 0, 0];
  let seasonCons = [0, 0, 0];
  //let monthlyCons = [];
  let i;
  let noConsData = true;

  //estimate season pattern by monthly consumption
  let sumCons = 0;
  let countCons = 0;
  for (i = 0; i < 12; i++) {
    if (monthly[i] != -1) {
      seasonPatternCons[month2season[i]] += monthly[i];
      seasonCount[month2season[i]]++;
      sumCons += monthly[i];
      countCons++;
      noConsData = false;
    }
  }

  //seasonal weight
  if (seasonCount[0] > 0 && seasonCount[1] > 0 && seasonCount[2] > 0) {
    //monthly consumption has priority to calculate
    seasonPattern[0] = seasonPatternCons[0] / seasonCount[0];
    seasonPattern[1] = seasonPatternCons[1] / seasonCount[1];
    seasonPattern[2] = seasonPatternCons[2] / seasonCount[2];
  } else if (season[0] != -1 && season[1] != -1 && season[2] != -1) {
    //all seasonal value is set
    seasonPattern[0] = season[0];
    seasonPattern[1] = season[1];
    seasonPattern[2] = season[2];
  } else if (seasonPatternP) {
    //not all season value is set
    seasonPattern = seasonPatternP;
  } else {
    //no data is set
    seasonPattern = [1, 1, 1];
  }

  //normalize seasonal parameters
  let sum = seasonPattern[0] * 4 + seasonPattern[1] * 5 + seasonPattern[2] * 3;
  if (sum != 0) {
    seasonPattern[0] *= 12 / sum;
    seasonPattern[1] *= 12 / sum;
    seasonPattern[2] *= 12 / sum;
  }

  //calculate seasonal fee
  if (season[0] == -1 && season[1] == -1 && season[2] == -1) {
    //no data
    if (countCons > 6) {
      ave = this.consToCost(sumCons / countCons, energyCode);
    }
    //calculate from average consumption
    season[0] = ave * seasonPattern[0];
    season[1] = ave * seasonPattern[1];
    season[2] = ave * seasonPattern[2];
  } else {
    //calculate from seasonal data
    noConsData = false;
    let ave2 = 0;
    let ave2count = 0;
    for (i = 0; i < 3; i++) {
      if (seasonPattern[i] != 0) {
        if (season[i] != -1) {
          ave2 += season[i] / seasonPattern[i];
          ave2count++;
        } else if (seasonCount[i] >= 1) {
          season[i] = this.consToCost(seasonPatternCons[i] / seasonCount[i], energyCode);
          ave2 += season[i] / seasonPattern[i];
          ave2count++;
        }
      } else {
        //not use is effiective data
        ave2count++;
      }
    }

    ave2 /= ave2count;
    ave = ave2;
    season[0] = (season[0] == -1 ? ave * seasonPattern[0] : season[0]);
    season[1] = (season[1] == -1 ? ave * seasonPattern[1] : season[1]);
    season[2] = (season[2] == -1 ? ave * seasonPattern[2] : season[2]);
  }

  //estimate monthly consumption
  seasonCons[0] = costToCons(season[0], energyCode);
  seasonCons[1] = costToCons(season[1], energyCode);
  seasonCons[2] = costToCons(season[2], energyCode);

  //set to monthly data
  let sim, si, sip;
  for (i = 0; i < 12; i++) {
    if (monthly[i] == -1) {
      sim = month2season[(i + 12 - 1) % 12];
      si = month2season[i];
      sip = month2season[(i + 1) % 12];
      monthly[i] = (season[sim] + season[si] + season[sip]) / 3;
    }
  }

  //return value set
  let ret = [];
  ret.ave = ave;
  ret.season = season;
  ret.seasonCons = seasonCons;
  ret.monthly = monthly;
  ret.noConsData = noConsData;

  return ret;
};

export { calcMonthly };