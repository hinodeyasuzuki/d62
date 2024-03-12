/**
 * Home-Eco Diagnosis for JavaScript
 *
 * onlick.js: key input for PC system
 *
 *
 * @author SUZUKI Yasufumi	Hinodeya Insititute for Ecolife.co.ltd. 2016/12/13
 *
 */

// call startCalc in main.js , in order to execute D6.workercalc in d6facade.js
// result is dealed in main.js

import {config} from "../../config.js";


//inchange(id) -----------------------------------------------
// 		set input value and calculate
// parameters
//		id : input ID, "i" + 3-5 number
// set
//		in demand page, execute inchange_demand
//		in other page, execute inchange
window.inchange = function(id) {
	var param = [];
	param.id = id;
	param.consName = config.tabNowName;
	param.val = D6View.escapeHtml($("#" + id).val());
	if (param.val == -1 || param.val === "") {
		$("#" + id).removeClass("written");
	} else {
		$("#" + id).addClass("written");
	}
	if (config.mainTab == "demand") {
		//change demand page setting
		window.startCalc("inchange_demand", param);
	} else {
		window.startCalc("inchange", param);
	}
};

//measureadddelete(mid) ------------------------------------
//		adopt or release measure as selectedlist and calculate
// parameters
//		mid : measure id
// set
//		checked, execute measureadd
//		released, execute measuredelete
window.measureadddelete = function(mid) {
	var param = {};
	param.mid = mid;
	if ($("#messel" + mid).prop("checked")) {
		window.startCalc("measureadd", param);
	} else {
		window.startCalc("measuredelete", param);
	}
};

// addroom( consName ) -----------------------------------------
//		add one room or equipment and calculate
// parameters
//		consName: consumption code of room or equipment
// set
//		in demand page, execute add_demand
//		in other page, execute addandstart
window.addroom = function(consName) {
	var param = {};
	param.rdata = localStorage.getItem("sindan" + targetMode);
	param.consName = consName;
	param.subName = consName;
	if (mainTab == "demand") {
		window.startCalc("add_demand", param);
	} else {
		window.startCalc("addandstart", param);
	}
};

//tabclick( index, consName ) --------------------------------
//		change consumption group and prepare questions
// parameters
//		index :		tab index to highlight
//		consName:  	display consumption code, if not null call D6 to get html
window.tabclick = function(index, consName) {
	tabset(index);

	//in case of change tab
	if (consName) {
		var param = {};
		param.consName = consName;
		param.subName = consName;
		config.tabNowIndex = index;
		config.tabNowName = consName;
		window.startCalc("tabclick", param);
	}
};

//tabset( index ) ------------------------------------------
//		highlight tab
var tabset = function(index) {
	config.tabNow = index;
	//contents
	$("li.inppage").css("display", "none");
	$("li.inppage")
		.eq(index)
		.css("display", "block");
	//tab
	$("#tab>li").removeClass("select");
	$("#tab>li")
		.eq(index)
		.addClass("select");
};

//subtabclick( page, subpage ) --------------------------------
//		change consumption of subgroup and prepare questions
// parameters
//		page :		code of consumption belongs to
//		subpage:  	target consumption code
window.subtabclick = function(page, subpage) {
	var param = {};
	param.consName = page;
	param.subName = subpage;

	window.startCalc("subtabclick", param);
};

//modeChange(id) -------------------------------------------------
//		change display mode
// parameters
//		id : code "m1" to "m3" (string)
var modeChange = function(id) {
	$(".inmode").removeClass("selected");
	$("#" + id).addClass("selected");

	$("#about").css("display", "none");
	$("#divelec").css("display", "none");
	$("#divco2").css("display", "none");
	$("#top").hide();

	var param = {};
	param.consName = config.tabNowName;
	param.subName = config.tabSubNowName;

	if (id == "m1") {
		//input mode
		$("#divco2").css("display", "inline-block");
		$(".leftmenu").css("display", "inline-block");
		$(".result").css("display", "inline-block");
		$(".mesmenu").css("display", "none");
		config.mainTab = "cons";
		config.pageMode = "m1";

		startCalc("tabclick", param);
		tabset(config.tabNowIndex, config.tabNowName);
	} else if (id == "m2") {
		//measures select mode
		$("#divco2").css("display", "inline-block");
		$(".leftmenu").css("display", "none");
		$(".result").css("display", "inline-block");
		$(".mesmenu").css("display", "inline-block");
		config.mainTab = "cons";
		config.pageMode = "m2";
		startCalc("tabclick", param);
		tabset(config.tabNowIndex, config.tabNowName);
	} else if (id == "m4") {
		//about
		$("#about").css("display", "inline-block");
	} else {
		$("#divelec").css("display", "block");
		$(".leftmenu").css("display", "inline-block");
		$(".result").css("display", "inline-block");
		startCalc("demand", "");
		config.mainTab = "demand";
	}
};

//graphChange() -----------------------------------------
// 		change graph type
var graphChange = function() {
	var param = {};
	param.graph = $("#graphChange").val();
	config.graphNow = param.graph;
	startCalc("graphchange", param);
};

//dataSave() -------------------------------------------
//		save input data
var dataSave = function() {
	var param = "";
	window.startCalc("save", param);
};

//dataClear() ------------------------------------------
//		clear saved data, after confirm
var dataClear = function() {
	if (confirm(lang.dataClear)) {
		localStorage.removeItem("sindan" + config.targetMode);
		location.reload();
	}
};


export { modeChange, graphChange, dataSave, dataClear};
