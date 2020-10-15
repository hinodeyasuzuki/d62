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

//worker parameters
var worker = "";
var param = "";

//display state initialize
var tabNow = "";

var tabNowName = "easy01"; // default page
var tabSubNowName = "easy01"; // default sub page
var showPageName = lang.startPageName; // title of default page
var tabSubNow = tabNowName + "-" + tabSubNowName;
var showOver15 = false;

var tabNowIndex = 0;
var tabSubNowCode = "";

var graphNow = "co2"; // graph unit, "co2", "jules" or "price"
var mainTab = "cons"; // main tab mode , "cons" or "demand"
var pageMode = "m1"; // "m1":input page ,"m2":measures page

// diagnosis question and measures,  set in localize_*/focussetting
var prohibitQuestions = [];
var allowedQuestions = [];
var prohibitMeasures = [];
var allowedMeasures = [];

//common view set
$(".page").css({ opacity: "0.0" });

// start parameters set depend on views
onloadStartParamsSet = function(param) {
	return param;
};

// enable to use worker in local environment
var newWorker = function(relativePath) {
	try {
		return newWorkerViaBlob(relativePath);
	} catch (e) {
		return new Worker(relativePath);
	}
};

// initialize after html and scripts are loaded ========================================
$(document).ready(function() {
	//common start condition design
	$(".preloader").hide();
	$(".contents").show();
	$(".page").css({ opacity: "1" });

	//language setting. function defined in createpage.js
	languageset();

	//no web-worker
	useWorker = false;

	//clear measures number limit
	localStorage.removeItem("sindanOver15");

	startInit();
});

//D6 initialize
function startInit() {
	//default setting
	var param = {};
	if (typeof paramdata != "undefined" && paramdata) {
		param.rdata = paramdata;
	} else {
		param.rdata = localStorage.getItem("sindan" + languageMode + targetMode);
		if (debugMode) console.log("data loaded from localStorage");
	}

	//start page
	param.consName = tabNowName;
	param.subName = tabSubNowName;
	param.prohibitQuestions = prohibitQuestions; //focus questions
	param.allowedQuestions = allowedQuestions;
	param.defInput = typeof defInput == "undefined" ? "" : defInput;
	param.debugMode = debugMode ? 1 : 2; //set to D6
	param.viewMode = viewMode;
	param.targetMode = targetMode;
	param.focusMode = focusMode;
	param.countfix_pre_after = lang.countfix_pre_after;

	if (debugMode) console.log(param);

	//initialize d6
	if (useWorker || typeof D6 != "undefined") {
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
	if (useWorker) {
		//use worker
		param.targetMode = targetMode;

		//call D6.workercalc in d6facade.js as worker
		//after worker getCalcResult() is called
		worker.postMessage({ command: command, param: param });
	} else {
		//not use woker
		D6.targetMode = targetMode;

		//directry call function same as worker
		var ret = D6.workercalc(command, param);

		//expressly call getCalcResult()
		getCalcResult(command, ret);
	}
}

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
getCalcResult = function(command, res) {
	function isset(data) {
		return typeof data != "undefined";
	}

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
		$("#tab li").click(function() {
			var index = $("#tab li").index(this);
			var consname = $(this).prop("id");
			tabclick(index, consname);
		});
		$("#tab li").keypress(function(e) {
			if (e.keyCode != 9) {
				var index = $("#tab li").index(this);
				var consname = $(this).prop("id");
				tabclick(index, consname);
			}
		});
		tabset(tabNow);

		if (showOver15) {
			$("#itemize").removeClass("limit");
		}

		//debug
		if (debugMode) {
			console.log("return parameters from d6 worker----");
			console.log(res);
		}
		break;

	case "subtabclick":
		//sub tab click method : main tab is not changed
		inputHtml = createInputPage(res.inputPage);
		$("#tabcontents").html(inputHtml.combo);
		tabset(tabNow);

		tabSubNowName = res.subName;

		$("ul.submenu li").removeClass("select");
		$("ul.submenu li#" + tabNowName + "-" + tabSubNowName).addClass("select");

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
		if (showOver15) {
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
						"./?lang=" +languageMode +
						"&v=" + detailNextDiagnosisCode +
						"&intro=-1";
			}
		}
		break;

	case "common":
		result_action(res); //define in each view page as js file
		break;
		/*
		case "savenew":
			//save new , not use for IE9,safari
			var dat  = new Date();
			var fname = "d6-" + 
						dat.getFullYear() + 
						('0' + (dat.getMonth() + 1)).slice(-2) + 
						('0' + dat.getDate()).slice(-2) + 
						".txt";
			var blob = new Blob([res], {type: "text/plain"}); //change to binary
			// check ie
			if(window.navigator.msSaveBlob) {
				// use original function on ie
				window.navigator.msSaveBlob(blob, fname);
			} else {
				// other browser
				a.href = window.URL.createObjectURL(blob);
				a.target = '_blank';
				a.download = fname;
				a.click();
			}
			
			alert( "saved as  " + fname + "" );
			window.URL.revokeObjectURL(a.href);
			
		case "load":
			break;
*/

	default:
	}
	afterworker(res);
};

//after worker result function. depend on view function. override in each view
afterworker = function(res) {};

//top page button click to start
function top2start() {
	$("#top").hide();
	$("#divco2").show();
	startCalc("graphchange", param);
}
