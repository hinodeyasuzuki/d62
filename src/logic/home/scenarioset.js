/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * scenarioset.js
 *
 *	scenario setting of diagnosis is defined
 *	include list of logics, consumptions and questions
 *
 * License: MIT
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/06/15 original ActionScript3 version
 *								2011/10/31 set 40 measures
 *								2013/09/24 format design pattern
 * 								2016/04/12 ported to JavaScript
 *
 */

const scenario = {
  //list of scenario
  defCons: {},
  defMeasures: {},
  defEquipment: {},
  defEquipmentSize: {},
  defInput: {},
  defSelectValue: {},
  defSelectData: {},

  //series of questions
  defQuesOrder: [],
};

// getLogicList() -------------------------------------------
//		construct consumption class and set to logicList[]
// return
//		logicList[]
const getLogicList = function () {
  let logicList = {};

  // in case of create new consumption class, write here to use in D6
  // in some case, the order is important
  logicList["consTotal"] = this.consTotal;
  logicList["consEnergy"] = this.consEnergy;
  logicList["consSeason"] = this.consSeason;
  logicList["consHWsum"] = this.consHWsum;
  logicList["consHWshower"] = this.consHWshower;
  logicList["consHWtub"] = this.consHWtub;
  logicList["consHWdresser"] = this.consHWdresser;
  logicList["consHWdishwash"] = this.consHWdishwash;
  logicList["consHWtoilet"] = this.consHWtoilet;
  logicList["consCOsum"] = this.consCOsum;
  logicList["consACcool"] = this.consACcool;
  logicList["consHTsum"] = this.consHTsum;
  logicList["consHTcold"] = this.consHTcold;
  logicList["consACheat"] = this.consACheat;
  logicList["consAC"] = this.consAC;
  logicList["consRFsum"] = this.consRFsum;
  logicList["consRF"] = this.consRF;
  logicList["consLIsum"] = this.consLIsum;
  logicList["consLI"] = this.consLI;
  logicList["consTVsum"] = this.consTVsum;
  logicList["consTV"] = this.consTV;
  logicList["consDRsum"] = this.consDRsum;
  logicList["consCRsum"] = this.consCRsum;
  logicList["consCR"] = this.consCR;
  logicList["consCRtrip"] = this.consCRtrip;
  logicList["consCKpot"] = this.consCKpot;
  logicList["consCKcook"] = this.consCKcook;
  logicList["consCKrice"] = this.consCKrice;
  logicList["consCKsum"] = this.consCKsum;
  logicList["consOTother"] = this.consOTother;

  ///fix in scenarofix.js
  this.fix_consParams();

  return logicList;
};

//setDefs() -------------------------------------------------------
//		definition of questions and measures copied from EXCEL file
// set
//		defMeasures[]: 		measures setting
//		defInput[]: 		question setting
//		defSelectValue[]: 	selection setting caption list
//		defSelectData[]: 	selection setting data list
//		defQuesOrder[]: 	series of question
//		defEquipment[]: 	setting of equipments --not use now--
//		defEquipmentSize[]: setting of equipment size --not use now--
const setDefs = function () {
  let defMeasures = {};
  let defInput = {};
  let defSelectValue = {};
  let defSelectData = {};
  let defQuesOrder = [];
  let defEquipment = {};
  let defEquipmentSize = {};

  // defMeasures[measure] ------------------------------------------
  //		measure : measure code (string) same to name below
  // mid			max 3 digit identify number need not to overlap
  // name 		measure code
  // title		measure title
  // easyness		the factor of easy to do
  // refCons 		related consumption class code
  // titleShort 	short title less than 30 charactors
  // joyfull		joyfull detail discription
  // level		suggest level 0:anytime, 1:only easy case , 5: only detail case
  // figNum		figure number
  // lifeTime		lifetime of equipments. year except last charactor is "h"
  // price		inital cost
  // roanShow		show roan simulation, if true
  // standardType	equipment name of orginal type
  // hojoGov		subsidy by national government
  // advice		advice to conqure this measure
  // lifestyle	no need to pay initial cost if 1
  // season		advice season, "wss" w:winter, s:summer, s:spring. in case
  //					not to advice, set "0" in spite of charactor
  //
  //	calculation logic is descrived in each consumption class

  //defined in EXCEL sheet

  // defInput[inname] ---------------------------------------------------------------
  //		definition of questions copied from EXCEL file
  //		inname is "i" + num
  //
  //	cons 		related consumption code
  //	title 		question
  //	unit 		unit of data
  //	text 		detail description of question
  //	inputType 	input method text/radio/sel/check
  //	right 		if set 1, align is right
  //	postfix 	automatic pre deal
  //	nodata 		show data in case of data is -1
  //	varType 	type of data
  //	min			minimum data
  //	max			maximum	data
  //	defaultValue	default data
  //

  // defSelectValue[selname] : caption array
  // defSelectData[selname]  : data array
  //		selname is "sel" + num

  //defined in EXCEL sheet

  // prefecture definition ----------------------------------------------------
  this.scenario.defSelectValue["sel021"] = ["select", "hokkaido"];
  this.scenario.defSelectData["sel021"] = ["-1", "1"];
  this.scenario.defSelectValue["sel022"] = ["select", "north", "south"];
  this.scenario.defSelectData["sel022"] = ["-1", "1", "2"];

  // input list which impact average
  this.defCalcAverage = ["i001", "i005", "i021"];

  // evaluation method of measures
  this.measuresSortChange = "i010"; // input code
  this.measuresSortTarget = [
    "co2ChangeOriginal",
    "co2ChangeOriginal",
    "costTotalChangeOriginal",
    "co2ChangeW1Original",
    "co2ChangeW2Original"
  ];

  //additional question list definition. this can be changed by focus.js
  this.scenario.defEasyQues = [
    {
      title: "easy input",
      cname: "easy01",
      ques: [
        "i021",
        "i001",
        "i002",
        "i008",
        "i051",
        "i061",
        "i063",
        "i064",
        "i075",
        "i101",
        "i103",
        "i105",
        "i116",
        "i201",
        "i202",
        "i204",
        "i205",
        "i263",
        "i501",
        "i601",
        "i701"
      ]
    },
    {
      title: "Action Point",
      cname: "action01",
      ques: [
        "i502",
        "i501",
        "i621",
        "i601",
        "i205",
        "i041",
        "i237",
        "i263",
        "i061",
        "i003",
        "i001",
        "i105",
        "i106",
        "i116",
        "i121",
        "i421",
        "i721",
        "i821"
      ]
    }
  ];

  //series of questions default
  this.scenario.defQuesOrder = [
    "i021",
    "i001",
    "i002",
    "i008",
    "i051",
    "i061",
    "i063",
    "i064",
    "i075",
    "i101",
    "i103",
    "i105",
    "i116",
    "i201",
    "i202",
    "i204",
    "i205",
    "i263",
    "i501",
    "i601",
    "i701"
  ];

  // copy to D6 class instance
  // this.defMeasures = defMeasures;
  // this.defInput = defInput;
  // this.defSelectValue = defSelectValue;
  // this.defSelectData = defSelectData;
  // this.defEquipment = defEquipment;
  // this.defEquipmentSize = defEquipmentSize;

};

export { scenario, getLogicList, setDefs };