/**
 * Home-Eco Diagnosis for JavaScript
 *
 * graph: graph create Class
 *
 *
 * @author SUZUKI Yasufumi	2016/05/23
 *
 */

var wid;
var hei;

//graphItemize( ret ) ------------------------------------------------
//		draw itemized graph to div#graph
//		comment to div#graphcomment
// parameters
//		ret: graph data calcrated by D6
// global
//		hideAverage: 1,hide
function graphItemize(ret) {
	graphItemizeCommon(ret, "graph");
}

function graphItemizeCommon(ret, targetname) {
	if (!$("#" + targetname).is(":visible")) {
		return;
	}
	//caption: graph captions translate
	if (targetMode == 1) {
		var captions = {
			you: lang.younow,
			after: lang.youafter,
			average: lang.average
		};
	} else {
		var captions = {
			you: lang.officenow,
			after: lang.youafter,
			average: lang.average
		};
	}
	var titles = {
		kg: lang.co2emission + "（" + lang.co2unitperyear + "）",
		GJ: lang.primaryenergy + "（" + lang.energyunitperyear + "）",
		yen: lang.fee + "（" + lang.feeunitperyear + "）"
	};

	var captionCompareAverage = lang.comparetoaverage;
	var captionItem = lang.itemize;
	var captionCompare = lang.compare;
	var captionPercent = lang.percent;

	$("#" + targetname).html(
		"<h3>" +
			titles[ret.yaxis] +
			(hideAverage != 1
				? ":" +
				  ret.averageCaption +
				  captionCompareAverage +
				  "（" +
				  ret.consTitle +
				  "）"
				: "") +
			"</h3>"
	);

	// use dimple
	wid =
		Math.min(
			$("#" + targetname)
				.parent()
				.width(),
			$(window).width()
		) * 0.9;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var svg = dimple.newSvg("#" + targetname, wid, hei);

	// redesign data for graph
	for (var c in ret.data) {
		if (pageMode == "m1") {
			//in case of no selection mode
			if (ret.data[c].compare == "after") {
				delete ret.data[c];
				continue;
			}
		}
		if (hideAverage == 1 && ret.data[c].compare == "average") {
			delete ret.data[c];
			continue;
		}
		//set language (other is not set in d6)
		if (ret.data[c].item == "other") {
			ret.data[c][captionItem] = lang.other;
		} else {
			ret.data[c][captionItem] = ret.data[c].item;
		}
		delete ret.data[c].item;
		ret.data[c][captionCompare] = captions[ret.data[c].compare];
		delete ret.data[c].compare;
		ret.data[c][captionPercent] = ret.data[c].ratio;
		delete ret.data[c].ratio;
		ret.data[c][titles[ret.yaxis]] = ret.data[c][ret.yaxis];
		delete ret.data[c][ret.yaxis];
	}
	var chart = new dimple.chart(svg, ret.data);
	chart.customClassList.axisLine = "dimple-custom-gridline";

	//X axis
	var xAxis = chart.addCategoryAxis("x", captionCompare);
	xAxis.fontSize = "13px";
	xAxis.title = "";
	//sort data and set axis
	var categoryOrder = [];
	categoryOrder[0] = captions.you;
	if (pageMode == "m1") {
		if (hideAverage == 0) {
			categoryOrder[1] = captions.average;
		}
	} else {
		categoryOrder[1] = captions.after;
		if (hideAverage == 0) {
			categoryOrder[2] = captions.average;
		}
	}
	xAxis.addOrderRule(categoryOrder);

	// y axis
	var yAxis = chart.addMeasureAxis("y", titles[ret.yaxis]);
	yAxis.tickFormat = "";
	yAxis.textAlign = "left";
	yAxis.fontSize = "12px";

	//legend
	var myLegend = chart.addLegend(wid - 80, 10, 90, hei - 40);
	myLegend.fontSize = "12px";

	// reverse regend: first, store a copy of the original _getEntries method.
	myLegend._getEntries_old = myLegend._getEntries;
	// now override the method
	myLegend._getEntries = function() {
		return myLegend._getEntries_old.apply(this, arguments).reverse();
	};

	//graph size setting
	chart.setBounds(60, 10, wid - 150, hei - 70); //left margin, top margin, width, height
	var barAxis = chart.addSeries(captionItem, dimple.plot.bar);
	//label
	barAxis.afterDraw = function(shape, data) {
		var s = d3.select(shape),
			rect = {
				x: parseFloat(s.attr("x")),
				y: parseFloat(s.attr("y")),
				width: parseFloat(s.attr("width")),
				height: parseFloat(s.attr("height"))
			};
		if (rect.height >= 8) {
			svg
				.append("text")
				// Position in the centre of the shape (vertical position is
				// manually set due to cross-browser problems with baseline)
				.attr("x", rect.x + rect.width / 2)
				.attr("y", rect.y + rect.height / 2 + 3.5)
				// Centre align
				.style("text-anchor", "middle")
				.style("font-size", "10px")
				.style("font-family", "sans-serif")
				// Make it a little transparent to tone down the black
				.style("opacity", 1)
				// Prevent text cursor on hover and allow tooltips
				.style("pointer-events", "none")
				// Format the number
				.text(d3.format(",.0f")(data.yValue) + "kg");
		}
	};

	for (var cid in ret.clist) {
		chart.assignColor(ret.clist[cid].title, ret.clist[cid].color);
	}
	barAxis.addOrderRule(ret.ord);

	//縦軸の反転
	var varaxorder = [];
	for (var i = ret.ord.length - 1; i >= 0; i--) {
		if (ret.ord[i] == "other") {
			varaxorder.push("その他");
		} else {
			varaxorder.push(ret.ord[i]);
		}
	}
	barAxis.addOrderRule(varaxorder);

	//draw
	chart.draw(200);

	//comment-------------------
	var rat = [];
	var ratsum = 0;
	for (var i1 = 0; i1 < 3; i1++) {
		for (var i2 in chart.data) {
			if (
				chart.data[i2][captionCompare] == captions.you &&
				chart.data[i2][captionItem] == ret.ord[i1]
			) {
				rat[i1] = chart.data[i2][captionPercent];
				ratsum += chart.data[i2][captionPercent];
				break;
			}
		}
	}
	var comment = lang.itemizecomment(
		ret.ord[0] +
			"（" +
			rat[0] +
			"%）、" +
			ret.ord[1] +
			"（" +
			rat[1] +
			"%）、" +
			ret.ord[2] +
			"（" +
			rat[2] +
			"%）",
		Math.round(ratsum)
	);
	$("#" + targetname + "comment").html(comment);
}

