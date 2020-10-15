/**
 * Home-Eco Diagnosis for JavaScript
 *
 * createpage.js: create html pages
 *
 *
 * @author SUZUKI Yasufumi	2016/12/13
 *
 */

// createInputPage( res ) --------------------------------------
//		create input page of one consumption with menu
//	parameters
//		res.consName	main consumption code
//		res.subName		consumption codes array belong to main consumption
//		res.group[]		list of main menu
//		res.groupAddable[cons]	countable consumption settings of cons
//		res.subgroup[cons][subcons]	consumption name as submenu
//		res.subguide[cons][subcons]	submenu guidance text for input
//		res.combos[cons][subcons]	one component of combo written in html
//	return
//		page.combo		input page html and submenu
//		page.menu		main menu html
//
//  global
//		pageMode 	"m1" then not show after selection

var createInputPage = function(res) {
	var consName = res.consName;
	var subName = res.subName;
	var page = {};
	var combo = "",
		menu = "";
	var count = 0;

	for (var c in res.group) {
		//main menu
		menu += "<li id='" + c + "' tabindex=0>" + res.group[c] + "</li>";

		if (c != res.consName) {
			combo += "<li class='inppage nodata'></li>";
			continue;
		}

		//each page wrapper
		combo += "<li class='inppage'>";

		//addable equip/room
		var ad = "";
		for (var a in res.groupAddable[c]) {
			if (res.groupAddable[c][a]) {
				ad +=
					"<button style='color:blue;' " +
					"onclick='addroom(\"" +
					res.groupAddable[c][a].consName +
					"\");'" +
					">" +
					res.groupAddable[c][a].caption +
					lang.add +
					"</span>　";
			}
		}
		if (ad) {
			combo += "<div align='right'>" + ad + "</div>";
		}

		//submenu create
		combo += "<ul class='submenu'>";
		count = 0;
		for (var d in res.subgroup[c]) {
			combo +=
				"<li role='button' id='" + c + "-" + d +
				"' onclick='subtabclick(\"" + c + "\",\"" + d + "\");' tabindex=0 ";
			if (count == 0) {
				combo += "class='select' ";
				tabSubNowName = d;
			}
			count++;
			combo += ">" + res.subgroup[c][d] + "</li>";
		}
		combo += "</ul>";

		//sub page create
		if (c != consName) continue;
		combo += "<ul class='submenucontents'>";
		count = 0;
		for (d in res.subgroup[c]) {
			if (d != subName) {
				continue;
			}
			combo += "<li class='page" + c + "' id='subpage" + c + "-" + d + "' ";
			count++;
			combo += ">";
			combo += "<h3>" + res.subgroup[c][d] + "</h3>";
			combo += "<p>" + res.subguide[c][d] + "</p>";

			//2 column
			var leftc = Math.round(res.combos[c][d].length / 2);
			var rightc = res.combos[c][d].length;
			combo +=
				"<div class='column2'><table style='border:0;height:1em;width:100%'>";
			for (var i = 0; i < leftc; i++) {
				combo += res.combos[c][d][i];
			}
			combo += "</table></div>\n";
			combo +=
				"<div class='column2'><table style='border:0;height:1em;width:100%'>";
			for (i = leftc; i < rightc; i++) {
				combo += res.combos[c][d][i];
			}
			combo += "</table></div>\n";

			combo += "</li>";
		}
		//end of page wrapper
		combo += "<p style='clear:both;'></p></ul></li>";
	}

	page.combo = combo;
	page.menu = menu;

	return page;
};

// createInputButtonPageOne( res ) ---------------------------------------
//		create button selection type of question page, for smartphone
//	parameters
//		res.title		question title
//		res.numques		number of series of question
//		res.nowques		now number of question
//		res.defSelectValue[]	button name
//		res.defSelectData[]		value of selection
//	return
//		page			input page html with buttons
//
createInputButtonPageOne = function(res) {
	if (!res) return "";
	var page = "<h2>" + res.title;
	page += lang.QuestionNumber(res.numques, res.nowques) + "</h2>";
	page += "<p>" + res.text + "</p>\n<p>";
	for (var i in res.defSelectValue) {
		if (res.defSelectData[i] == -1) continue;
		if (res.defSelectValue[i]) {
			page += "<button class='button qbutton ";
			page += res.selected == res.defSelectData[i] ? "selected" : "";
			page += "' id='s" + res.defSelectData[i];
			page += "' onclick='quesone_set(\"" + res.id + "\", \"";
			page += res.defSelectData[i] + "\");' >";
			page += res.defSelectValue[i] + "</button>\n";
		}
	}
	page += "</p><br>";
	return page;
};

