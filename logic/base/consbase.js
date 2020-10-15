/*  2017/12/10  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * ConsBase.js 
 * 
 * base class of each consumption
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * init()			initialize, set parameters when construction
 * precalc()		called just before calc(), input data treatment and clear consumption data
 * calc()			main formula to calculate consumption
 * calc2nd()		called just after calc(), in case of need to use other consumption data
 * calcMeasure()	main formula to calculate measures
 */

//resolve D6
var D6 = D6 || {};

//Inherited class of Energy
ConsBase = Object.create(Energy); //base class is energy

ConsBase.init = function() {
	//----------- declare instanses ---------------------------

	this.measures = []; //related instanses of measure
	// name of related measures is declared in each consumption definition
	//names, codes
	this.title = ""; //caption of this consumption
	this.consName = "consXX"; //name of consumption "cons" +  2 charactors
	this.consCode = ""; //code of consumption written in 2 charactors
	this.subID = 0; //id in same kind of consumtion, rooms or equipments
	this.groupID = 0; //consumption group id
	this.inputGuide = ""; //guide message for input

	//structure
	this.consShow = []; //other main consumption instances list
	this.sumCons = ""; //sum side consumption instance
	this.sumCons2 = ""; //sum related side of consumption
	this.sumConsName = ""; //sum side consumption name
	this.sumCons2Name = ""; //sum related side of consumption name
	this.partCons = []; //part side consumption instances
	this.partCons2 = []; //part related side consumption instance
	this.partConsName = ""; //part side name
	this.partCons2Name = ""; //part related side name
	this.residueCalc = "yes"; //calc residue in this brother consumption ( yes or not)

	//calclation parameters
	this.performance = ""; //performance factor
	this.mainSource = ""; //main energy source
	this.co2Original = ""; //CO2 in case of no measures are selected
	this.costOriginal = ""; //cost in case of no measures are selected
	this.julesOriginal = ""; //energy consumption in case of no measures are selected

	//display
	this.color = ""; //fill color in graph

	//type of calclation
	this.total = false; //in case of reprezent all of related consumption
	// for example, tv consumption not each equipments but total.
	this.orgCopyNum = 0; //count of same consumption
	this.addable = ""; //in case of add consumption set this postfix

	//--------- calclation of consumption ---------------------------------
	// pre calculation
	this.precalc = function() {
		this.clear();
	};

	// calculation
	this.calc = function() {
		this.clear();
	};

	//dummy definition, main routine is defined in each consumption class
	this.calc2nd = function() {};

	//calculation adjust
	this.calcAdjust = function(energyAdj) {
		this.multiplyArray(energyAdj); //main adjust

		//add adjust for some calculation
		this.calcAdjustStrategy(energyAdj);
	};

	//dummy definition, add adjust
	this.calcAdjustStrategy = function(energyAdj) {};

	// in case of monthly calculation
	this.consSumMonth = function(source, month) {
		for (var i in D6.Unit.co2) {
			this[i] += source[i] * month;
		}
		this.co2 += source.co2 * month;
		this.cost += source.cost * month;
	};

	//--------- calculation of each measures ---------------------------------

	//main calculation of measures , defined in each classes
	this.calcMeasure = function() {};

	//measures initialize, fit to consumption
	this.calcMeasureInit = function() {
		for (var mes in this.measures) {
			//set reduction zero
			this.measures[mes].setzero();
		}
	};

	// when select measure, reduce consumption with related consumption link
	//		called by addReduction in measures files
	//		originalConsName: consumption name of original in chain
	//		sourceConsName: consumption name called by
	this.addReductionMargin = function(margin, originalConsName, sourceConsName) {
		var ccons;
		var pcons;
		var fromPart;

		//execute reduction of consumption
		this.add(margin);
		this.calcCO2(); //calculate CO2, cost and energy
		this.calcCost();
		this.calcJules();

		//reduction chain in use of relation
		if (sourceConsName == "") {
			sourceConsName = originalConsName;
		}

		//sum side of reduction
		if (
			this.sumConsName != sourceConsName &&
			this.sumConsName != originalConsName
		) {
			// if the direction is not called by
			ccons = this.sumCons;
			if (ccons) {
				if (ccons[this.subID]) {
					ccons[this.subID].addReductionMargin(
						margin,
						originalConsName,
						this.consName
					);
				} else {
					ccons.addReductionMargin(margin, originalConsName, this.consName);
				}
			}
		}

		//sum related side of reduction
		if (
			this.sumCons2Name != "" &&
			this.sumCons2Name != sourceConsName &&
			this.sumCons2Name != originalConsName
		) {
			// if the direction is not called by
			ccons = this.sumCons2;
			if (ccons) {
				if (ccons[this.subID]) {
					ccons[this.subID].addReductionMargin(
						margin,
						originalConsName,
						this.consName
					);
				} else {
					ccons.addReductionMargin(margin, originalConsName, this.consName);
				}
			}
		}

		//part side reduction
		if (this.consCode != "TO") {
			// total consumption is excluded

			//part side
			fromPart = false;
			for (pcons in this.partCons) {
				if (
					this.partCons[pcons].consName == sourceConsName ||
					this.partCons[pcons].consName == originalConsName
				) {
					//in case of looped
					fromPart = true;
				}
			}
			if (!fromPart && this.partCons.length > 0) {
				// step to detail sub part calclation
				this.addReductionMargin2Part(
					this.partCons,
					margin,
					originalConsName,
					this.consName
				);
			}

			//part related side
			fromPart = false;
			for (pcons in this.partCons2) {
				if (
					this.partCons2[pcons].consName == sourceConsName ||
					this.partCons2[pcons].consName == originalConsName
				) {
					fromPart = true;
				}
			}
			if (!fromPart && this.partCons2.length > 0) {
				// step to detail sub part calclation
				this.addReductionMargin2Part(
					this.partCons2,
					margin,
					originalConsName,
					this.consName
				);
			}
		}

		//Cross reduction when use hot water heating in case of consHWsupply
		if ( this.consName=="consHWsupply"){
			var mulmargin = Object.create(margin);
			if ( D6.consHTsum.useHW ){
				// Use House Heating - fix consHTsum
				//	hotwaterHeatingRate of mulmargin
				mulmargin.multiply(this.hotwaterHeatingRate);
				D6.consHTsum.add( mulmargin );
				D6.consHTsum.calcCO2();		//calculate CO2, cost and energy
				D6.consHTsum.calcCost();
				D6.consHTsum.calcJules();
		
			} else{
				//Use Room partial heating
				var ht =  D6.consListByName["consACheat"];
				var en = 0;

				//Add co2 of hot water heating 
				for( var k in ht){
					if( k && ht[k].useHW){
						en += ht[k].co2;
					}
				}
				//reduction
				var submargin = Object.create(Energy);
				submargin.clear();
				if ( en ){
					for( k in ht){
						if( k && ht[k].useHW){
							mulmargin = Object.create(margin);
							mulmargin.multiply(ht[k].co2 / en);
							submargin.add(mulmargin);
							ht[k].add( mulmargin );
							ht[k].calcCO2();		//calculate CO2, cost and energy
							ht[k].calcCost();
							ht[k].calcJules();
						}
					}
				}
				// sum up each room
				D6.consHTsum.add(submargin );
				D6.consHTsum.calcCO2();		//calculate CO2, cost and energy
				D6.consHTsum.calcCost();
				D6.consHTsum.calcJules();
			}
		} 
	};

	//calclate to sub part reduction, take rate of each sub consumption for consern
	this.addReductionMargin2Part = function(
		pconsList,
		margin,
		originalConsName,
		sourceConsName
	) {
		var submargin = Object.create(Energy);
		var pcons;

		if (pconsList.length > 1) {
			//sum of part side consumptions
			var sumCo2 = 0;
			for (pcons in pconsList) {
				if (!isNaN(pconsList[pcons].co2)) {
					sumCo2 += pconsList[pcons].co2;
				}
			}

			//chech if objects not matrix
			if (
				pconsList[0].orgCopyNum >= 1 &&
				pconsList[0].subID != pconsList[1].subID
			) {
				//in case of matrix,  devide reduction acrding to consumption amount
				for (pcons in pconsList) {
					if (pconsList[pcons].co2 > 0) {
						submargin.copy(margin);
						submargin.multiply(pconsList[pcons].co2 / sumCo2);

						//calc next relation
						pconsList[pcons].addReductionMargin(
							submargin,
							originalConsName,
							this.consName
						);
					}
				}
			} else {
				//in case of objects
				//	親のmeasuresについて、pconsListにリストされているconsNameが存在する場合
				//	分割側の消費量を、対策の消費量とする（もう一度親を計算する） consAC
				//		例： mes["consACCool"] = ***; を 消費クラスで定義
				//親のIDがある場合にはそのsubIDを用いる（冷暖房部屋など）
				for (pcons in pconsList) {
					if (pconsList[pcons].co2 > 0) {
						if (pconsList[pcons].consAddSet) {
							//devide method is defined in consAddSet
							for (var pmes in this.measures) {
								var mes = this.measures[pmes];
								if (mes.selected && mes[pconsList[pcons].consName]) {
									submargin.copy(mes[pconsList[pcons].consName]);
									submargin.sub(pconsList[pcons]);
									pconsList[pcons].addReductionMargin(
										submargin,
										originalConsName,
										this.consName
									);
								}
							}
						} else {
							// not defined
							submargin.copy(margin);
							submargin.multiply(pconsList[pcons].co2 / sumCo2);
							pconsList[pcons].addReductionMargin(
								submargin,
								originalConsName,
								this.consName
							);
						}
					}
				}
			}
		}
	};

	//set input data
	this.input = function(InDataCode, defaultData) {
		var ret;
		//return only average if average mode
		if (
			D6.averageMode &&
			!(
				InDataCode == "i021" ||
				InDataCode == "i022" ||
				InDataCode == "i023" ||
				InDataCode == "i024" ||
				InDataCode == "i001"
			)
		) {
			if (D6.scenario.defCalcAverage.indexOf(InDataCode) == -1) {
				return defaultData;
			}
		}

		var InData = D6.doc.data[InDataCode];
		if (typeof InData === "undefined" || InData == -1 || InData === "") {
			//in  InData compare, user  === instead of ==
			ret = defaultData;
		} else {
			ret = InData;
			if (D6.scenario.defInput[InDataCode.substr(0, 4)].varType == "Number") {
				//convert to number
				ret = parseFloat(ret);
			}
		}
		return ret;
	};

	//set 2seasons input data
	this.input2seasons = function(InDataCode1, InDataCode2, defaultData) {
		var ret = [];
		var r0 = this.input(InDataCode1, -1);
		var r1 = this.input(InDataCode2, r0);
		if (r0 == -1) {
			if (r1 == -1) {
				r0 = r1 = defaultData;
			} else {
				r0 = r1;
			}
		}
		ret[0] = r0;
		ret[1] = r1;
		return ret;
	};

	//get equip parameters
	this.getEquipParameters = function(year, size, sizeThreshold, defEquip) {
		var ret = {};

		//get definisiton by size
		var sizeCode = sizeThreshold[0];
		for (var sizeTmp in sizeThreshold) {
			if (size > sizeThreshold[sizeTmp] * 1.001) {
				continue;
			} else {
				sizeCode = sizeThreshold[sizeTmp];
				break;
			}
		}
		var defs = defEquip[sizeCode];

		// get parameters by year
		var justbefore = -9999;
		var justafter = 99999;
		for (var defone in defs) {
			if (year <= defone) {
				if (defone < justafter) justafter = defone;
			} else {
				if (defone > justbefore) justbefore = defone;
			}
		}
		for (var parameters in defs[justbefore]) {
			ret[parameters] =
				((justafter - year) * defs[justbefore][parameters] +
					(year - justbefore) * defs[justafter][parameters]) /
				(justafter - justbefore);
		}
		return ret;
	};

	//room/equip id
	this.setsubID = function(num) {
		this.subID = num;
		if (this.titleList) {
			this.title = this.titleList[num];
		}
	};

	//is this measure selected?
	this.isSelected = function(mName) {
		if (!this.measures[mName]) {
			return false;
		} else {
			return this.measures[mName].selected;
		}
	};

	//get size rank
	//	val : value, thresholdList: list of value to get rank
	this.getIndex = function(val, thresholdList) {
		for (var i = 0; i < thresholdList.length; i++) {
			if (val < thresholdList[i]) {
				return i;
			}
		}
		return thresholdList.length;
	};
};

ConsBase.init();
