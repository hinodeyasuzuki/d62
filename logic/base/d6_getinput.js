/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * disp_input.js 
 * 
 * display data create add to D6.disp class
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

//resolve D6
var D6 = D6 || {};

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
D6.getInputPage = function (consName, subName) {
	var ret = {};
	var group = {};			//group name
	var groupAddable = {};		//countable consumption list such as rooms/equipments
	var subgroup = {};			//name of subgroup
	var subguide = {};			//guidance to input for subgroup
	var combos = {};			//input combobox html
	var definp;
	//var pagename;
	var subid = 0;
	var subcode = "";
	var cons = "";
	var addlist = {};

	//create input data for smartphone 
	for (var c in D6.scenario.defEasyQues) {
		var q = D6.scenario.defEasyQues[c];
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
		for (var i in q.ques) {
			definp = D6.scenario.defInput[q.ques[i]];
			if (!definp && D6.debugMode) console.log("defEasyQues error no " + q.ques[i] + " in scenarioset");
			subgroup[q.cname][subcode] = q.title;
			subguide[q.cname][subcode] = "";
			if (definp.varType == "String") {
				combos[q.cname][subcode].push(this.createTextArea(q.ques[i]));
			} else {
				combos[q.cname][subcode].push(this.createComboBox(q.ques[i]));
			}
		}
	}

	//create input data for PC
	for (var c in D6.consShow) {
		//check all consumption 
		var cname = D6.consShow[c].consName;
		group[cname] = D6.consShow[c].title;
		groupAddable[cname] = [];
		addlist[cname] = [];
		subgroup[cname] = {};
		subguide[cname] = {};
		combos[cname] = {};

		// all check in doc.data.defInput[]
		for (var i in D6.doc.data) {
			definp = D6.scenario.defInput[i.substr(0, 4)];
			cons = D6.logicList[definp.cons];

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
				if (definp.varType == "String") {
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
	if (!D6.logicList[consName]) consName = "consTotal";
	ret.title = D6.logicList[consName].title;
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
D6.createComboBox = function (inpId, onlyCombo) {
	var disp = "";
	var selid = "sel" + inpId.substr(1, 3);
	var inpIdDef = inpId.substr(0, 4);
	var svalue = D6.scenario.defSelectValue[selid];
	var sdata = D6.scenario.defSelectData[selid];

	if (!sdata || sdata[0] == "") {
		// in case of selection is not defined
		return this.createTextArea(inpId, onlyCombo);
	}
	var smax = svalue.length;
	var sel = D6.doc.data[inpId];
	var selectedclass = (sel != -1) ? " class='written' " : "";

	var title = D6.scenario.defInput[inpIdDef].title;
	// not to show defined in EXCEL
	if (title == "" || title.substr(0, 1) == "#") return "";

	if (!onlyCombo) {
		// create as table include question
		disp += "<tr><td class='qtitle' width='50%'>";
		disp += title;
		disp += "<div class='tool-tips'>" + D6.scenario.defInput[inpIdDef].text
			+ (D6.debugMode ? " " + inpId : "") + "</div>";
		disp += "</td><td>";
	}

	//create combobox(select)
	disp += "<select title='" + D6.scenario.defInput[inpIdDef].title + "' name='" + inpId + "' id='" + inpId + "'";
	disp += " onchange='inchange(\"" + inpId + "\");'";
	disp += selectedclass;
	disp += " >";
	for (var i = 0; i < smax; i++) {
		if (svalue[i]) {
			disp += "<option value='" + sdata[i] + "' ";
			if (sdata[i] == sel) disp += "selected ";
			disp += ">" + (D6.debugMode ? sdata[i] + " " : "") + svalue[i] + "</option>";
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
D6.createTextArea = function (inpId, onlyCombo) {
	var disp = "";
	var selid = "sel" + inpId.substr(1, 3);
	var inpIdDef = inpId.substr(0, 4);
	var val = D6.doc.data[inpId];
	var selectedclass = (val != "" && val != -1) ? " class='written' " : "";
	var alignright = (D6.scenario.defInput[inpIdDef].varType == "Number");

	if (!onlyCombo) {
		disp += "<tr><td class='qtitle'>";
		disp += D6.scenario.defInput[inpIdDef].title;
		disp += "<div class='tool-tips' >" + D6.scenario.defInput[inpIdDef].text
			+ (D6.debugMode ? " " + inpId : "") + "</div>";
		disp += "</td><td>";
	}

	disp += "<input type='text' title='" + D6.scenario.defInput[inpIdDef].title + "' name='" + inpId + "' id='" + inpId + "' " + selectedclass
		+ (alignright ? "style='text-align:right;'" : "")
		+ " onchange='inchange(\"" + inpId + "\");'"
		+ (val && val != -1 ? " value='" + this.escapeHtml(val) + "'" : "")
		+ ">";

	if (!onlyCombo) {
		disp += D6.scenario.defInput[inpIdDef].unit + "</td></tr>";
	}
	return disp;
};


// tfHandlerCombo( name ) ------------------------------------------------
//		set data to Input[] from combobox
D6.tfHandlerCombo = function (name) {
	return function (e) {
		Input[name] = e.target.value;
		e.target.removeEventListener(Event.ENTER_FRAME, arguments.callee);
	};
};


// parameters used in button view
D6.nowQuesCode = 0;		//now question code "i" + num
D6.nowQuesID = -1;			//now index in series of questions
D6.quesOrder = [];			//question code list

//getFirstQues() --------------------------------------------
//		return first question data, for smartphone
D6.getFirstQues = function (consName, subName) {
	var definp;

	if (consName == "easy01") {
		if (Array.isArray(subName)) {
			this.quesOrder = subName;
		} else {
			this.quesOrder = D6.scenario.defQuesOrder;
		}
	} else {
		for (var i in D6.doc.data) {
			definp = D6.scenario.defInput[i.substr(0, 4)];
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
D6.getNextQues = function () {
	this.nowQuesID++;
	this.nowQuesCode = this.quesOrder[this.nowQuesID];
	return this.getQues(this.nowQuesCode);
};

//getPrevQues() --------------------------------------------
//		return previous question data, for smartphone
D6.getPrevQues = function () {
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
D6.getQues = function (id) {
	var ret = {};
	if (this.isEndOfQues()) {
		ret.info = "end";
	} else {
		ret.info = "continue";
		ret.id = id;
		ret.numques = this.quesOrder.length;
		ret.nowques = this.nowQuesID + 1;

		var def = D6.scenario.defInput[id.substr(0, 4)];
		ret.title = def.title;
		ret.text = def.text;
		ret.unit = def.unit;

		var sel = def.inputType;
		ret.defSelectValue = D6.scenario.defSelectValue[sel];
		ret.defSelectData = D6.scenario.defSelectData[sel];
		ret.selected = D6.doc.data[id];
		ret.consTitle = D6.logicList[def.cons].title;
	}
	return ret;
};

// getQuesList( ) -----------------------------------------
//		get question list and data
// return 
//		ret.queslist[] 		question list
//
D6.getQuesList = function () {
	var ret = [];
	ret.queslist = D6.doc.data;
	return ret;
};

// isEndOfQues() --------------------------------------------
//		check if end of series of questions, for smartphone
// return
//		true: end of question 
D6.isEndOfQues = function () {
	var ret = false;
	if (this.nowQuesID + 1 > this.quesOrder.length) {
		ret = true;
	}
	return ret;
};

// escapeHtml() ----------------------------------------------
//		sanitize input
//
D6.escapeHtml = function (String) {
	var escapeMap = {
		'&': '&amp;',
		"'": '&#x27;',
		'`': '&#x60;',
		'"': '&quot;',
		'<': '&lt;',
		'>': '&gt;'
	};
	var escapeReg = "[";
	var reg;
	for (var p in escapeMap) {
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