// createPageList(res) ---------------------------------
//		consumption select page for smartphone
//
var createPageList = function(res) {
	var checked = "";
	var page = "<p>分野を指定して、詳細の入力をすることができます。</p>";
	page +=
		"<table style='min-width:320px;'><tr><th>分野名</th><th>サブ分野・追加</th><th>選択</th></tr>\n";
	for (var c in res.group) {
		//main menu
		page +=
			"<tr><td rowspan='" +
			(1 + Object.keys(res.subgroup[c]).length) +
			"'>" +
			res.group[c] +
			"</td>";

		//addable equip/room
		var ad = "";
		for (var a in res.groupAddable[c]) {
			if (res.groupAddable[c][a]) {
				ad +=
					"<span class='button' style='cursor:pointer;color:blue;' onclick='addroom(\"" +
					res.groupAddable[c][a].consName +
					"\");'>" +
					res.groupAddable[c][a].caption +
					"追加</span>　";
			}
		}
		page += "<td colspan='2'>" + ad + "</td></tr>";

		//submenu
		for (var d in res.subgroup[c]) {
			checked = "";
			if (c == res.consName && d == res.subName) {
				checked = " checked";
			}
			page += "<tr><td>" + res.subgroup[c][d] + "</td>";
			page +=
				"<td><input type='radio' name='cons' onchange='conschange( \"" +
				c +
				"\",\"" +
				d +
				"\");' " +
				checked +
				"></td></tr>";
		}
	}
	page += "</table>";

	return page;
};

// createModalPage(mes) -------------------------------------------------
//		detail result of one measure for smartphone
//	parameters
//		mes.title
//		mes.advice
//		mes.figNum
//		mes.co2ChangeOriginal	co2 change kg/year
//		mes.costChangeOriginal	cost change yen/year
//		mes.priceNew			initial cost yen
//		mes.costTotalChangeOriginal		payback yen/year
//	return
//		modalHtml result written in html
createModalPage = function(mes) {
	var ret = getMeasureComment(mes);
	var modalHtml = "<h2>" + mes.title + "</h2>";
	modalHtml +=
		"<img src='./view/images/p" +
		mes.figNum +
		".jpg' class='modalfig' alt='figure of " +
		mes.title +
		"'>";
	modalHtml += "<div class='modaladvice'><p>" + mes.advice + "</p><hr></div>";
	modalHtml +=
		"<div class='modaljoyfull' style='display:none;'><p>" +
		mes.joyfull +
		"</p><hr></div>";

	if (hidePrice != 1) {
		modalHtml += "<table style='border:0px'>";
		modalHtml +=
			"<tr><td style='white-space:nowrap;'>" +
			lang.co2reductiontitle +
			"</td><td style='text-align:right'>" +
			comma3(-mes.co2ChangeOriginal * 12) +
			"</td><td>" +
			lang.co2unitperyear +
			"</td></tr>";
		modalHtml +=
			"<tr><td style='white-space:nowrap;'>" +
			lang.feereductiontitle +
			"</td><td style='text-align:right'>" +
			comma3(-mes.costChangeOriginal * 12) +
			"</td><td>" +
			lang.priceunit +
			"/" +
			lang.yearunit +
			"</td></tr>";
		modalHtml +=
			"<tr><td style='white-space:nowrap;'>" +
			lang.initialcosttitle +
			"</td><td style='text-align:right'>" +
			comma3(mes.priceNew) +
			"</td><td>" +
			lang.priceunit +
			"</td></tr>";
		if (mes.priceNew > 0) {
			modalHtml +=
				"<tr><td>" +
				lang.loadperyear +
				"</td><td style='text-align:right'>" +
				comma3(-mes.costTotalChangeOriginal * 12) +
				"</td><td>" +
				lang.priceunit +
				"/" +
				lang.yearunit +
				"</td></tr>";
		}
	}
	modalHtml += "<p>" + ret[1] + "</p>";
	if (hidePrice != 1) {
		modalHtml += "<p>" + ret[2] + "</p>";
	}

	if (debugMode) {
		modalHtml += "<p>CODE: " + mes.measureName + " in " + mes.consName + "</p>";
	}

	document.onkeydown = function(e) {
		if (e.keyCode == 27) {
			//ESC key
			$("#lean_overlay").hide();
			$("#leanModalDialog").hide();
		}
	};

	return modalHtml;
};

