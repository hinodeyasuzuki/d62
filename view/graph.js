/**
 * Home-Eco Diagnosis for JavaScript
 *
 * graph: graph create Class (Chart.js v4)
 *
 *
 * @author SUZUKI Yasufumi	2016/05/23
 *
 */

var wid;
var hei;

var _chartInstances = {};

function _destroyChart(id) {
	if (_chartInstances[id]) {
		_chartInstances[id].destroy();
		delete _chartInstances[id];
	}
}

function _ensureCanvas(targetId, w, h) {
	var $target = $("#" + targetId);
	var canvasId = targetId + "Canvas";
	_destroyChart(canvasId);
	$target.find(".chartjs-wrapper").remove();
	$target.append(
		'<div class="chartjs-wrapper" style="position:relative;width:' + w + 'px;height:' + h + 'px">' +
		'<canvas id="' + canvasId + '"></canvas></div>'
	);
	return document.getElementById(canvasId);
}

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

	wid =
		Math.min(
			$("#" + targetname)
				.parent()
				.width(),
			$(window).width()
		) * 0.9;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var canvas = _ensureCanvas(targetname, wid, hei);

	var unitSuffix = ret.yaxis == "yen" ? lang.priceunit : ret.yaxis;

	// Build category labels (x-axis groups)
	var categoryLabels = [captions.you];
	if (pageMode == "m1") {
		if (hideAverage == 0) {
			categoryLabels.push(captions.average);
		}
	} else {
		categoryLabels.push(captions.after);
		if (hideAverage == 0) {
			categoryLabels.push(captions.average);
		}
	}

	// Collect unique item names from data (preserving order from ret.ord when valid)
	var itemColors = {};
	for (var cid in ret.clist) {
		itemColors[ret.clist[cid].title] = ret.clist[cid].color;
	}

	var itemNamesOrdered = [];
	var itemNameSet = {};
	// Collect from all scenarios ("you" first, then others)
	var scenarioOrder = ["you", "after", "average"];
	for (var si = 0; si < scenarioOrder.length; si++) {
		for (var c in ret.data) {
			var d = ret.data[c];
			if (!d) continue;
			if (d.compare != scenarioOrder[si]) continue;
			var dItem = d.item == "other" ? lang.other : d.item;
			if (!itemNameSet[dItem]) {
				itemNameSet[dItem] = true;
				itemNamesOrdered.push(dItem);
			}
		}
	}

	// Reorder by ret.ord if it contains valid entries
	var hasValidOrd = ret.ord && ret.ord.length > 0 && ret.ord[0] != null;
	if (hasValidOrd) {
		var orderedNames = [];
		for (var i = 0; i < ret.ord.length; i++) {
			var oname = ret.ord[i] == "other" ? lang.other : ret.ord[i];
			if (itemNameSet[oname]) {
				orderedNames.push(oname);
			}
		}
		// Add any items not in ord
		for (var j = 0; j < itemNamesOrdered.length; j++) {
			if (orderedNames.indexOf(itemNamesOrdered[j]) < 0) {
				orderedNames.push(itemNamesOrdered[j]);
			}
		}
		itemNamesOrdered = orderedNames;
	}

	// Reverse for stacking order (bottom to top)
	var itemNames = itemNamesOrdered.slice().reverse();

	// Default color palette for sub-items without explicit colors
	var _defaultColors = [
		"#4dc9f6", "#f67019", "#f53794", "#537bc4",
		"#acc236", "#166a8f", "#00a950", "#58595b",
		"#8549ba", "#e6194b", "#3cb44b", "#ffe119"
	];
	var _colorIndex = 0;

	// Build datasets per item
	var datasets = [];
	for (var i = 0; i < itemNames.length; i++) {
		var itemName = itemNames[i];
		var values = [];
		for (var ci = 0; ci < categoryLabels.length; ci++) {
			var catKey = categoryLabels[ci] == captions.you ? "you"
				: categoryLabels[ci] == captions.after ? "after"
				: "average";
			var val = 0;
			for (var c in ret.data) {
				var d = ret.data[c];
				if (!d) continue;
				var dItem = d.item == "other" ? lang.other : d.item;
				if (dItem == itemName && d.compare == catKey) {
					val = d[ret.yaxis] || 0;
					break;
				}
			}
			values.push(Math.round(val));
		}
		var bgColor = itemColors[itemName];
		if (!bgColor) {
			bgColor = _defaultColors[_colorIndex % _defaultColors.length];
			_colorIndex++;
		}
		datasets.push({
			label: itemName,
			data: values,
			backgroundColor: bgColor
		});
	}

	_chartInstances[targetname + "Canvas"] = new Chart(canvas, {
		type: "bar",
		data: {
			labels: categoryLabels,
			datasets: datasets
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: { duration: 200 },
			plugins: {
				legend: {
					position: "right",
					labels: { font: { size: 12 } }
				},
				datalabels: {
					display: function (ctx) {
						return ctx.dataset.data[ctx.dataIndex] > 0;
					},
					anchor: "center",
					align: "center",
					font: { size: 10 },
					formatter: function (value) {
						return value.toLocaleString() + unitSuffix;
					}
				}
			},
			scales: {
				x: {
					stacked: true,
					ticks: { font: { size: 13 } }
				},
				y: {
					stacked: true,
					ticks: { font: { size: 12 } },
					title: {
						display: true,
						text: titles[ret.yaxis]
					}
				}
			}
		},
		plugins: [ChartDataLabels]
	});

	// comment
	var commentItems = hasValidOrd ? itemNamesOrdered : [];
	var rat = [];
	var ratsum = 0;
	for (var i1 = 0; i1 < Math.min(3, commentItems.length); i1++) {
		for (var c in ret.data) {
			var d = ret.data[c];
			if (!d) continue;
			var dItem = d.item == "other" ? lang.other : d.item;
			if (d.compare == "you" && dItem == commentItems[i1]) {
				rat[i1] = d.ratio;
				ratsum += d.ratio;
				break;
			}
		}
	}
	if (commentItems.length >= 3) {
		var comment = lang.itemizecomment(
			commentItems[0] +
			"（" +
			rat[0] +
			"%）、" +
			commentItems[1] +
			"（" +
			rat[1] +
			"%）、" +
			commentItems[2] +
			"（" +
			rat[2] +
			"%）",
			Math.round(ratsum)
		);
		$("#" + targetname + "comment").html(comment);
	}
}

