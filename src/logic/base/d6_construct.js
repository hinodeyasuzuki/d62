/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * d6_construct.js 
 * 
 * D6 Constructor Class
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/17 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2018/03/04 divided only constructor functions
 * 
 * setscenario()				initialize diagnosis structure by scenario file
 * addMeasureEachCons()			add measure definition
 * addConsSetting()				add consumption definition 
 */

import { MeasureBase } from "../base/measurebase.js";

/* setscenario -------------------------------------------------------------
 * 		set scenario by definition and create logic structure
 * parameters:
 *		prohibitQuestions		array of prohibitQuestions or "add" code for not initialize
 *		allowedQuestions
 *		defInput
 * return:
 *		none
 * set:
 *		-create new consumption instance in logicList
 *		-link to consList, consListByName, consShow
 *		-each consumption instance include measures, sumCons, subCons etc.
 */
const setscenario = function (prohibitQuestions, allowedQuestions, defInput) {
	let i, j;
	let notinit = false;

	if (prohibitQuestions == "add") {
		notinit = true;
	}
	if (!prohibitQuestions) {
		prohibitQuestions = [];
	}
	if (!allowedQuestions) {
		allowedQuestions = [];
	}

	// step 1 : implementation of logics ------------------------
	if (!notinit) {
		this.setDefs();		//set questions and measures

		this.areafix();		//fix by area

		for (let d in defInput) {
			if (defInput[d][2]) {
				this.scenario.defInput[defInput[d][0]][defInput[d][1]] = defInput[d][2];
			}
		}
		this.logicList = this.getLogicList();
	}
	//let consList = this.consList;

	// step 2 : Implementation of consumption class -----------
	//
	this.consCount = 0;	//counter for consList
	let logic;
	let tlogic;

	//create consumption class by logic, children of consTotal
	for (logic in this.logicList) {
		tlogic = this.logicList[logic];
		this.consListByName[tlogic.consName] = [];	//list by consName

		if (tlogic.sumConsName == "consTotal" || tlogic.consName == "consTotal") {

			//fisrt set to consList
			this.consList[this.consCount] = tlogic;

			//set another access path
			this.consShow[tlogic.consCode] = tlogic;
			this.consListByName[tlogic.consName].push(tlogic);
			this.consCount++;
		}
	}

	//create consumption class,  grandson of consTotal
	//  create grandson after children
	for (logic in this.logicList) {
		tlogic = this.logicList[logic];								//shortcut

		//not direct connect to consTotal
		//implement by each equips/rooms
		if (tlogic.sumConsName != "consTotal" && tlogic.consName != "consTotal") {
			if (tlogic.orgCopyNum == 0) {
				this.consList[this.consCount] = tlogic;
				this.consListByName[tlogic.consName].push(tlogic);
				this.consCount++;
			} else {
				for (j = 0; j <= tlogic.orgCopyNum; j++) {		// #0 is residue			
					//implementation in consList
					this.consList[this.consCount] = Object.create(tlogic);	// set copy
					//consList[this.consCount].setsubID( j );
					this.consList[this.consCount].subID = j;
					if (this.consList[this.consCount].titleList) {
						this.consList[this.consCount].title = this.consList[this.consCount].titleList[j];
					}

					//another access path
					this.consListByName[tlogic.consName].push(this.consList[this.consCount]);
					this.consCount++;
				}
			}
		}
	}

	// step 3 : resolve relation between consumption classes -------------
	let cons;
	let partconsTemp;
	let partCons;		//partition side classes to this class
	let partCons2nd;	//2nd partition side classes to this class

	for (i = 0; i < this.consList.length; i++) {
		//create relation by each cons in consList
		cons = this.consList[i];
		cons.measures = [];
		cons.partCons = [];

		//get instance of sum side class
		cons.sumCons = this.getTargetConsList(cons.sumConsName);
		cons.sumCons2 = this.getTargetConsList(cons.sumCons2Name);

		//get instance of part side class
		//    part side is not defined in this class definition, so check each
		//    part side class of which sumCons is related to this cons
		partCons = [];
		partCons2nd = [];

		for (j = 0; j < this.consList.length; j++) {
			//check each cons in consList which is part side
			partconsTemp = this.consList[j];

			// if sum part is defined as this class
			if (partconsTemp.sumConsName === cons.consName) {

				//countable rooms/equips or not
				if (partconsTemp.orgCopyNum >= 1) {

					if (cons.orgCopyNum >= 1) {
						//if this cons is countable, add only same id
						if (cons.subID == partconsTemp.subID) {
							cons.partConsName = partconsTemp.consName;
							partCons.push(partconsTemp);
						}

					} else {
						//this cons is not countable add each cons as partcons
						cons.partConsName = partconsTemp.consName;
						partCons.push(partconsTemp);
					}

				} else {
					//not countable add first cons as partCons
					partCons.push(partconsTemp);
				}
			}

			// if second sum part is defined as this class
			if (partconsTemp.sumCons2Name == cons.consName) {

				//countable rooms/equips or not
				if (partconsTemp.orgCopyNum >= 1) {

					//if this cons is countable, add only same id
					if (cons.orgCopyNum >= 1) {
						if (cons.subID == partconsTemp.subID) {
							cons.partCons2Name = partconsTemp.consName;
							partCons2nd.push(partconsTemp);
						}

					} else {
						cons.partCons2Name = partconsTemp.consName;
						partCons2nd.push(partconsTemp);
					}

				} else {
					//not countable add first cons as partCons
					partCons2nd.push(partconsTemp);
				}
			}
		}

		//set to this cons 
		if (partCons.length >= 1) {
			cons.partCons = partCons;
		} else {
			cons.partCons = "";
		}
		if (partCons2nd.length >= 1) {
			cons.partCons2 = partCons2nd;
		} else {
			cons.partCons2 = "";
		}
	}

	// step 4 : Implementation of measures -----------------------
	this.mesCount = 0;			//counter of measures 

	//add measures to each cons class
	for (i in this.consList) {
		this.addMeasureEachCons(this.consList[i]);
	}

	// in case of calculate by months, questions should be divided to months
	//	and need dataset of temperature, solar, average consumptions etc.

	// step 5 : set questions/inputs --------------------------

	//function to check is prohibited
	let isProhivitedQuestion = function (iname) {
		// definition in EXCEL
		if (iname["cons"] == "") return true;

		if (prohibitQuestions.length <= 0) {
			if (allowedQuestions.length <= 0) {
				return false;
			} else {
				if (allowedQuestions.indexOf(iname) >= 0) {
					return false;
				} else {
					return true;
				}
			}
		} else {
			if (prohibitQuestions.indexOf(iname) >= 0) {
				return true;
			} else {
				return false;
			}
		}
	};

	let iname;

	// loop each input definition
	for (iname in this.scenario.defInput) {
		//check is prohibited
		if (isProhivitedQuestion(iname)) continue;

		let defInp = this.scenario.defInput[iname];
		logic = this.logicList[defInp.cons];

		// if input has relation to consumption
		if (logic) {
			if (logic.orgCopyNum > 0) {
				//in case of countable consumption 
				for (j = 0; j < logic.orgCopyNum; j++) {
					//create one question as "iname + [1-n]"
					this.inSet(iname + (j + 1), defInp.defaultValue);
				}
			} else {
				//create one question
				this.inSet(iname, defInp.defaultValue);
			}
		}
	}

	//set easy question list
	let ilist = [];
	if (this.scenario.defEasyQues) {
		//exsit allowdquestions
		if ( allowedQuestions.length > 0 ) {
			this.scenario.defEasyQues[0].ques = allowedQuestions;
		} else {
			//prohibit question
			for (i in this.scenario.defEasyQues[0].ques) {
				if (isProhivitedQuestion(this.scenario.defEasyQues[0].ques[i])) continue;
				ilist.push(this.scenario.defEasyQues[0].ques[i]);
			}
			this.scenario.defEasyQues[0].ques = [];
			for (i in ilist) {
				this.scenario.defEasyQues[0].ques.push(ilist[i]);
			}
		}
	}

};