//getMeasureComment(mes) -------------------------------------------------
//		create comment text of one measure
// parameters
//		mes		measure instance
// return
//		ret[0]	title message
//		ret[1]	CO2 reduction
//		ret[2]  cost comment
//		ret[3]	advice
getMeasureComment = function(mes) {
	var ret = [];

	// caption to call total
	var you = lang.totalhome;
	if (targetMode == 1) {
		you = lang.totalhome;
	} else {
		you = lang.totaloffic;
	}
	//ret[0] title message
	ret[0] = lang.titlemessage(mes.title);

	//ret[1] CO2 reduction comment
	ret[1] = lang.co2reduction(Math.round(-mes.co2ChangeOriginal * 12));

	// reduce percent(%)　in case of co2ChangeOriginal is below 0, co2 is reduced
	var percent = (-mes.co2ChangeOriginal / mes.co2Total) * 100;

	if (percent < 0.05) {
		ret[1] += "";
	} else if (percent < 0.5) {
		ret[1] += lang.reducepercent(you, Math.round(percent * 10) / 10);
	} else if (percent < 100) {
		ret[1] += lang.reducepercent(you, Math.round(percent));
	} else {
		ret[1] += lang.reducepercent(you, Math.round(percent)) + lang.co2minus;
	}
	if (mes.total) {
		// rough estimate
		ret[1] += lang.error;
	}

	//ret[2] cost comment
	ret[2] = "";
	if (mes.costTotalChangeOriginal < 0) {
		ret[2] = lang.feereduction(priceRound(-mes.costTotalChangeOriginal * 12));
	} else if (mes.costTotalChangeOriginal == 0) {
		ret[2] = lang.feenochange;
	}

	if (mes.priceNew > 0) {
		//in case of initial cost
		if (!mes.total) {
			//not rough estimate

			//initial cost
			ret[2] += lang.initialcost(
				comma3(mes.priceNew),
				Math.round(mes.lifeTime),
				priceRound(mes.priceNew / mes.lifeTime)
			);

			//reduce cost
			ret[2] += lang.payback(
				priceRound(-mes.costChangeOriginal * 12),
				priceRound(Math.abs(mes.costTotalChangeOriginal * 12)),
				mes.costTotalChangeOriginal < 0
			);

			if (mes.costTotalChangeOriginal < 0) {
				if (mes.payBackYear < 0.08) {
					ret[2] += lang.payback1month;
				} else if (mes.payBackYear < 1) {
					ret[2] += lang.paybackmonth(Math.round(mes.payBackYear * 12));
				} else {
					ret[2] += lang.paybackyear(Math.round(mes.payBackYear * 10) / 10);
				}
			} else {
				ret[2] += lang.paybacknever;
			}
		} else {
			//not install
			ret[2] = lang.notinstallfee(priceRound(-mes.costChangeOriginal * 12));
		}
	}
	if (mes.total) {
		//rough estimate comment
		ret[2] += lang.error;
	}

	ret[3] = mes.advice;

	return ret;
};

createEnergyAverage = function(ave) {
	var good = "";
	var goodcount = 0;
	var bad = "";
	var badcount = 0;
	var comment = "";

	if (ave.co2[0].electricity > ave.co2[1].electricity * 1.2) {
		bad += lang.electricitytitle + ", ";
		badcount++;
	} else if (ave.co2[0].electricity < ave.co2[1].electricity * 0.9) {
		good += lang.electricitytitle + ", ";
		goodcount++;
	}
	if (ave.co2[0].gas > ave.co2[1].gas * 1.2) {
		bad += lang.gastitle + ", ";
		badcount++;
	} else if (ave.co2[0].gas < ave.co2[1].gas * 0.9) {
		good += lang.gastitle + ", ";
		goodcount++;
	}
	if (ave.co2[0].kerosene > ave.co2[1].kerosene * 1.2) {
		bad += lang.kerosenetitle + ", ";
		badcount++;
	} else if (ave.co2[0].kerosene < ave.co2[1].kerosene * 0.9) {
		good += lang.kerosenetitle + ", ";
		goodcount++;
	}
	if (ave.co2[0].car > ave.co2[1].car * 1.2) {
		bad += lang.gasolinetitle + ", ";
		badcount++;
	} else if (ave.co2[0].car < ave.co2[1].car * 0.9) {
		good += lang.gasolinetitle + ", ";
		goodcount++;
	}
	console.log(lang.kerosenetitle);
	if (goodcount == 4) {
		comment = good.slice(0, -2) + "のいずれも平均より少ないです。";
	} else if (goodcount > 0) {
		if (badcount == 0) {
			comment = good.slice(0, -2) + "が平均より少ないです。";
		} else {
			comment =
				bad.slice(0, -2) +
				"が平均より多いですが、" +
				good.slice(0, -2) +
				"が平均より少ないです。";
		}
	} else {
		if (badcount == 0) {
			comment = "いずれも、平均的です。";
		} else {
			comment = bad.slice(0, -2) + "が平均より多いです。";
		}
	}
	return comment;
};

