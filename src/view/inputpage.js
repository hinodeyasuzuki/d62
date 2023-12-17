/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_getinput.js 
 * 
 * display data create add to this.disp class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2016/11/23 divided from js
 * 
 * getInputPage()		create html input pages
 * createComboBox()		combo box component
 * createTextArea()		textarea component
 * 
 * getFirstQues()		step by step question
 * getNextQues()
 * getPrevQues()
 * getQues()
 * getQuesList()
 * isEndOfQues()
 *
 * escapeHtml()
 */

import { D6 } from "../d6.js";

// getInputPage(consName,subName ) -----------------------------------------
//		generate html components
// parameters
//		consName : 		consumption code
//		subName:		sub consumption code
// return 
//		ret.group[] 		name of group
//		ret.groupAddable[] 	countable consumption list such as rooms/equipments 
//		ret.subgroup[] 		subgroup detail
//		ret.subguide[] 		subgroup input guidance
//		ret.combos[] 		input components html list
//		ret.addlist[]		addable equipment/room list
//
const getInputPage = function (consName, subName) {
  let ret = {};
  let group = {};			//group name
  let groupAddable = {};		//countable consumption list such as rooms/equipments
  let subgroup = {};			//name of subgroup
  let subguide = {};			//guidance to input for subgroup
  let combos = {};			//input combobox html
  let definp;
  //let pagename;
  let subid = 0;
  let subcode = "";
  let cons = "";
  let addlist = {};

  //create input data for smartphone 
  for (let c in this.scenario.defEasyQues) {
    let q = this.scenario.defEasyQues[c];
    subcode = q.cname;
    group[q.cname] = q.title;
    groupAddable[q.cname] = {};
    addlist[q.cname] = {};
    subgroup[q.cname] = {};
    subguide[q.cname] = {};
    combos[q.cname] = {};
    subguide[q.cname][subcode] = {};
    combos[q.cname][subcode] = [];

    //only same to consName
    for (let i in q.ques) {
      definp = this.scenario.defInput[q.ques[i]];
      if (!definp && this.debugMode) console.log("defEasyQues error no " + q.ques[i] + " in scenarioset");
      subgroup[q.cname][subcode] = q.title;
      subguide[q.cname][subcode] = "";
      if (definp.letType == "String") {
        combos[q.cname][subcode].push(this.createTextArea(q.ques[i]));
      } else {
        combos[q.cname][subcode].push(this.createComboBox(q.ques[i]));
      }
    }
  }

  //create input data for PC
  for (let c in this.consShow) {
    //check all consumption 
    let cname = this.consShow[c].consName;
    group[cname] = this.consShow[c].title;
    groupAddable[cname] = [];
    addlist[cname] = [];
    subgroup[cname] = {};
    subguide[cname] = {};
    combos[cname] = {};

    // all check in doc.data.defInput[]
    for (let i in this.doc.data) {
      definp = this.scenario.defInput[i.substr(0, 4)];
      cons = this.logicList[definp.cons];

      // condition to add this.cons 
      if (cons.consName == cname
        || (cons.sumConsName == cname
          && cons.sumConsName != "consTotal"
        )
        || (cons.sumCons2Name == cname
          && cons.sumCons2Name != "consTotal"
        )
        || cons.inputDisp == cname
      ) {
        if (i.length == 4) {	//consumption name is 4 or more length
          //not countable 
          subid = 0;
          subcode = cons.consName;
        } else {
          //countable
          subid = i.substr(4, 2);
          if (subid == 0) continue;
          subcode = cons.consName + subid;
        }

        //make subgroup 
        if (subgroup[cname][subcode] == undefined) {
          if (subid == 0) {
            subgroup[cname][subcode] = cons.title;
          } else {
            if (D6.viewparam.countfix_pre_after == 1) {
              subgroup[cname][subcode] = cons.countCall + (cons.titleList ? cons.titleList[subid] : subid);
            } else {
              subgroup[cname][subcode] = (cons.titleList ? cons.titleList[subid] : subid) + cons.countCall;
            }
          }
          subguide[cname][subcode] = cons.inputGuide;
          combos[cname][subcode] = [];
        }

        // make addlist such as countable equipment or room  
        if (cons.addable) {
          if (addlist[cname].indexOf(cons.consName) < 0) {
            addlist[cname].push(cons.consName);
            groupAddable[cname].push(
              {
                "consName": cons.consName,
                "caption": cons.addable
              });
          }
        }

        if (consName != cname) continue;

        //create combobox
        if (definp.letType == "String") {
          combos[cname][subcode].push(this.createTextArea(i));
        } else {
          combos[cname][subcode].push(this.createComboBox(i));
        }
      }
    }
  }

  //set return data
  ret.group = group;
  ret.groupAddable = groupAddable;
  ret.subgroup = subgroup;
  ret.subguide = subguide;
  ret.combos = combos;
  ret.consName = consName;
  if (!this.logicList[consName]) consName = "consTotal";
  ret.title = this.logicList[consName].title;
  ret.subName = subName;
  return ret;
};


