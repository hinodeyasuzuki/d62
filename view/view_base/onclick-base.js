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

//inchange(id) -----------------------------------------------
// 		set input value and calculate
// parameters
//		id : input ID, "i" + 3-5 number
// set
//		in demand page, execute inchange_demand
//		in other page, execute inchange
inchange = function(id) {
	var param = [];
	param.id = id;
	param.consName = tabNowName;
	param.val = escapeHtml($("#" + id).val());
	if (param.val == -1 || param.val === "") {
		$("#" + id).removeClass("written");
	} else {
		$("#" + id).addClass("written");
	}
	if (mainTab == "demand") {
		//change demand page setting
		startCalc("inchange_demand", param);
	} else {
		startCalc("inchange", param);
	}
};

//measureadddelete(mid) ------------------------------------
//		adopt or release measure as selectedlist and calculate
// parameters
//		mid : measure id
// set
//		checked, execute measureadd
//		released, execute measuredelete
measureadddelete = function(mid) {
	var param = {};
	param.mid = mid;
	if ($("#messel" + mid).prop("checked")) {
		startCalc("measureadd", param);
	} else {
		startCalc("measuredelete", param);
	}
};

// addroom( consName ) -----------------------------------------
//		add one room or equipment and calculate
// parameters
//		consName: consumption code of room or equipment
// set
//		in demand page, execute add_demand
//		in other page, execute addandstart
addroom = function(consName) {
	var param = {};
	param.rdata = localStorage.getItem("sindan" + targetMode);
	param.consName = consName;
	param.subName = consName;
	if (mainTab == "demand") {
		startCalc("add_demand", param);
	} else {
		startCalc("addandstart", param);
	}
};

//tabclick( index, consName ) --------------------------------
//		change consumption group and prepare questions
// parameters
//		index :		tab index to highlight
//		consName:  	display consumption code, if not null call D6 to get html
tabclick = function(index, consName) {
	tabset(index);

	//in case of change tab
	if (consName) {
		var param = {};
		param.consName = consName;
		param.subName = consName;
		tabNowIndex = index;
		tabNowName = consName;
		startCalc("tabclick", param);
	}
};

//tabset( index ) ------------------------------------------
//		highlight tab
tabset = function(index) {
	tabNow = index;
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
subtabclick = function(page, subpage) {
	var param = {};
	param.consName = page;
	param.subName = subpage;

	startCalc("subtabclick", param);
};

//modeChange(id) -------------------------------------------------
//		change display mode
// parameters
//		id : code "m1" to "m3" (string)
modeChange = function(id) {
	$(".inmode").removeClass("selected");
	$("#" + id).addClass("selected");

	$("#about").css("display", "none");
	$("#divelec").css("display", "none");
	$("#divco2").css("display", "none");
	$("#top").hide();

	var param = {};
	param.consName = tabNowName;
	param.subName = tabSubNowName;

	if (id == "m1") {
		//input mode
		$("#divco2").css("display", "inline-block");
		$(".leftmenu").css("display", "inline-block");
		$(".result").css("display", "inline-block");
		$(".mesmenu").css("display", "none");
		mainTab = "cons";
		pageMode = "m1";

		startCalc("tabclick", param);
		tabset(tabNowIndex, tabNowName);
	} else if (id == "m2") {
		//measures select mode
		$("#divco2").css("display", "inline-block");
		$(".leftmenu").css("display", "none");
		$(".result").css("display", "inline-block");
		$(".mesmenu").css("display", "inline-block");
		mainTab = "cons";
		pageMode = "m2";
		startCalc("tabclick", param);
		tabset(tabNowIndex, tabNowName);
	} else if (id == "m4") {
		//about
		$("#about").css("display", "inline-block");
	} else {
		$("#divelec").css("display", "block");
		$(".leftmenu").css("display", "inline-block");
		$(".result").css("display", "inline-block");
		startCalc("demand", "");
		mainTab = "demand";
	}
};

//graphChange() -----------------------------------------
// 		change graph type
graphChange = function() {
	var param = {};
	param.graph = $("#graphChange").val();
	graphNow = param.graph;
	startCalc("graphchange", param);
};

//dataSave() -------------------------------------------
//		save input data
dataSave = function() {
	var param = "";
	startCalc("save", param);
};

//dataClear() ------------------------------------------
//		clear saved data, after confirm
dataClear = function() {
	if (confirm(lang.dataClear)) {
		localStorage.removeItem("sindan" + targetMode);
		location.reload();
	}
};

/*
	//save new
	$("#btnsavenew").click(
		function(){
			var param = "";
			startCalc( "savenew", param );
		}
	);

	//load
	$("#btnload").click(
		function(){
			var param = "";
			startCalc( "load", param );
		}
	);
*/