// showAverageTable(dat) ---------------------------------------------
// parameters
//		dat  calculation result by web-worker
//		notshowafter 1/0 show table of after saving
// return
//		ret  compare to average table written in html show CO2 and cost
showAverageTable = function(dat) {
	var youcall = "";
	var youcount = "";
	var same = "";
	var notshowafter = 0;
	if (pageMode == "m1") {
		notshowafter = 1;
	}

	if (hideAverage == 1) return "";

	if (targetMode == 1) {
		//home
		youcall = lang.youcall;
		youcount = lang.youcount;
		same = lang.comparehome(dat.samehome);
	} else {
		//office
		youcall = lang.officecal;
		youcount = lang.officecount;
		same = lang.compareoffice(dat.sameoffice);
	}
	var ret =
		"<table id='averagetable' width='100%'><tr><th></th><th>" +
		youcall +
		"</th>" +
		(notshowafter != 1 ? "<th>" + lang.youafter + "</th>" : "") +
		"<th>" +
		lang.average +
		"</th>";
	ret +=
		"<tr><td>" +
		lang.co2emission +
		"(" +
		lang.co2unitperyear +
		")</td>" +
		"<td align='right'>" +
		comma3(dat.you) +
		(notshowafter != 1 ? "</td><td align='right'>" + comma3(dat.after) : "") +
		"</td><td align='right'>" +
		comma3(dat.av) +
		"</td></tr>";
	ret +=
		"<tr><td>" +
		lang.fee +
		"(" +
		lang.feeunitperyear +
		")</td>" +
		"<td align='right'>" +
		comma3(dat.youc) +
		(notshowafter != 1 ? "</td><td align='right'>" + comma3(dat.afterc) : "") +
		"</td><td align='right'>" +
		comma3(dat.avc) +
		"</td></tr>";
	if (dat.consCode == "TO") {
		ret +=
			"<tr><td>" +
			lang.rankin100(youcount) +
			"</td>" +
			"<td align='right'>" +
			dat.rank100 +
			(notshowafter != 1
				? lang.rankcall + "</td><td align='right'>" + dat.afterrank100
				: "") +
			lang.rankcall +
			"</td>" +
			"<td align='right'></td></tr>";
	}
	ret += "</table>";

	//compare avearage CO2
	ret += createCompareComment(same, dat.you, dat.av, dat.consCode, dat.rank100);

	return ret;
};

//createCompareComment( you, av, target )
//
createCompareComment = function(same, you, av, target, rank100) {
	var youcount;
	if (targetMode == 1) {
		//home
		youcount = lang.youcount;
	} else {
		//office
		youcount = lang.officecount;
	}

	//compare avearage CO2
	var rel = you / av;
	var ret = lang.co2ratio(Math.round(rel * 10) / 10);
	if (rel < 0.7) {
		ret += lang.co2compare06;
	} else if (rel < 0.93) {
		ret += lang.co2compare08;
	} else if (rel < 1.1) {
		ret += lang.co2compare10;
	} else if (rel < 1.3) {
		ret += lang.co2compare12;
	} else {
		ret += lang.co2compare14;
	}

	if (target == "TO") {
		ret += lang.rankcomment(same, youcount, rank100);
	}

	return ret;
};

//showItemizeTable(target) -------------------------------------------------
//		itemized table
// parameters
// 		target: consumption list as array
// return
//		itemized table written in html, show energy consumption and CO2
showItemizeTable = function(target) {
	var ret =
		"<table id='itemize' width='100%'><tr><th>" +
		lang.itemname +
		"</th><th>CO2(kg)</th><th>" +
		lang.percent +
		"</th><th>" +
		lang.electricity +
		"</th><th>" +
		lang.gas +
		"</th>";
	if (lang.show_kerosene) {
		ret += "<th>" + lang.kerosene + "</th>";
	}
	if (lang.show_briquet) {
		ret += "<th>" + lang.briquet + "</th>";
	}
	if (lang.show_area) {
		ret += "<th>" + lang.area + "</th>";
	}
	ret += "<th>" + lang.gasoline + "</th></tr>";
	var cons;

	for (var cid in target) {
		cons = target[cid];
		if (
			cons.sumConsName != "consTotal" &&
			cons.sumConsName != tabNowName &&
			cons.sumCons2Name != tabNowName &&
			cons.consName != "consTotal"
		)
			continue;
		if (cons.consName == "consEnergy") continue;

		ret += "<tr><td class='conscolor' style='border-color:" + cons.color + "'>";
		if (
			cons.sumConsName == tabNowName &&
			cons.sumCons2Name == tabNowName &&
			tabNowName != "consTotal"
		) {
			ret += "　" + cons.title + "</td>";
		} else {
			if (
				cons.title &&
				(cons.sumConsName == "consTotal" || cons.consName == "consTotal")
			) {
				ret += cons.title + "</td>";
			} else {
				ret +=
					cons.title +
					(cons.countCall ? cons.subID + cons.countCall : "") +
					"</td>";
			}
		}
		ret += "<td class='right'>" + this.comma3(cons.co2 * 12) + "</td>";
		ret +=
			"<td class='right'>" +
			this.comma3((100 * cons.co2) / cons.co2Total) +
			"%</td>";
		ret +=
			"<td class='right'>" +
			this.comma3((cons.electricity + cons.nightelectricity) * 12) +
			"</td>";
		ret += "<td class='right'>" + this.comma3(cons.gas * 12) + "</td>";
		if (lang.show_kerosene) {
			ret += "<td class='right'>" + this.comma3(cons.kerosene * 12) + "</td>";
		}
		if (lang.show_briquet) {
			ret += "<td class='right'>" + this.comma3(cons.coal * 12) + "</td>";
		}
		if (lang.show_area) {
			ret += "<td class='right'>" + this.comma3(cons.hotwater * 12) + "</td>";
		}
		ret += "<td class='right'>" + this.comma3(cons.car * 12) + "</td>";
		ret += "</tr>";
	}
	ret += "</table>";
	return ret;
};