// graphEnergy( averageData ) -----------------------------------------------------
//		energy compare to average
function graphEnergy(averageData) {
	if (!$("#graphEnergy").is(":visible")) {
		return;
	}

	$("#graphEnergy").html("");

	// use dimple
	wid =
		Math.min(
			$("#graphEnergy")
				.parent()
				.width(),
			$(window).width()
		) * 0.95;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var svg = dimple.newSvg("#graphEnergy", wid, hei);
	var data = [
		{
			user: lang.youcall,
			energy: lang.electricitytitle,
			cons: Math.round(averageData.cost[0].electricity)
		},
		{
			user: lang.average,
			energy: lang.electricitytitle,
			cons: Math.round(averageData.cost[1].electricity)
		},
		{
			user: lang.youcall,
			energy: lang.gastitle,
			cons: Math.round(averageData.cost[0].gas)
		},
		{
			user: lang.average,
			energy: lang.gastitle,
			cons: Math.round(averageData.cost[1].gas)
		},
		{
			user: lang.youcall,
			energy: lang.kerosenetitle,
			cons: Math.round(averageData.cost[0].kerosene)
		},
		{
			user: lang.average,
			energy: lang.kerosenetitle,
			cons: Math.round(averageData.cost[1].kerosene)
		},
		{
			user: lang.youcall,
			energy: lang.gasolinetitle,
			cons: Math.round(averageData.cost[0].car)
		},
		{
			user: lang.average,
			energy: lang.gasolinetitle,
			cons: Math.round(averageData.cost[1].car)
		}
	];
	for (var c in data) {
		data[c][lang.fee] = data[c].cons;
		delete data[c].cons;
	}
	var chart = new dimple.chart(svg, data);

	//x axis
	var xAxis = chart.addCategoryAxis("x", ["energy", "user"]);
	if (wid < 480) {
		xAxis.fontSize = "12px";
	} else {
		xAxis.fontSize = "15px";
	}
	xAxis.title = "";
	xAxis.addOrderRule([
		lang.electricitytitle,
		lang.gastitle,
		lang.kerosenetitle,
		lang.gasolinetitle
	]);
	xAxis.addGroupOrderRule([lang.youcall, lang.average]); //カテゴリーの並び順

	//y axis
	var yAxis = chart.addMeasureAxis("y", lang.fee);
	yAxis.tickFormat = "";
	yAxis.fontSize = "12px";
	yAxis.title = lang.fee + "（" + lang.priceunit + "/" + lang.monthunit + "）";

	//legend
	var myLegend = chart.addLegend(wid - 160, 10, 160, 20);
	myLegend.fontSize = "12px";

	//set color
	chart.assignColor(lang.youcall, "orange");
	chart.assignColor(lang.average, "green");

	chart.setBounds(70, 10, wid - 80, hei - 70); //left padding, top padding, graph width, graph height

	var s = chart.addSeries("user", dimple.plot.bar);
	//label
	s.afterDraw = function(shape, data) {
		var s = d3.select(shape),
			rect = {
				x: parseFloat(s.attr("x")),
				y: parseFloat(s.attr("y")),
				width: parseFloat(s.attr("width")),
				height: parseFloat(s.attr("height"))
			};
		svg
			.append("text")
			// Position in the centre of the shape (vertical position is
			// manually set due to cross-browser problems with baseline)
			.attr("x", rect.x + rect.width / 2)
			.attr("y", rect.y - 3.5)
			// Centre align
			.style("text-anchor", "middle")
			.style("font-size", "10px")
			.style("font-family", "sans-serif")
			// Make it a little transparent to tone down the black
			.style("opacity", 1)
			// Prevent text cursor on hover and allow tooltips
			.style("pointer-events", "none")
			// Format the number
			.text(d3.format(",.0f")(data.yValue) + lang.priceunit);
	};

	chart.ease = "bounce";
	chart.staggerDraw = true;
	chart.draw(1000);
}

