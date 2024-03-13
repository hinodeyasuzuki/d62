/**
 * Home-Eco Diagnosis for JavaScript
 *
 * view/main.js:  Main Class to use d6 package
 *
 * in this routine, cannot access D6, can access html DOM
 * 	- on loaded action
 * 	- call D6 routine through web-worker
 * 	- callback action by web-worker
 *
 * @author SUZUKI Yasufumi	2016/05/23
 *
 */
import {lang} from "./lang_ja.js";
import {config} from "./config.js";
import {createInputPage,showAverageTable,showItemizeTable,showMeasureTable,showDemandSumupPage,showDemandLogPage,showMeasureTotalMessage,leanModalSet,showModal,tabset,priceRound,comma3,escapeHtml,languageset,base64,over15show } from "./view/createpage.js";
import {graphItemize, graphEnergy, graphCO2average, graphMonthly, graphDemand} from "./view/graph.js";
import {d6facade} from "./view/d6facade.js";
import {modeChange, graphChange, dataSave, dataClear } from "./view/view_base/onclick-base.js";

/*
	1) click function is listed in each view in view/onclick*.js and call startCalc(param, command ) in d6facade.js
	2) startCalc call workerCalc(param, command ) function as web-worker in d6facade.js
	3) d6 functions are written in d6*.js
	4) callback getCalcResult( command, res ) function in main.js or override in view
	
	"command" string is same to "command" 
	
	command/command	action
	start				clear to construct instances and calculate
	addandstart			add one room or equipment and calculate 
	tabclick			change consumption group and prepare questions
	subtabclick			change consumption of subgroup and prepare questions
	inchange			set input parameter and calculate
	inchange_only		set input parameter but not calculate
	quespne_next		go to next question in case of smart phone
	quesone_prev		go to previous question in case of smartp hone
	quesone_set			set input parameter and go to next question in case of smart phone
	recalc				calculate
	pagelist			consumption list which can be select in case of smart phone
	measureadd			adopt measure as selectedlist and calculate
	measuredelete		release measure which is in selectedlist and calculate
	graphchange			change graph type
	add_demand			add equipment to estimate demand
	demand				show demand estimation page with graph
	inchange_demand		usage of equipment in demand estimation is changed and calculate
	action				evaluate action/eco index axis
	modal				show detail result of one measure
	save				save input data to browser
	savenew				save input data -- not installed --
	load				load input data from browser -- not installed --
	common				any type of use
*/



var commandset = {
	start: {
		recalc: true,
		draw_tab: true,
		draw_inputPage: true,
		draw_buttonInputPage: true,
		draw_graphAverage: true,
		draw_tableAverage: true,
		draw_graphMonthly: true,
		draw_graphItemize: true,
		draw_tableMeasures: true
	}
};

var param = {};

//common view set
$(".page").css({ opacity: "0.0" });

// initialize after html and scripts are loaded ========================================
$(document).ready(function () {
	//common start condition design
	$(".preloader").hide();
	$(".contents").show();
	$(".page").css({ opacity: "1" });

	//language setting. function defined in createpage.js
	// in case of semi crypted
	//languageset();

	//no web-worker
	config.useWorker = false;

	//clear measures number limit
	localStorage.removeItem("sindanOver15");

	startInit();
});


//D6 initialize
function startInit() {
	//default setting
	if (typeof paramdata != "undefined" && paramdata) {
		param.rdata = paramdata;
	} else {
		param.rdata = localStorage.getItem("sindan" + config.languageMode + config.targetMode);
		if (config.debugMode) console.log("data loaded from localStorage");
	}

	//start page
	param.consName = config.tabNowName;
	param.subName = config.tabSubNowName;
	param.prohibitQuestions = config.prohibitQuestions; //focus questions
	param.allowedQuestions = config.allowedQuestions;
	param.defInput = typeof defInput == "undefined" ? "" : defInput;
	param.debugMode = config.debugMode ? 1 : 2; //set to D6
	param.viewMode = config.viewMode;
	param.targetMode = config.targetMode;
	param.focusMode = config.focusMode;
	param.countfix_pre_after = lang.countfix_pre_after;

	if (config.debugMode) console.log(param);

	//initialize d6
	if (config.useWorker || typeof D6 != "undefined") {
		startCalc("start", param);
	}
}

// startCalc( command, param )  ---------------------------------------
//		select worker or non-worker function , and start calculation
// parameters
//		param : parameters to calculation ( any type )
//		command : command code (string)
// return
//		none
// set
//		after both web-worker or workercalc, getCalcResult() work to show display
//
function startCalc(command, param) {
	if (config.useWorker) {
		//use worker
		param.targetMode = config.targetMode;

		//call D6.workercalc in d6facade.js as worker
		//after worker getCalcResult() is called
		worker.postMessage({ command: command, param: param });
	} else {
		//not use woker
		D6.targetMode = config.targetMode;

		//directry call function same as worker
		var ret = d6facade(command, param);

		//expressly call getCalcResult()
		getCalcResult(command, ret);
	}
}
window.startCalc = startCalc;