//showItemizeTableSort(target) -------------------------------------------------
//		itemized table
// parameters
// 		target: consumption list as array
// return
//		itemized table written in html, show energy consumption and CO2
showItemizeTableSort = function(target) {
	var ret =
		"<table id='itemize'><tr><th>" +
		lang.itemname +
		"</th><th>CO2(kg)</th><th>" +
		lang.percent +
		"</th></tr>";
	var cons;

	ObjArraySort(target, "co2", "");

	//other
	var co2Total = 0;
	var co2other = 0;
	var colorother = "";
	for (var cid in target) {
		cons = target[cid];
		if (cons.sumConsName != "consTotal") {
			if (cons.consName == "consTotal") {
				co2other += cons.co2;
				colorother = cons.color;
				co2Total = cons.co2;
			}
			continue;
		}
		co2other -= cons.co2;
	}
	ret += "<tr><td class='conscolor' style='border-color:" + colorother + "'>";
	ret += "　" + lang.other + "</td>";
	ret += "<td class='right'>" + this.comma3(co2other * 12) + "</td>";
	ret +=
		"<td class='right'>" + this.comma3((100 * co2other) / co2Total) + "%</td>";
	ret += "</tr>";

	//each item
	for (cid in target) {
		cons = target[cid];
		if (cons.sumConsName != "consTotal" && cons.consName != "consTotal")
			continue;

		ret += "<tr><td class='conscolor' style='border-color:" + cons.color + "'>";
		ret += "　" + cons.title + "</td>";

		ret += "<td class='right'>" + this.comma3(cons.co2 * 12) + "</td>";
		ret +=
			"<td class='right'>" +
			this.comma3((100 * cons.co2) / cons.co2Total) +
			"%</td>";
		ret += "</tr>";
	}
	ret += "</table>";
	return ret;
};