//createComboBox(inpId, onlyCombo) --------------------------------
//		create combobox html
// parameters
//		inpId : input code "i" + number
//		onlyCombo : create only combobox and not wrap table style
// return
//		disp : combobox html
const createComboBox = function (inpId, onlyCombo) {
  let disp = "";
  let selid = "sel" + inpId.substr(1, 3);
  let inpIdDef = inpId.substr(0, 4);
  let svalue = this.scenario.defSelectValue[selid];
  let sdata = this.scenario.defSelectData[selid];

  if (!sdata || sdata[0] == "") {
    // in case of selection is not defined
    return this.createTextArea(inpId, onlyCombo);
  }
  let smax = svalue.length;
  let sel = this.doc.data[inpId];
  let selectedclass = (sel != -1) ? " class='written' " : "";

  let title = this.scenario.defInput[inpIdDef].title;
  // not to show defined in EXCEL
  if (title == "" || title.substr(0, 1) == "#") return "";

  if (!onlyCombo) {
    // create as table include question
    disp += "<tr><td class='qtitle' width='50%'>";
    disp += title;
    disp += "<div class='tool-tips'>" + this.scenario.defInput[inpIdDef].text
      + (this.debugMode ? " " + inpId : "") + "</div>";
    disp += "</td><td>";
  }

  //create combobox(select)
  disp += "<select title='" + this.scenario.defInput[inpIdDef].title + "' name='" + inpId + "' id='" + inpId + "'";
  disp += " onchange='inchange(\"" + inpId + "\");'";
  disp += selectedclass;
  disp += " >";
  for (let i = 0; i < smax; i++) {
    if (svalue[i]) {
      disp += "<option value='" + sdata[i] + "' ";
      if (sdata[i] == sel) disp += "selected ";
      disp += ">" + (this.debugMode ? sdata[i] + " " : "") + svalue[i] + "</option>";
    }
  }
  disp += "</select>";

  if (!onlyCombo) {
    disp += "</td></tr>";
  }
  return disp;
};

// createTextArea( inpId, onlyCombo ) -----------------------------------
// 		create text input html
// parameters
//		inpId : input code "i" + number
//		onlyCombo : create only textbox and not wrap table style
// return
//		disp : textbox html
const createTextArea = function (inpId, onlyCombo) {
  let disp = "";
  let selid = "sel" + inpId.substr(1, 3);
  let inpIdDef = inpId.substr(0, 4);
  let val = this.doc.data[inpId];
  let selectedclass = (val != "" && val != -1) ? " class='written' " : "";
  let alignright = (this.scenario.defInput[inpIdDef].letType == "Number");

  if (!onlyCombo) {
    disp += "<tr><td class='qtitle'>";
    disp += this.scenario.defInput[inpIdDef].title;
    disp += "<div class='tool-tips' >" + this.scenario.defInput[inpIdDef].text
      + (this.debugMode ? " " + inpId : "") + "</div>";
    disp += "</td><td>";
  }

  disp += "<input type='text' title='" + this.scenario.defInput[inpIdDef].title + "' name='" + inpId + "' id='" + inpId + "' " + selectedclass
    + (alignright ? "style='text-align:right;'" : "")
    + " onchange='inchange(\"" + inpId + "\");'"
    + (val && val != -1 ? " value='" + this.escapeHtml(val) + "'" : "")
    + ">";

  if (!onlyCombo) {
    disp += this.scenario.defInput[inpIdDef].unit + "</td></tr>";
  }
  return disp;
};


