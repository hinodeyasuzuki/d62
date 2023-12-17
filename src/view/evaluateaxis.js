/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_getevaluateaxis.js 
 * 
 * evaluate multi dimension Class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2017/11/06 original ActionScript3
 */


// getEvaluateAxisPoint()
//
// parameters
// 		target : dummy
//		inpListDefCode: evaluate target Input List
// return
//		 [0-2][point, max, min ]
//
// value base is  this.doc.data[inName]
// weight is defined in this.scenario.defInput[inName]
//
const getEvaluateAxisPoint = function (target, inpListDefCode) {
  //calc environmental load, performance, action points
  let retall = {};
  retall[0] = [0, "", ""];
  retall[1] = [0, "", ""];
  retall[2] = [0, "", ""];

  let def = [];
  for (let d in this.scenario.defEasyQues) {
    if (this.scenario.defEasyQues[d].cname == inpListDefCode) {
      def = this.scenario.defEasyQues[d].ques;
      break;
    }
  }
  if (def == "") return retall;

  //calculate point of 3 axis
  for (let i = 0; i < 3; i++) {
    let pointfull = 0;
    let point = 0;
    let maxpoint = 0;
    let maxname = "";
    let minpoint = 0;
    let minname = "";
    let maxpoint2 = 0;
    let maxname2 = "";
    let minpoint2 = 0;
    let minname2 = "";
    //let tmax = 0;
    let defaultvalue = 0;
    let thispoint = 0;

    for (let incode in def) {
      //incode : input code
      let weight = this.scenario.defInput[def[incode]];
      let ans = this.doc.data[def[incode]];
      let weightone = weight["d" + (i + 1) + "w"];
      if (weightone == "") continue;

      defaultvalue = weight["d" + (i + 1) + "d"] * weightone;

      //no answer
      if (ans == weight.defaultValue || ans === undefined) {
        //point += defaultvalue;
        continue;
      }

      //evaluate total point
      pointfull += weightone * 2;

      //point
      if (ans >= weight["d" + (i + 1) + "1t"]) {
        thispoint = weight["d" + (i + 1) + "1p"] * weightone;

      } else if (weight["d" + (i + 1) + "2t"] != "" && ans >= weight["d" + (i + 1) + "2t"]) {
        thispoint = weight["d" + (i + 1) + "2p"] * weightone;

      } else if (weight["d" + (i + 1) + "3t"] != "" && ans >= weight["d" + (i + 1) + "3t"]) {
        thispoint = weight["d" + (i + 1) + "3p"] * weightone;

      } else {
        thispoint = 0;
      }

      if (maxpoint2 < thispoint) {
        maxpoint2 = thispoint;
        maxname2 = weight.title;
        if (maxpoint < maxpoint2) {
          maxpoint2 = maxpoint;
          maxname2 = maxname;
          maxpoint = thispoint;
          maxname = weight.title;
        }
      }
      if (minpoint2 > thispoint - weightone * 2) {
        minpoint2 = thispoint - weightone * 2;
        minname2 = weight.title;
        if (minpoint > minpoint2) {
          minpoint2 = minpoint;
          minname2 = minname;
          minpoint = thispoint;
          minname = weight.title;
        }
      }
      point += thispoint;
    }
    retall[i][0] = point / (pointfull == 0 ? 1 : pointfull) * 100;
    retall[i][1] = (maxname ? "<li>" + maxname + "</li>" : "") + (maxname2 ? "<li>" + maxname2 + "</li>" : "");
    retall[i][2] = (minname ? "<li>" + minname + "</li>" : "") + (minname2 ? "<li>" + minname2 + "</li>" : "");;
  }
  return retall;
};

export { getEvaluateAxisPoint };