// showMeasureTable( mesArray ) ----------------------------------------
//		usefull measures table sorted by efficeincy
//		show checkbutton in case of pageMode "m1"
// parameters
//		mesArray : measures array with result
// return
//		measures array table in html
// global
//		showMeasureTable_Max   : list size
showMeasureTable = function(mesArray) {
	var ret =
		"<table id='itemize' class='limit' width='100%'><tr><th width='60%'>" +
		lang.measure +
		"</th><th>" +
		lang.co2reductiontitle +
		" (" +
		lang.co2unitperyear +
		")</th><th>" +
		(hidePrice == 1
			? ""
			: lang.feereductiontitle + " (" + lang.feeunitperyear + ")</th><th>") +
		lang.merit +
		"</th>" +
		(pageMode != "m1" ? "<th>" + lang.select + "</th>" : "") +
		"</tr>";
	var mes;
	var count = 0;
	var countCons = {};
	var maxMesCount = 3; //measures in same group in case of listricted output

	isProhivitedMeasure = function(mname) {
		if (prohibitMeasures.length <= 0) {
			if (allowedMeasures.length <= 0) {
				return false;
			} else {
				if (allowedMeasures.indexOf(mname) >= 0) {
					return false;
				} else {
					return true;
				}
			}
		} else {
			if (prohibitMeasures.indexOf(mname) >= 0) {
				return true;
			} else {
				return false;
			}
		}
	};

	var mesbgcolor = "";
	var mesenable = "";
	for (var mid in mesArray) {
		mes = mesArray[mid];

		if (
			mes.consName == "consTotal" ||
			mes.consName == "" ||
			mes.consName == mes.consconsName ||
			mes.consName == mes.conssumConsName ||
			mes.consName == mes.conssumCons2Name ||
			mes.relation
		) {
			// addable reduction
			if (mes.co2Change >= 0 && !mes.selected) {
				mesbgcolor = " background-color:#bbb;";
				mesenable = "disabled='disabled' ";
			} else {
				mesbgcolor = "";
				mesenable = "";
			}
			if (typeof countCons[mes.groupID] == "undefined")
				countCons[mes.groupID] = 0;
			countCons[mes.groupID]++;

			//not show
			if (mes.co2ChangeOriginal >= 0 && mes.costChangeOriginal >= 0) continue;
			if (isProhivitedMeasure(mes.measureName)) continue;
			count++;
			if (typeof showMeasureTable_Max != "undefined") {
				//set max list size
				if (countCons[mes.groupID] > 3) {
					count--;
					continue; //same consumption max
				}
				if (count > showMeasureTable_Max) break;
			}

			// restrict number of measures
			ret +=
				"<tr id='mestr" +
				mes.mesID +
				"' class='" +
				(mes.selected ? "messelected " : "") +
				(mes.lifestyle == 1 ? "lifestyle'" : "invest'") +
				">";
			// title and action to show detail
			ret +=
				"<td class='conscolor left' style='border-color:" +
				mes.color +
				";" +
				mesbgcolor +
				"'><a rel='leanModal' href='#leanModalDialog' onclick='showModal( " +
				mes.mesID +
				");'>" +
				mes.title +
				(mes.conssubID > 0
					? "(" +
					  (mes.consmesTitlePrefix ? mes.consmesTitlePrefix : mes.conssubID) +
					  ")"
					: "") +
				(debugMode ? " " + mes.consconsName : "") +
				"</a></td>";
			// co2
			ret +=
				"<td class='right' style='" +
				mesbgcolor +
				"'>" +
				this.comma3(-mes.co2ChangeOriginal * 12) +
				"</td>";

			if (hidePrice != 1) {
				// cost
				ret +=
					"<td class='right' style='" +
					mesbgcolor +
					"'>" +
					this.comma3(-mes.costChangeOriginal * 12) +
					"</td>";
			}

			//payback
			ret +=
				"<td class='center' style='" +
				mesbgcolor +
				"'>" +
				(mes.lifeTime == 0 || mes.payBackYear < mes.lifeTime ? "★" : "") +
				"</td>";

			// check for adopt the measure
			if (pageMode != "m1") {
				ret +=
					"<td style='" +
					mesbgcolor +
					"'><input type='checkbox' id='messel" +
					mes.mesID +
					"' onclick='measureadddelete(" +
					mes.mesID +
					")' " +
					(mes.selected ? "checked " : "") +
					" title='" +
					lang.select +
					"'" +
					mesenable +
					"></td>";
			}
			ret += "</tr>";
		}
	}
	ret += "</table>";

	return ret;
};

//showDemandSumupPage(pdata) ---------------------------------------
//		create demand items input page
// parameters
//		pdata.title[]	names of equipment type
//		pdata.data[][]	usage pattern watt and timetable
//		pdata.data[][][1]	kW
//		pdata.data[][][2]	W
//		pdata.data[][][3]	number of equipment
//		pdata.data[][][4]	name to identify in same kind of equipment
//		pdata.data[][][5]	turn on time, if zero then treat to use all time
//		pdata.data[][][6]	turn off time
// result
//		combo to input equip and usage pattern
showDemandSumupPage = function(pdata) {
	var page = {};
	var res = pdata.data;
	var title = pdata.title;
	var ad = "";

	var combo =
		"<h3>機器の積み上げ（消費電力と使用時間）</h3><table class='demandtable'>";
	combo +=
		"<tr><th>種別</th><th>名前</th><th>消費電力</th><th>台数</th><th>開始時刻</th><th>終了時刻</th></tr>";

	for (var c in res) {
		ad +=
			"<span style='cursor:pointer;color:blue;' onclick='addroom(\"" +
			c +
			"\");'>" +
			title[c] +
			"追加</span>　";

		for (var i = 1; i < 100; i++) {
			if (!res[c][i]) continue;
			combo += "<tr><td>";
			combo += title[c];
			combo += "</td><td>";
			if (res[c][i][4]) {
				combo += res[c][i][4];
			}
			combo += "</td><td>";
			if (res[c][i][1]) {
				combo += res[c][i][1] + "kW";
			} else if (res[c][i][2]) {
				combo += res[c][i][2] + "W";
			}
			combo += "</td><td>";
			if (res[c][i][3]) {
				combo += res[c][i][3];
			}
			combo += "</td><td>";
			if (res[c][i][5]) {
				combo += res[c][i][5];
			} else {
				combo += "【常時通電】";
			}
			combo += "</td><td>";
			if (res[c][i][6]) {
				combo += res[c][i][6];
			}
			combo += "</td></tr>\n";
		}
	}
	combo += "</table>";

	if (ad) {
		combo = "<div align='right'>" + ad + "</div>" + combo;
	}
	return combo;
};

