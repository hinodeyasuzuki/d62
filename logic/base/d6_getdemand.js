/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * disp_demand.js 
 * 
 * demand input/graph add to D6.disp class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2016/11/23 divided from disp.js
 * 
 * getDemandGraph()
 * getInputDemandSumup()
 * getInputDemandLog()
 */

//resolve D6
var D6 = D6 || {};

///get data of Demand graph
// getDemandGraph()-----------------------------------------------------
//		demand graph of sumup and consumption log
// return
//		retall.log		log graph data
//		retall.sumup	pile up graph data
D6.getDemandGraph  = function (){
	var work = {};
	var retall = {};
	var clist = [];
		
	// pickup related concumption name "consName"
	for( var c in D6.scenario.defInput ) {
		if ( D6.scenario.defInput[c].demand > 0 ){
			work[D6.scenario.defInput[c].cons]= [];
		}
	}

	//make device data
	for( var i in D6.doc.data ) {
		//loop in doc.data and check in defInput
		var definp = D6.scenario.defInput[i.substr(0,4)];
		if ( work[definp.cons] ) {
			//work[consName][ID][1-6]
			var count = parseInt(i.substr(4,2));
			if( !work[definp.cons][count] ) work[definp.cons][count] = [];
			work[definp.cons][count][definp.demand] = D6.doc.data[i];
		}
	}
		
	var ret = [];
	var ri = 0;
	var ctitle = "";
	var ctitle2 = "";
	var watt = 0;
	var num = 1;
	var st = 0;
	var ed = 24;
	var colorcount = 0;
	var seriescolor = "";

	for ( c in work ){
		colorcount++;
		ctitle = D6.logicList[c].addable;
		for ( i in work[c] ){
			//input 
			if ( work[c][i][4] ){
				ctitle2 = work[c][i][4];
			} else {
				ctitle2 = i;
			}
			if ( work[c][i][1] && work[c][i][1] > 0 ){
				watt = work[c][i][1];
			} else if ( work[c][i][2] && work[c][i][2] > 0 ){
				watt = work[c][i][2]/1000;
			} else{
				watt = 0;
			}
			if ( work[c][i][3] && work[c][i][3] > 0 ){
				num = work[c][i][3];
			} else {
				num = 0;
			}
			if ( work[c][i][5] && work[c][i][5] >= 0 ){
				st = work[c][i][5];
			} else {
				st = 0;
			}
			if ( work[c][i][6] && work[c][i][6] >= 0 ){
				ed = work[c][i][6];
			} else {
				ed = 24;
			}
			if ( watt * num == 0 ) continue;
			if ( st >= ed ) continue;
			
			seriescolor = graphColorSeries( colorcount );
			//make graph data
			for ( var t=0 ; t<24 ; t++ ){
				ret[ri] = {};
				ret[ri]["equip"] = ctitle + "-" + ( parseInt(ctitle2) ? i : ctitle2);
				ret[ri]["time"] = t;
				if ( t>= st && t < ed ) {
					ret[ri]["electricity_kW"] = Math.round(watt * num * 10) / 10;
				} else {
					ret[ri]["electricity_kW"] = 0;
				}
				clist.push( { title:ret[ri]["equip"], 
					target:"electricity_kW", 
					color:seriescolor });
				ri++;
			}				
		}
	}
	retall.sumup = ret;		//sumup data
	retall.clist = clist;	//color list
	//log data
	var log = [];
	for ( t=0 ; t<24 ; t++ ){
		log[t] = {};
		log[t]["equip"] = "log";
		log[t]["time"] = t;
		log[t]["electricity_kW"] = D6.doc.data["i056"+(t+1)];
	}
	retall.log = log;		//log data
	return retall;
		
	//set color by ID "#0000ff"; .toString(16); 1-6 pattern
	function graphColorSeries( colid ) {
		var color;
		var col = [100,100,100];
		if ( colid <= 3 ) {
			col[colid-1] = 255;
		} else if ( colid <= 6 ){
			col[colid-4] = 0;
		}
		
		for ( var c in col ){
			if ( col[c] == 100 ){
				col[c] = Math.floor( Math.random() * 150 ) + 38;
			}
		}
		color = "#" + (col[0] * 256 * 256 + col[1] * 256 + col[2]).toString(16);
		return color;
	}
};
	

//create input dialog of demand
D6.getInputDemandSumup = function() {
	var work = {};
	var ret = {};
	var title = {};
	var pdata = {};

	//pick up related consName
	for( var c in D6.scenario.defInput ) {
		if ( D6.scenario.defInput[c].demand > 0 ){
			work[D6.scenario.defInput[c].cons]= true;
			ret[D6.scenario.defInput[c].cons]= {};
		}
	}

	//set data
	var inhtml = "";
	for( var i in D6.doc.data ) {
		//loop in doc.data and check with defInput
		var definp = D6.scenario.defInput[i.substr(0,4)];
		if ( work[definp.cons] ) {
			//in case of related class
			inhtml = this.createComboBox( i, true );
			//ret[consName][ID][1-6]
			var count = parseInt(i.substr(4,2));
			title[definp.cons] = D6.consListByName[definp.cons][0].addable;
			if( !ret[definp.cons][count] ) ret[definp.cons][count] = [];
			ret[definp.cons][count][definp.demand] = inhtml;
		}
	}
		
	pdata.data = ret;
	pdata.title = title;
		
	return pdata;
};

//create input diakog 
D6.getInputDemandLog = function() {
	var ret = [];
	for ( var t=0 ; t<24 ; t++ ){
		ret[t] = this.createComboBox( "i056" + (t+1), true );
	}
	return ret;
};
	