// graphEnergy( averageData ) -----------------------------------------------------
//		energy compare to average
function graphEnergy(averageData) {
	if (!$("#graphEnergy").is(":visible")) {
		return;
	}

	$("#graphEnergy").html("");

	wid =
		Math.min(
			$("#graphEnergy")
				.parent()
				.width(),
			$(window).width()
		) * 0.95;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var canvas = _ensureCanvas("graphEnergy", wid, hei);

	var energyLabels = [
		lang.electricitytitle,
		lang.gastitle,
		lang.kerosenetitle,
		lang.gasolinetitle
	];
	var energyKeys = ["electricity", "gas", "kerosene", "car"];

	var youData = [];
	var avgData = [];
	for (var i = 0; i < energyKeys.length; i++) {
		youData.push(Math.round(averageData.cost[0][energyKeys[i]]));
		avgData.push(Math.round(averageData.cost[1][energyKeys[i]]));
	}

	_chartInstances["graphEnergyCanvas"] = new Chart(canvas, {
		type: "bar",
		data: {
			labels: energyLabels,
			datasets: [
				{
					label: lang.youcall,
					data: youData,
					backgroundColor: "orange"
				},
				{
					label: lang.average,
					data: avgData,
					backgroundColor: "green"
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: { duration: 1000 },
			plugins: {
				legend: {
					position: "top",
					labels: { font: { size: 12 } }
				},
				datalabels: {
					anchor: "end",
					align: "top",
					font: { size: 10 },
					formatter: function (value) {
						return value.toLocaleString() + lang.priceunit;
					}
				}
			},
			scales: {
				x: {
					ticks: { font: { size: wid < 480 ? 12 : 15 } }
				},
				y: {
					ticks: { font: { size: 12 } },
					title: {
						display: true,
						text: lang.fee + "（" + lang.priceunit + "/" + lang.monthunit + "）"
					}
				}
			}
		},
		plugins: [ChartDataLabels]
	});
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

	wid =
		Math.min(
			$("#" + target)
				.parent()
				.width(),
			$(window).width()
		) * 0.9;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var canvas = _ensureCanvas(target, wid, hei);

	var youCO2 = Math.round(averageData.co2[0].total * 12);
	var avgCO2 = Math.round(averageData.co2[1].total * 12);

	_chartInstances[target + "Canvas"] = new Chart(canvas, {
		type: "bar",
		data: {
			labels: [lang.youcall, lang.average],
			datasets: [{
				data: [youCO2, avgCO2],
				backgroundColor: ["red", "green"]
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: { duration: 1000 },
			plugins: {
				legend: { display: false },
				datalabels: {
					anchor: "end",
					align: "top",
					font: { size: 12 },
					formatter: function (value) {
						return value.toLocaleString() + "kg";
					}
				}
			},
			scales: {
				x: {
					ticks: { font: { size: 15 } }
				},
				y: {
					ticks: { font: { size: 12 } },
					title: {
						display: true,
						text: lang.co2emission + "（kg/" + lang.yearunit + "）"
					}
				}
			}
		},
		plugins: [ChartDataLabels]
	});
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
	$("#graphMonthly").html("<h3>" + captionGraph + "</h3>");

	wid =
		Math.min(
			$("#graphMonthly")
				.parent()
				.width(),
			$(window).width()
		) * 0.9;
	if (wid <= 0) return;
	hei = Math.max(wid * 0.4, 320);

	var canvas = _ensureCanvas("graphMonthly", wid, hei);

	// Collect unique months and energy types
	var months = [];
	var energyTypes = [];
	var monthSet = {};
	var energySet = {};
	for (var c in ret.data) {
		var d = ret.data[c];
		if (!monthSet[d.month]) {
			months.push(d.month);
			monthSet[d.month] = true;
		}
		if (!energySet[d.energyname]) {
			energyTypes.push(d.energyname);
			energySet[d.energyname] = true;
		}
	}

	// Build datasets per energy type
	var dataMap = {};
	for (var c in ret.data) {
		var d = ret.data[c];
		var key = d.energyname + "_" + d.month;
		dataMap[key] = d[ret.yaxis] || 0;
	}

	var datasets = [];
	for (var i = 0; i < energyTypes.length; i++) {
		var etype = energyTypes[i];
		var values = [];
		for (var m = 0; m < months.length; m++) {
			values.push(dataMap[etype + "_" + months[m]] || 0);
		}
		datasets.push({
			label: enename[etype] || etype,
			data: values,
			backgroundColor: color[etype] || null
		});
	}

	// Convert month keys to display labels
	var monthLabels = [];
	for (var m = 0; m < months.length; m++) {
		monthLabels.push(months[m]);
	}

	_chartInstances["graphMonthlyCanvas"] = new Chart(canvas, {
		type: "bar",
		data: {
			labels: monthLabels,
			datasets: datasets
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "right",
					labels: { font: { size: 12 } }
				}
			},
			scales: {
				x: {
					stacked: true,
					ticks: { font: { size: 13 } }
				},
				y: {
					stacked: true,
					ticks: { font: { size: 12 } },
					title: {
						display: true,
						text: titles[ret.yaxis]
					}
				}
			}
		}
	});
}

// graphDemand( ret ) --------------------------------------
//		2 type of demand curve graph, loggeddata and sumup one.
//
// parameters
//		ret : graph data calcrated by D6
//
function graphDemand(ret) {
	var captionGraph = "1時間ごとデマンドグラフ（積み上げ）";
	var captionHour = "時刻";
	var captionEquipment = "機器";
	var caption_kW = "消費電力(kW)";
	var captionInputTable = "1時間ごとデマンドグラフ（計測）";

	$("#graphDemandSumup").html("<h3>" + captionGraph + "</h3>");
	$("#graphDemandLog").html("<h3>" + captionInputTable + "</h3>");

	wid = Math.min(500, $(window).width()) * 0.9;
	hei = wid * 0.9;

	// --- Sumup graph ---
	_buildDemandChart("graphDemandSumup", ret.sumup, ret.clist, caption_kW, wid, hei);

	// --- Log graph ---
	_buildDemandChart("graphDemandLog", ret.log, ret.clist, caption_kW, wid, hei);
}

function _buildDemandChart(targetId, data, clist, yLabel, wid, hei) {
	var canvas = _ensureCanvas(targetId, wid, hei);

	// Collect unique times and equipment names
	var times = [];
	var equips = [];
	var timeSet = {};
	var equipSet = {};
	for (var c in data) {
		var d = data[c];
		if (!timeSet[d.time]) {
			times.push(d.time);
			timeSet[d.time] = true;
		}
		if (!equipSet[d.equip]) {
			equips.push(d.equip);
			equipSet[d.equip] = true;
		}
	}

	// Build data map
	var dataMap = {};
	for (var c in data) {
		var d = data[c];
		dataMap[d.equip + "_" + d.time] = d.electricity_kW || 0;
	}

	// Color map from clist
	var colorMap = {};
	if (clist) {
		for (var cid in clist) {
			colorMap[clist[cid].title] = clist[cid].color;
		}
	}

	// Build datasets
	var datasets = [];
	for (var i = 0; i < equips.length; i++) {
		var equip = equips[i];
		var values = [];
		for (var t = 0; t < times.length; t++) {
			values.push(dataMap[equip + "_" + times[t]] || 0);
		}
		datasets.push({
			label: equip,
			data: values,
			backgroundColor: colorMap[equip] || null
		});
	}

	_chartInstances[targetId + "Canvas"] = new Chart(canvas, {
		type: "bar",
		data: {
			labels: times,
			datasets: datasets
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: { duration: 2000 },
			plugins: {
				legend: {
					position: "top",
					labels: { font: { size: 12 } }
				}
			},
			scales: {
				x: {
					stacked: true,
					ticks: { font: { size: 13 } }
				},
				y: {
					stacked: true,
					ticks: { font: { size: 15 } },
					title: {
						display: true,
						text: yLabel
					}
				}
			}
		}
	});
}