// showDemandLogPage(res) ------------------------------------------------
//		create input page for demand by hour
//	parameters
//		res[i]	input text component in each hour
//  result
//		demand input table and titile written in html
showDemandLogPage = function(res) {
	var page = {};
	var ad = "";

	var combo =
		"<h3>1時間ごとのデマンド計測値(kW)</h3><table class='demandtable'>";
	combo += "<tr><th>時刻</th><th>消費電力(kWh/時)</th></tr>\n";
	for (var i = 0; i < 24; i++) {
		combo += "<tr><td>" + i + "時</td><td>" + res[i] + "</td></tr>\n";
	}
	combo += "</table>\n";
	return combo;
};

// showMeasureTotalMessage(rescommon) ------------------------------------------------
//		create input page for demand by hour
//	parameters
//		rescommon	return value common
//  result
//		message written in html
showMeasureTotalMessage = function(rescommon) {
	var html = "";
	var redco2 = rescommon.co2Original - rescommon.co2;
	var redcost = rescommon.costOriginal - rescommon.cost;
	if (!isNaN(redco2)) {
		html = lang.comment_combined_reduce(
			Math.round((redco2 / rescommon.co2Original) * 100),
			comma3(redcost * 12),
			comma3(redco2 * 12)
		);
	}
	return html;
};

//leanModalSet()-------------------------------------------
//		design set for leanModal
//
leanModalSet = function() {
	// use leanModal
	$("a[rel*=leanModal]").leanModal({
		top: 50, // top position
		overlay: 0.5, // back transparency
		closeButton: ".modal_close" // CSS class of close button
	});
};

// showModal(id) ----------------------------------------
//		detail measures result as modal dialog for PC
//
showModal = function(id) {
	var param = {};
	param.mid = id;
	startCalc("modal", param);
};

// need in Chrome
function tabset() {}

// priceRound(num)------------------------------------------
//		make round value
// parameters
//		num : price(yen)
//	return
//		rounded string with commma
//
priceRound = function(num) {
	var price;
	if (num > 10000) {
		price = this.comma3(Math.round(num / 100) * 100);
	} else if (num > 4000) {
		price = this.comma3(Math.round(num / 50) * 50);
	} else {
		price = this.comma3(Math.round(num / 10) * 10);
	}
	return price;
};

//comma3( num )------------------------------------------
//		rounded to integral and add comma to each 3 charactors
//	parameters
//		num : number
//	return
//		rounded string with comma
comma3 = function(num) {
	var n;
	var l;
	var m = "";
	var minus = 0;
	if (num < 0) minus = 1;
	n = "" + Math.abs(Math.round(num));
	while ((l = n.length) > 3) {
		m = "," + n.substr(l - 3, 3) + m;
		n = n.substr(0, l - 3);
	}
	n = (minus == 1 ? "-" : "") + n + m;
	return n;
};

//escapeHtml(string)----------------------------------------
//		sanitize html script
//
escapeHtml = (function(String) {
	var escapeMap = {
		"&": "&amp;",
		"'": "&#x27;",
		"`": "&#x60;",
		"\"": "&quot;",
		"<": "&lt;",
		">": "&gt;"
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
		str = str === null || str === undefined ? "" : "" + str;
		return str.replace(reg, function(match) {
			return escapeMap[match];
		});
	};
})(String);

// initial language set
languageset = function() {
	//rot13 decode
	function rot13(str) {
		var i = [];
		i = str.split("");
		return i.map
			.call(i, function(char) {
				x = char.charCodeAt(0);
				if ((65 <= x && x < 78) || (97 <= x && x < 110)) {
					return String.fromCharCode(x + 13);
				} else if ((78 <= x && x <= 90) || (110 <= x && x <= 122)) {
					return String.fromCharCode(x - 13);
				}
				return String.fromCharCode(x);
			})
			.join("");
	}

	//rot 13
	for (var c in lang) {
		if (typeof lang[c] == "string" && lang[c].substr(0, 2) == "q@") {
			lang[c] = decodeURIComponent(
				escape(base64.decode(rot13(lang[c].substr(2))))
			);
		}
	}

	//common message create===========
	lang.electricity = lang.electricitytitle + " (" + lang.electricityunit + ")";
	lang.gas = lang.gastitle + " (" + lang.gasunit + ")";
	lang.kerosene = lang.kerosenetitle + " (" + lang.keroseneunit + ")";
	lang.gasoline = lang.gasolinetitle + " (" + lang.gasolineunit + ")";
	lang.area = lang.areatitle + " (" + lang.areaunit + ")";
	lang.briquet = lang.briquettitle + " (" + lang.briquetunit + ")";
};