// addMeasureEachCons(cons)-----------------------------
//		add measures related to one consumption
//		it works not only initialize but also after
// params
//		cons :  target consumption instance
// return
//		none
// set
//		set new measures to cons.measures
const addMeasureEachCons = function (cons) {
	for (let mesname in this.scenario.defMeasures) {
		if (cons.consName != this.scenario.defMeasures[mesname].refCons) continue;
		this.measureList[this.mesCount] = new MeasureBase(cons, this.scenario.defMeasures[mesname], this.mesCount);
		cons.measures[mesname] = this.measureList[this.mesCount];
		this.mesCount++;
	}
};



// addConsSetting( consName ) ------------------------------------------------
//		add consumption instance of countable rooms/equipments
//		this function only increment setting number, so after that reconstruct all consumptions
// parameter
//		consName : consumption code(string)
// return
//		none
// set
//		increment the number of consumption setting
//		also increment part side of consumption
const addConsSetting = function (consName) {
	let cons = "";
	let pname = "";

	//check consAddSet in each logicList[]
	let rend = false;
	for (cons in this.logicList) {
		// same target is listed in consAddSet
		// for example rooms, both heating and cooling has relationship
		// see also consAC.js
		pname = this.logicList[cons].consAddSet;
		for (let t in pname) {
			if (pname[t] == consName || cons == consName) {
				this.logicList[cons].orgCopyNum = this.logicList[cons].orgCopyNum + 1;
				for (let s in pname) {
					this.logicList[pname[s]].orgCopyNum = this.logicList[pname[s]].orgCopyNum + 1;
				}
				rend = true;
				break;
			}
		}
		if (rend) break;
	}

	if (!rend) {
		// no consAddSet, ordinal addition
		this.logicList[consName].orgCopyNum = this.logicList[consName].orgCopyNum + 1;
	}
};

export { setscenario, addMeasureEachCons, addConsSetting };
