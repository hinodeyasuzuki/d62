/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * diagnosis.js 
 * 
 * D6 Main Class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * need d6_construct, d6_calccons, d6_calcmeasures, d6_calcaverage, d6_setvalue, d6_tools
 * 
 * construct();
 *   setscenario()					initialize diagnosis structure by scenario file
 *   addMeasureEachCons()			add measure definition
 *   addConsSetting()				add consumption definition 
 
 * calcCons()					calculate consumption
 * calcConsAdjust()				adjust consumption

 * calcMeasures()				calculate measure
 * calcMeasuresLifestyle()		calculate all measures and select lifestyle
 * calcMeasuresNotLifestyle()	calculate all measures and select not lifestyle
 * calcMeasuresOne()			calculate in temporal selection
 * calcMaxMeasuresList()		automatic select max combination 

 * calcAverage()				get avearage consumption
 * rankIn100()					get rank				

 * inSet()						input data setter
 * measureAdd()					set select flag and not calculate 
 * measureDelete()				clear select flag and not calculate 

 * getGid()						get group id
 * getCommonParameters()		result common parameters
 * 
 * toHalfWidth()
 * ObjArraySort()
 * 
 * other D6 class
 * 		D6.disp		disp.js, disp_input.js, disp_measure.js
 * 		D6.senario	scenarioset.js
 * 
 */

import { unit } from "./areaset/unit.js";
import { area } from "./areaset/area.js";
import { acload } from "./areaset/acload.js";
import { acadd } from "./areaset/acadd.js";
import { accons } from "./areaset/accons.js";

import { doc } from "./base/doc.js";
import energy from "./base/energy.js";
import ConsBase from "./base/consbase.js";

import { ConsAC } from "./home/consAC.js";
import { ConsACcool } from "./home/consACcool.js";
import { ConsACheat } from "./home/consACheat.js";
import { ConsCKcook } from "./home/consCKcook.js";
import { ConsCKpot } from "./home/consCKpot.js";
import { ConsCKrice } from "./home/consCKrice.js";
import { ConsCKsum } from "./home/consCKsum.js";
import { ConsCOsum } from "./home/consCOsum.js";
import { ConsCR } from "./home/consCR.js";
import { ConsCRsum } from "./home/consCRsum.js";
import { ConsCRtrip } from "./home/consCRtrip.js";
import { ConsDRsum } from "./home/consDRsum.js";
import { ConsHTcold } from "./home/consHTcold.js";
import { ConsHTsum } from "./home/consHTsum.js";
import { ConsHWdishwash } from "./home/consHWdishwash.js";
import { ConsHWdresser } from "./home/consHWdresser.js";
import { ConsHWshower } from "./home/consHWshower.js";
import { ConsHWsum } from "./home/consHWsum.js";
import { ConsHWtoilet } from "./home/consHWtoilet.js";
import { ConsHWtub } from "./home/consHWtub.js";
import { ConsLI } from "./home/consLI.js";
import { ConsLIsum } from "./home/consLIsum.js";
import { ConsOTother } from "./home/consOTother.js";
import { ConsRF } from "./home/consRF.js";
import { ConsRFsum } from "./home/consRFsum.js";
import { ConsSeason } from "./home/consSeason.js";
import { ConsTV } from "./home/consTV.js";
import { ConsTVsum } from "./home/consTVsum.js";
import { ConsEnergy } from "./home/consEnergy.js";
import { ConsTotal } from "./home/consTOTAL.js";

import { scenario, getLogicList, setDefs } from "./home/scenarioset.js";
import { setscenario, addMeasureEachCons, addConsSetting } from "./base/d6_construct.js";
import { fix_consParams, areafix } from "./areaset/scenariofix.js";

import { inSet, measureAdd, measureDelete } from "./base/d6_setvalue.js";
import { toHalfWidth, ObjArraySort } from "./base/d6_tools.js";

import { calcAverage, rankIn100 } from "./base/d6_calcaverage.js";
import { calcCons, calcConsAdjust, getTargetConsList } from "./base/d6_calccons.js";
import { calcMeasures, calcMeasuresLifestyle, calcMeasuresNotLifestyle, calcMeasuresOne, clearSelectedMeasures, calcMaxMeasuresList } from "./base/d6_calcmeasures.js";

import { getAllResult, getAverage, getAverage_graph, getItemize, getItemizeGraph, dataItemize, getMonthly, getGid, getCommonParameters, getConsShow } from "./base/d6_get.js";
import { getMeasure, getMeasureDetail, getMeasuresDetailCommon, getMeasure_title, getMeasure_titleShort } from "./base/d6_getmeasure.js";
import { getDemandGraph, getInputDemandSumup, getInputDemandLog } from "./base/d6_getdemand.js";


class d6 {

  //instances(results)
  consList = []; //consumption full list
  consListByName = []; //consumption list by consname
  consShow = []; //major consumption list by conscode
  measureList = []; //measure list
  monthly = []; //monthly energy
  resMeasure = []; //result of measures list