// graphCO2average( averageData ) -----------------------------------------------------
//		energy compare to average
function graphCO2average(averageData) {
	graphCO2averageCommon(averageData, "graphCO2average");
}

// graphCO2averageCommon( averageData, target ) -----------------------------------------------------
function graphCO2averageCommon(averageData, target) {
	if (!$("#" + target).is(":visible")) {
		return;
	}

	$("#" + target).html("");

	// use dimple
	wid =
		Math.min(
			$("#" + target)
				.parent()
				.width(),
			$(window).width()
		) * 0.9;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var svgco2 = dimple.newSvg("#" + target, wid, hei);
	var data = [
		{ user: lang.average, CO2: Math.round(averageData.co2[1].total * 12) },
		{ user: lang.youcall, CO2: Math.round(averageData.co2[0].total * 12) }
	];
	var chart = new dimple.chart(svgco2, data);

	//x axis
	var xAxis = chart.addCategoryAxis("x", "user");
	xAxis.fontSize = "15px";
	xAxis.addOrderRule([lang.youcall, lang.average]);
	xAxis.title = "";

	//y axis
	var yAxis = chart.addMeasureAxis("y", "CO2");
	yAxis.tickFormat = "";
	yAxis.fontSize = "12px";
	yAxis.title = lang.co2emission + "（kg/" + lang.yearunit + "）";

	//set color
	chart.assignColor(lang.youcall, "red");
	chart.assignColor(lang.average, "green");
	chart.setBounds(80, 10, wid - 90, hei - 70); //left padding, top padding, graph width, graph height

	var s = chart.addSeries("user", dimple.plot.bar);
	//label
	s.afterDraw = function(shape, data) {
		var s = d3.select(shape),
			rect = {
				x: parseFloat(s.attr("x")),
				y: parseFloat(s.attr("y")),
				width: parseFloat(s.attr("width")),
				height: parseFloat(s.attr("height"))
			};
		svgco2
			.append("text")
			// Position in the centre of the shape (vertical position is
			// manually set due to cross-browser problems with baseline)
			.attr("x", rect.x + rect.width / 2)
			.attr("y", rect.y - 3.5)
			// Centre align
			.style("text-anchor", "middle")
			.style("font-size", "12px")
			.style("font-family", "sans-serif")
			// Make it a little transparent to tone down the black
			.style("opacity", 1)
			// Prevent text cursor on hover and allow tooltips
			.style("pointer-events", "none")
			// Format the number
			.text(d3.format(",.0f")(data.yValue) + "kg");
	};

	chart.ease = "bounce";
	chart.staggerDraw = true;
	chart.draw(1000);
}