// tfHandlerCombo( name ) ------------------------------------------------
//		set data to Input[] from combobox
const tfHandlerCombo = function (name) {
  return function (e) {
    Input[name] = e.target.value;
    e.target.removeEventListener(Event.ENTER_FRAME, arguments.callee);
  };
};


//getFirstQues() --------------------------------------------
//		return first question data, for smartphone
const getFirstQues = function (consName, subName) {
  let definp;

  if (consName == "easy01") {
    if (Array.isArray(subName)) {
      this.quesOrder = subName;
    } else {
      this.quesOrder = this.scenario.defQuesOrder;
    }
  } else {
    for (let i in this.doc.data) {
      definp = this.scenario.defInput[i.substr(0, 4)];
      if (definp.cons == subName) {
        this.quesOrder.push(i);
      }
    }
  }
  this.nowQuesID = 0;
  this.nowQuesCode = this.quesOrder[this.nowQuesID];
  return this.getQues(this.nowQuesCode);
};


//getNextQues() --------------------------------------------
//		return next question data, for smartphone
const getNextQues = function () {
  this.nowQuesID++;
  this.nowQuesCode = this.quesOrder[this.nowQuesID];
  return this.getQues(this.nowQuesCode);
};

//getPrevQues() --------------------------------------------
//		return previous question data, for smartphone
const getPrevQues = function () {
  this.nowQuesID--;
  if (this.nowQuesID < 0) this.nowQuesID = 0;
  this.nowQuesCode = this.quesOrder[this.nowQuesID];

  return this.getQues(this.nowQuesCode);
};

// getQues(id) ------------------------------------------------
//		create one question data, for smartphone
// parameters
//		id: input code "i" + number
// return
//		ret.info	"continue" or "end"
//		ret.id		input code
//		ret.numques	number of series of question
//		ret.nowques	now number of questions
//		ret.title	question title
//		ret.text	question detail
//		ret.unit	unit of data
//		ret.defSelectValue		list of selection caption
//		ret.defSelectData		list of data
//		ret.selected			selected value
//		ret.consTitle			related consumption name
const getQues = function (id) {
  let ret = {};
  if (this.isEndOfQues()) {
    ret.info = "end";
  } else {
    ret.info = "continue";
    ret.id = id;
    ret.numques = this.quesOrder.length;
    ret.nowques = this.nowQuesID + 1;

    let def = this.scenario.defInput[id.substr(0, 4)];
    ret.title = def.title;
    ret.text = def.text;
    ret.unit = def.unit;

    let sel = def.inputType;
    ret.defSelectValue = this.scenario.defSelectValue[sel];
    ret.defSelectData = this.scenario.defSelectData[sel];
    ret.selected = this.doc.data[id];
    ret.consTitle = this.logicList[def.cons].title;
  }
  return ret;
};

// getQuesList( ) -----------------------------------------
//		get question list and data
// return 
//		ret.queslist[] 		question list
//
const getQuesList = function () {
  let ret = [];
  ret.queslist = this.doc.data;
  return ret;
};

// isEndOfQues() --------------------------------------------
//		check if end of series of questions, for smartphone
// return
//		true: end of question 
const isEndOfQues = function () {
  let ret = false;
  if (this.nowQuesID + 1 > this.quesOrder.length) {
    ret = true;
  }
  return ret;
};

// escapeHtml() ----------------------------------------------
//		sanitize input
//
const escapeHtml = function (String) {
  let escapeMap = {
    '&': '&amp;',
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  };
  let escapeReg = "[";
  let reg;
  for (let p in escapeMap) {
    if (escapeMap.hasOwnProperty(p)) {
      escapeReg += p;
    }
  }
  escapeReg += "]";
  reg = new RegExp(escapeReg, "g");
  return function escapeHtml(str) {
    str = (str === null || str === undefined) ? "" : "" + str;
    return str.replace(reg, function (match) {
      return escapeMap[match];
    });
  };
}(String);

export { getInputPage, createComboBox, createTextArea, tfHandlerCombo, getFirstQues, getNextQues, getPrevQues, getQues, getQuesList, isEndOfQues, escapeHtml };