// getCalcResult( command, res ) ----------------------------------------------
//		common page generator
//		call backed by web-worker, called by workercalc in d6facade.js
//		display calculation result
//		in smart phone this is override in design-common/onclick-buttons.js
// parameter
//		command : action code( string ) switch action with this code
//		res : result parameters from worker
// return
//		none
// set
//		none
var getCalcResult = function (command, res) {
	function isset(data) {
		return typeof data != "undefined";
	}

	var inputHtml = "";
	var mestitle = "<h3>" + lang.effectivemeasures + "</h3>";

	switch (command) {
		case "start":
		case "addandstart":
		case "tabclick":
			// display input and result as start mode

			//display tabs, input page
			inputHtml = createInputPage(res.inputPage);
			$("#tab").html(inputHtml.menu);
			$("#tabcontents").html(inputHtml.combo);

			//display results
			$("#average").html(showAverageTable(res.average));
			$("#cons").html(showItemizeTable(res.itemize));
			$("#measure").html(mestitle + showMeasureTable(res.measure));
			leanModalSet();

			//display graph
			graphItemize(res.itemize_graph);
			graphMonthly(res.monthly);

			//tab click method
			$("#tab li").click(function () {
				var index = $("#tab li").index(this);
				var consname = $(this).prop("id");
				tabclick(index, consname);
			});
			$("#tab li").keypress(function (e) {
				if (e.keyCode != 9) {
					var index = $("#tab li").index(this);
					var consname = $(this).prop("id");
					tabclick(index, consname);
				}
			});
			tabset(config.tabNow);

			if (config.showOver15) {
				$("#itemize").removeClass("limit");
			}

			//debug
			if (config.debugMode) {
				console.log("return parameters from d6 worker----");
				console.log(res);
			}
			break;

		case "subtabclick":
			//sub tab click method : main tab is not changed
			inputHtml = createInputPage(res.inputPage);
			$("#tabcontents").html(inputHtml.combo);
			tabset(config.tabNow);

			config.tabSubNowName = res.subName;

			$("ul.submenu li").removeClass("select");
			$("ul.submenu li#" + config.tabNowName + "-" + config.tabSubNowName).addClass("select");

			break;

		case "modal":
			//show modal page for measure detail
			$("#header")[0].scrollIntoView(true);
			leanModalSet();

			//create modal page
			var modalHtml = createModalPage(res.measure_detail);
			$("#modal-contents").html(modalHtml);
			if (typeof modalJoy != "undefined" && modalJoy == 1) {
				$(".modaljoyfull").show();
				$(".modaladvice").hide();
			}
			break;

		case "inchange":
		case "measureadd":
		case "measuredelete":
			//in case of input change

			//change result
			$("#average").html(showAverageTable(res.average));
			$("#cons").html(showItemizeTable(res.itemize));
			graphItemize(res.itemize_graph);
			console.log(res.itemize_graph);
			graphMonthly(res.monthly);

			//change measure list
			$("#measure").html(mestitle + showMeasureTable(res.measure));
			leanModalSet();
			if (config.showOver15) {
				$("#itemize").removeClass("limit");
			}

			//comment
			$("#totalReduceComment").html(showMeasureTotalMessage(res.common));
			break;

		case "measureadd_comment": //view_action,view_easy
			//comment
			$("#totalReduceComment").html(showMeasureTotalMessage(res.common));
			break;

		case "graphchange":
			graphItemize(res.itemize_graph);
			break;

		case "add_demand": //view_base
			$("div#inDemandSumup").html(showDemandSumupPage(res.demandin));
			$("div#inDemandLog").html(showDemandLogPage(res.demandlog));
			break;

		case "demand": //view_base
			$("div#inDemandSumup").html(showDemandSumupPage(res.demandin));
			$("div#inDemandLog").html(showDemandLogPage(res.demandlog));
			graphDemand(res.graphDemand);
			break;

		case "inchange_demand": //view_base
			graphDemand(res.graphDemand);
			break;

		case "evaluateaxis": //view_action
			showEvaluateAxis(res.evaluateAxis);
			if (typeof evaluateaxisNextMode != undefined) {
				modeChange(evaluateaxisNextMode);
			}
			break;

		case "save":
		case "save_noalert":
		case "saveandgo":
			localStorage.setItem("sindan" + languageMode + targetMode, res);
			var resurl = "";
			var url =
				location.protocol +
				"//" +
				location.hostname +
				(location.pathname ? location.pathname : "/");
			var params = location.search;
			if (params) {
				var parray = params.split("data=");
				resurl = url + parray[0] + "&data=" + res;
			} else {
				resurl = url + "?data=" + res;
			}

			if (command == "save") {
				alert(lang.savetobrowser + lang.savedataisshown + "\n" + resurl);
			}
			if (command == "saveandgo") {
				//go to detail design
				if (typeof detailNextDiagnosisCode != undefined) {
					location.href =
						"./?lang=" + languageMode +
						"&v=" + detailNextDiagnosisCode +
						"&intro=-1";
				}
			}
			break;

		case "common":
			result_action(res); //define in each view page as js file
			break;

		default:
	}
	// afterworker(res);
};

//after worker result function. depend on view function. override in each view
// afterworker = function (res) { };

//top page button click to start
function top2start() {
	$("#top").hide();
	$("#divco2").show();
	startCalc("graphchange", param);
}

function showAll(){
	$("table#itemize").removeClass("limit");
}

window.onload = function () {
	$('#top').show();
	$('#divco2').hide();
	$('#btnstart').click(function(){
		top2start();
	});
	$('#showall').click(function(){
		showAll()
	});
	$('#graphChange').change(function(){
		graphChange()
	});
	$('#m1').click(function(){
		modeChange('m1');
	});
	$('#m2').click(function(){
		modeChange('m2');
	});
	$('#btnsave').click(function(){
		dataSave();
	});
	$('#btnclear').click(function(){
		dataClear();
	});

};