// graphMonthly( ret ) -----------------------------------------------------
//		monthly graph xAxis are from Jan. to Dec. #graphMonthly
//
// parameters
//		ret : graph data calcurated by D6
//
function graphMonthly(ret) {
	if (!$("#graphMonthly").is(":visible")) {
		return;
	}
	//graph captions
	var titles = {
		kg: lang.co2emission + "（" + lang.co2unitpermonth + "）",
		MJ: lang.primaryenergy + "（" + lang.energyunitpermonth + "）",
		yen: lang.fee + "（" + lang.feeunitpermonth + "）"
	};
	var enename = {
		electricity: lang.electricitytitle,
		gas: lang.gastitle,
		kerosene: lang.kerosenetitle,
		coal: lang.briquettitle,
		hotwater: lang.areatitle,
		car: lang.gasolinetitle
	};
	var color = {
		electricity: "orange",
		gas: "Lime",
		kerosene: "red",
		coal: "black",
		hotwater: "yellow",
		car: "magenta"
	};
	var captionGraph = lang.monthlytitle;
	var captionMonth = lang.month;
	var captionEnergy = "energyname"; //same to disp.js
	$("#graphMonthly").html("<h3>" + captionGraph + "</h3>");

	// use dimple
	wid =
		Math.min(
			$("#graphMonthly")
				.parent()
				.width(),
			$(window).width()
		) * 0.9;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var svg = dimple.newSvg("#graphMonthly", wid, hei);

	// redesign data for graph
	for (var c in ret.data) {
		ret.data[c][captionMonth] = ret.data[c].month;
		delete ret.data[c].month;
		ret.data[c][captionEnergy] = enename[ret.data[c].energyname];
		delete ret.data[c].energy;
		ret.data[c][titles[ret.yaxis]] = ret.data[c][ret.yaxis];
		delete ret.data[c][ret.yaxis];
	}

	var chart = new dimple.chart(svg, ret.data);
	var xAxis = chart.addCategoryAxis("x", captionMonth);
	xAxis.fontSize = "13px";

	var yAxis = chart.addMeasureAxis("y", titles[ret.yaxis]);
	yAxis.tickFormat = "";
	yAxis.fontSize = "12px";

	//legend
	var myLegend = chart.addLegend(wid - 70, 10, 70, hei - 40);
	myLegend.fontSize = "12px";

	chart.setBounds(70, 10, wid - 160, hei - 70); //left padding, top padding, graph width, graph height
	var barAxis = chart.addSeries(captionEnergy, dimple.plot.bar);

	//color
	for (var cid in enename) {
		chart.assignColor(enename[cid], color[cid]);
	}

	chart.draw(0);
}

// graphDemand( ret ) --------------------------------------
//		2 type of demand curve graph, loggeddata and sumup one.
//
// parameters
//		ret : graph data calcrated by D6
//
function graphDemand(ret) {
	//graph captions
	var captionGraph = "1時間ごとデマンドグラフ（積み上げ）";
	var captionHour = "時刻";
	var captionEquipment = "機器";
	var caption_kW = "消費電力(kW)";

	var captionInputTable = "1時間ごとデマンドグラフ（計測）";
	$("#graphDemandSumup").html("<h3>" + captionGraph + "</h3>");
	$("#graphDemandLog").html("<h3>" + captionInputTable + "</h3>");

	// use dimple for sumup graph
	wid = Math.min(500, $(window).width()) * 0.9;
	hei = wid * 0.9;
	var svg = dimple.newSvg("#graphDemandSumup", wid, hei);

	// redesign sumup data for graph
	for (var c in ret.sumup) {
		ret.sumup[c][captionHour] = ret.sumup[c].time;
		delete ret.sumup[c].time;
		ret.sumup[c][captionEquipment] = ret.sumup[c].equip;
		delete ret.sumup[c].equip;
		ret.sumup[c][caption_kW] = ret.sumup[c].electricity_kW;
		delete ret.sumup[c][ret.electricity_kW];
	}

	var chart = new dimple.chart(svg, ret.sumup);
	var xAxis = chart.addCategoryAxis("x", captionHour);
	xAxis.fontSize = "13px";

	var yAxis = chart.addMeasureAxis("y", caption_kW);
	yAxis.tickFormat = "";
	yAxis.fontSize = "15px";

	chart.setBounds(80, 10, wid - 80, wid - 70); //left padding, top padding, graph width, graph height
	var barAxis = chart.addSeries(captionEquipment, dimple.plot.bar);
	for (var cid in ret.clist) {
		chart.assignColor(ret.clist[cid].title, ret.clist[cid].color);
	}

	chart.ease = "bounce";
	chart.staggerDraw = true;
	chart.draw(2000);

	// use dimple for logged graph
	var svg = dimple.newSvg("#graphDemandLog", wid, hei);

	// redesign log data for graph
	for (var c in ret.log) {
		ret.log[c][captionHour] = ret.log[c].time;
		delete ret.log[c].time;
		ret.log[c][captionEquipment] = ret.log[c].equip;
		delete ret.log[c].equip;
		ret.log[c][caption_kW] = ret.log[c].electricity_kW;
		delete ret.log[c][ret.electricity_kW];
	}

	var chart = new dimple.chart(svg, ret.log);
	var xAxis = chart.addCategoryAxis("x", captionHour);
	xAxis.fontSize = "13px";

	var yAxis = chart.addMeasureAxis("y", caption_kW);
	yAxis.tickFormat = "";
	yAxis.fontSize = "15px";

	//left padding, top padding, graph width, graph height
	chart.setBounds(80, 10, wid - 100, hei - 70);
	var barAxis = chart.addSeries(captionEquipment, dimple.plot.bar);

	chart.ease = "bounce";
	chart.staggerDraw = true;
	chart.draw(2000);
}
