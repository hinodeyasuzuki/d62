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

import Energy from "./energy.js";
import { D6 } from "../d6.js";

//Inherited class of Energy
export default class ConsBase extends Energy {

  measures = []; //related instanses of measure
  // name of related measures is declared in each consumption definition
  //names, codes
  title = ""; //caption of this consumption
  consName = "consXX"; //name of consumption "cons" +  2 charactors
  consCode = ""; //code of consumption written in 2 charactors
  subID = 0; //id in same kind of consumtion, rooms or equipments
  groupID = 0; //consumption group id
  inputGuide = ""; //guide message for input

  //structure
  consShow = []; //other main consumption instances list
  sumCons = ""; //sum side consumption instance
  sumCons2 = ""; //sum related side of consumption
  sumConsName = ""; //sum side consumption name
  sumCons2Name = ""; //sum related side of consumption name
  partCons = []; //part side consumption instances
  partCons2 = []; //part related side consumption instance
  partConsName = ""; //part side name
  partCons2Name = ""; //part related side name
  residueCalc = "yes"; //calc residue in this brother consumption ( yes or not)

  //calclation parameters
  performance = ""; //performance factor
  mainSource = ""; //main energy source
  co2Original = ""; //CO2 in case of no measures are selected
  costOriginal = ""; //cost in case of no measures are selected
  julesOriginal = ""; //energy consumption in case of no measures are selected

  //display
  color = ""; //fill color in graph

  //type of calclation
  total = false; //in case of reprezent all of related consumption
  // for example, tv consumption not each equipments but total.
  orgCopyNum = 0; //count of same consumption
  addable = ""; //in case of add consumption set this postfix

  // pre calculation
  precalc() {
    this.clear();
  }

  // calculation
  calc() {
    this.clear();
  }

  //dummy definition, main routine is defined in each consumption class
  calc2nd() {
  }

  //calculation adjust
  calcAdjust(energyAdj) {
    this.multiplyArray(energyAdj); //main adjust

    //add adjust for some calculation
    this.calcAdjustStrategy(energyAdj);
  }

  //dummy definition, add adjust
  calcAdjustStrategy(energyAdj) { }

  // in case of monthly calculation
  consSumMonth(source, month) {
    for (var i in this.Unit.co2) {
      this[i] += source[i] * month;
    }
    this.co2 += source.co2 * month;
    this.cost += source.cost * month;
  }

  //--------- calculation of each measures ---------------------------------

  //main calculation of measures , defined in each classes
  calcMeasure() { }

  //measures initialize, fit to consumption
  calcMeasureInit() {
    for (var mes in this.measures) {
      //set reduction zero
      this.measures[mes].setzero();
    }
  }

  // when select measure, reduce consumption with related consumption link
  //		called by addReduction in measures files
  //		originalConsName: consumption name of original in chain
  //		sourceConsName: consumption name called by
  addReductionMargin(margin, originalConsName, sourceConsName) {
    var ccons;
    var pcons;
    var fromPart;

    //execute reduction of consumption
    this.add(margin);
    this.calcCO2(); //calculate CO2, cost and energy
    //this.calcCost();	//costUniqueで強制設定された対策がキャンセルされてしまうため不要
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
    if (this.consName == "consHWsupply") {
      var mulmargin = Object.create(margin);
      if (this.consHTsum.useHW) {
        // Use House Heating - fix consHTsum
        //	hotwaterHeatingRate of mulmargin
        mulmargin.multiply(this.hotwaterHeatingRate);
        this.consHTsum.add(mulmargin);
        this.consHTsum.calcCO2();		//calculate CO2, cost and energy
        this.consHTsum.calcCost();
        this.consHTsum.calcJules();

      } else {
        //Use Room partial heating
        var ht = this.consListByName["consACheat"];
        var en = 0;

        //Add co2 of hot water heating 
        for (var k in ht) {
          if (k && ht[k].useHW) {
            en += ht[k].co2;
          }
        }
        //reduction
        var submargin = new Energy();
        submargin.clear();
        if (en) {
          for (k in ht) {
            if (k && ht[k].useHW) {
              mulmargin = Object.create(margin);
              mulmargin.multiply(ht[k].co2 / en);
              submargin.add(mulmargin);
              ht[k].add(mulmargin);
              ht[k].calcCO2();		//calculate CO2, cost and energy
              ht[k].calcCost();
              ht[k].calcJules();
            }
          }
        }
        // sum up each room
        this.consHTsum.add(submargin);
        this.consHTsum.calcCO2();		//calculate CO2, cost and energy
        this.consHTsum.calcCost();
        this.consHTsum.calcJules();
      }
    }
  }

  //calclate to sub part reduction, take rate of each sub consumption for consern
  addReductionMargin2Part(
    pconsList,
    margin,
    originalConsName,
    sourceConsName
  ) {
    var submargin = new Energy();
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
  }

  //set input data
  input(InDataCode, defaultData) {
    var ret;
    //return only average if average mode
    if (
      this.averageMode &&
      !(
        InDataCode == "i021" ||
        InDataCode == "i022" ||
        InDataCode == "i023" ||
        InDataCode == "i024" ||
        InDataCode == "i001"
      )
    ) {
      if (this.scenario.defCalcAverage.indexOf(InDataCode) == -1) {
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
  }

  //set 2seasons input data
  input2seasons(InDataCode1, InDataCode2, defaultData) {
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
  }

  //get equip parameters
  getEquipParameters(year, size, sizeThreshold, defEquip) {
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
  }

  //room/equip id
  setsubID(num) {
    this.subID = num;
    if (this.titleList) {
      this.title = this.titleList[num];
    }
  }

  //is this measure selected?
  isSelected(mName) {
    if (!this.measures[mName]) {
      return false;
    } else {
      return this.measures[mName].selected;
    }
  }

  //get size rank
  //	val : value, thresholdList: list of value to get rank
  getIndex(val, thresholdList) {
    for (var i = 0; i < thresholdList.length; i++) {
      if (val < thresholdList[i]) {
        return i;
      }
    }
    return thresholdList.length;
  }
}