//object sort
ObjArraySort = function(ary, key, order) {
	var reverse = 1;
	if (order && order.toLowerCase() == "desc") reverse = -1;
	ary.sort(function(a, b) {
		if (a[key] < b[key]) return -1 * reverse;
		else if (a[key] == b[key]) return 0;
		else return 1 * reverse;
	});
};

/*
 * Copyright (c) 2010 Nick Galbreath
 * See full license on http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 */

var base64 = {};
base64.PADCHAR = "=";
base64.ALPHA =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

base64.makeDOMException = function() {
	// sadly in FF,Safari,Chrome you can't make a DOMException
	var e, tmp;

	try {
		return new DOMException(DOMException.INVALID_CHARACTER_ERR);
	} catch (tmp) {
		// not available, just passback a duck-typed equiv
		// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
		//https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
		var ex = new Error("DOM Exception 5");

		// ex.number and ex.description is IE-specific.
		ex.code = ex.number = 5;
		ex.name = ex.description = "INVALID_CHARACTER_ERR";

		// Safari/Chrome output format
		ex.toString = function() {
			return "Error: " + ex.name + ": " + ex.message;
		};
		return ex;
	}
};

base64.getbyte64 = function(s, i) {
	// This is oddly fast, except on Chrome/V8.
	//  Minimal or no improvement in performance by using a
	//   object with properties mapping chars to value (eg. 'A': 0)
	var idx = base64.ALPHA.indexOf(s.charAt(i));
	if (idx === -1) {
		throw base64.makeDOMException();
	}
	return idx;
};

base64.decode = function(s) {
	// convert to string
	s = "" + s;
	var getbyte64 = base64.getbyte64;
	var pads, i, b10;
	var imax = s.length;
	if (imax === 0) {
		return s;
	}

	if (imax % 4 !== 0) {
		throw base64.makeDOMException();
	}

	pads = 0;
	if (s.charAt(imax - 1) === base64.PADCHAR) {
		pads = 1;
		if (s.charAt(imax - 2) === base64.PADCHAR) {
			pads = 2;
		}
		// either way, we want to ignore this last block
		imax -= 4;
	}

	var x = [];
	for (i = 0; i < imax; i += 4) {
		b10 =
			(getbyte64(s, i) << 18) |
			(getbyte64(s, i + 1) << 12) |
			(getbyte64(s, i + 2) << 6) |
			getbyte64(s, i + 3);
		x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
	}

	switch (pads) {
	case 1:
		b10 =
				(getbyte64(s, i) << 18) |
				(getbyte64(s, i + 1) << 12) |
				(getbyte64(s, i + 2) << 6);
		x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
		break;
	case 2:
		b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12);
		x.push(String.fromCharCode(b10 >> 16));
		break;
	}
	return x.join("");
};

base64.getbyte = function(s, i) {
	var x = s.charCodeAt(i);
	if (x > 255) {
		throw base64.makeDOMException();
	}
	return x;
};

base64.encode = function(s) {
	if (arguments.length !== 1) {
		throw new SyntaxError("Not enough arguments");
	}
	var padchar = base64.PADCHAR;
	var alpha = base64.ALPHA;
	var getbyte = base64.getbyte;

	var i, b10;
	var x = [];

	// convert to string
	s = "" + s;

	var imax = s.length - (s.length % 3);

	if (s.length === 0) {
		return s;
	}
	for (i = 0; i < imax; i += 3) {
		b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8) | getbyte(s, i + 2);
		x.push(alpha.charAt(b10 >> 18));
		x.push(alpha.charAt((b10 >> 12) & 0x3f));
		x.push(alpha.charAt((b10 >> 6) & 0x3f));
		x.push(alpha.charAt(b10 & 0x3f));
	}
	switch (s.length - imax) {
	case 1:
		b10 = getbyte(s, i) << 16;
		x.push(
			alpha.charAt(b10 >> 18) +
					alpha.charAt((b10 >> 12) & 0x3f) +
					padchar +
					padchar
		);
		break;
	case 2:
		b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8);
		x.push(
			alpha.charAt(b10 >> 18) +
					alpha.charAt((b10 >> 12) & 0x3f) +
					alpha.charAt((b10 >> 6) & 0x3f) +
					padchar
		);
		break;
	}
	return x.join("");
};

//over15show() -----------------------------------------
//		show measures more than 15
over15show = function() {
	showOver15 = true;
	$("#itemize").removeClass("limit");
};