  mesCount = 0; //count of measures
  consCount = 0; //count of consumptions

  average = {
    consList: ""
  }; //average of consumptions

  isOriginal = true; //in case of no measure is selected
  sortTarget = "co2ChangeOriginal"; //by which measureas are sorted, changeable by input

  //view / Debug set. set in workercalc(start,*)
  viewparam = {};
  debugMode = false;

  // parameters used in button view
  nowQuesCode = 0;		//now question code "i" + num
  nowQuesID = -1;			//now index in series of questions
  quesOrder = [];			//question code list

  //constructor
  constructor(Unit,Area) {
    this.Unit = Unit;
    this.Area = Area;
  }

  construct = function (a, b, c) {

    this.acload = acload;
    this.acadd = acadd;
    this.accons = accons;

    this.doc = doc;
    // this.energy = new energy();
    // this.consBase = new ConsBase();
    this.calcAverage = calcAverage;
    this.rankIn100 = rankIn100;

    //calcCons
    this.calcCons = calcCons;
    this.calcConsAdjust = calcConsAdjust;
    this.getTargetConsList = getTargetConsList;

    //calcMeasure
    this.calcMeasures = calcMeasures;
    this.calcMeasuresLifestyle = calcMeasuresLifestyle;
    this.calcMeasuresNotLifestyle = calcMeasuresNotLifestyle;
    this.calcMeasuresOne = calcMeasuresOne;
    this.clearSelectedMeasures = clearSelectedMeasures;
    this.calcMaxMeasuresList = calcMaxMeasuresList;

    //cons
    this.consAC = new ConsAC();
    this.consACcool = new ConsACcool();
    this.consACheat = new ConsACheat();
    this.consCKcook = new ConsCKcook();
    this.consCKpot = new ConsCKpot();
    this.consCKrice = new ConsCKrice();
    this.consCKsum = new ConsCKsum();
    this.consCOsum = new ConsCOsum();
    this.consCR = new ConsCR();
    this.consCRsum = new ConsCRsum();
    this.consCRtrip = new ConsCRtrip();
    this.consDRsum = new ConsDRsum();
    this.consHTcold = new ConsHTcold();
    this.consHTsum = new ConsHTsum();
    this.consHWdishwash = new ConsHWdishwash();
    this.consHWdresser = new ConsHWdresser();
    this.consHWshower = new ConsHWshower();
    this.consHWsum = new ConsHWsum();
    this.consHWtoilet = new ConsHWtoilet();
    this.consHWtub = new ConsHWtub();
    this.consLI = new ConsLI();
    this.consLIsum = new ConsLIsum();
    this.consOTother = new ConsOTother();
    this.consRF = new ConsRF();
    this.consRFsum = new ConsRFsum();
    this.consSeason = new ConsSeason();
    this.consTV = new ConsTV();
    this.consTVsum = new ConsTVsum();
    this.consTotal = new ConsTotal();
    this.consEnergy = new ConsEnergy();

    //setting
    this.setscenario = setscenario;
    this.scenario = scenario;
    this.getLogicList = getLogicList;
    this.setDefs = setDefs;
    this.addMeasureEachCons = addMeasureEachCons;
    this.addConsSetting = addConsSetting;

    this.areafix = areafix;
    this.fix_consParams = fix_consParams;
    
    //set
    this.inSet = inSet;
    this.measureAdd = measureAdd;
    this.measureDelete = measureDelete;

    //get
    this.getAllResult = getAllResult;
    this.getAverage = getAverage;
    this.getAverage_graph = getAverage_graph;
    this.getItemize = getItemize;
    this.getItemizeGraph = getItemizeGraph;
    this.dataItemize = dataItemize;
    this.getMonthly = getMonthly;
    this.getGid = getGid;
    this.getCommonParameters = getCommonParameters;
    this.getConsShow = getConsShow;
    this.getMeasure = getMeasure;
    this.getMeasureDetail = getMeasureDetail;
    this.getMeasuresDetailCommon = getMeasuresDetailCommon;
    this.getMeasure_title = getMeasure_title;
    this.getMeasure_titleShort = getMeasure_titleShort;
    this.getDemandGraph = getDemandGraph;
    this.getInputDemandSumup = getInputDemandSumup;
    this.getInputDemandLog = getInputDemandLog;

    //tool
    this.toHalfWidth = toHalfWidth;
    this.ObjArraySort = ObjArraySort;

    this.setscenario(a, b, c);
  };

  //calculate
  calculateAll = function () {
    this.Area.setPersonArea(
      this.doc.data.i001,
      this.doc.data.i021,
      this.doc.data.i023
    );
    //D6.calcCons();
    this.calcAverage();
    this.calcMeasures(-1);
  };

  //log
  calclog = "";
  calcshow = "";
}

var Unit = new unit();
var Area = new area(Unit);
var D6 = new d6(Unit, Area);
window.Unit = Unit;
window.Area = Area;
window.D6 = D6;

//初期化
D6.construct();
D6.calculateAll();

export { D6 };
