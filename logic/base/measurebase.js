/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * measurebase.js  
 * 
 *  MeasureBase Class, effect and detail of measures
 * 
 * calculation code is written in cons class not in this measure class
 * selection of measure is dealed in this class and send to cons class
 * 
 * License:	MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/08/23 designed as ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 
 * init()
 * Constructor()			copy definition
 * 
 * clearMeasure()			clear
 * setzero()				initialize to no effect
 * 
 * calcSave()				calculate co2 and cost reduction of each measure
 * calcReduceRate()			calculate reduction by reduce rate
 * calcReduceRateOne()
 * calcReduceRateWithParts()
 * 
 * addReduction()			select and add one measure
 * 
 * calc()					in case want to calculate only one measure
 * measureSumMonth()		sum 12 month
 */

//Inherited class of Energy
class MeasureBase extends Energy {

	//constructor, copy definition from scenarioset.js
	constructor(consInstance, mdef, mesIDP) {
		super();

		//------declare of member value---------------------------
		this.mesID = 0;						//measure ID (serial number)
		this.mesdefID = 0;				//measure ID (defined number)
		this.subID = 0;						//equip/room ID
		this.groupID = 0;					//related group ID
		this.measureName = "";		//measure Name Code

		//related consumption
		this.cons = "";						//related consumption class instance

		//status
		this.selected = false;		//is selected
		this.available = false;		//is available to calculate

		//reduction rate (common)
		this.reduceRate = 0;

		//abstract of parameters
		this.title = "";					//detail name
		this.titleShort = "";			//short name to use in graph, max 10 charactors
		this.priceNew = 0;				//price of new low energy equipment, yen
		this.priceOrg = 0;				//price of new ordinal equipment, yen
		this.lifeTime = 0;				//lifetime of equipment ,year
		this.lifestyle = 2;				//is lifestyle measure? 1:lifestyle , 2 not lifestyle need to buy

		this.def = "";						//definition

		//priority to use as cost , not use common method
		this.costUnique;

		//merit through this measure, in variable situation 
		this.co2Change = 0;				//CO2 emission change, minus is saving kg/year
		this.co2ChangeW1 = 0;			//weighted value include CO2 and easiness  
		this.co2ChangeW2 = 0;			//weighted value 2 include CO2 and easiness  
		this.costOtherChange = 0;	//price of base charge change
		this.costChange = 0;			//cost change include base charge yen/year
		this.costTotalChange = 0;	//cost change include base charge and install cost
		this.payBackYear = 0;			//pay back year of install cost
		this.easyness = 0;				//easyness 1-5

		//merit through this measure, in default no selected situation
		this.co2ChangeOriginal = 0;		//CO2 emission change, minus is saving kg/year
		this.costOriginal = 0;				//cost related to this measure yen/year 
		this.costChangeOriginal = 0;	//cost change include base charge yen/year
		this.costTotalChangeOriginal = 0;	//cost change include base charge and install cost yen/year

		//merit through this measure, in select situation, in order to sum total reduction 
		this.co2ChangeSumup = 0;			//CO2 emission change, minus is saving kg/year
		this.costSumup = 0;						//cost related to this measure yen/year 
		this.costChangeSumup = 0;			//cost change include base charge yen/year
		this.costTotalChangeSumup = 0;	//cost change include base charge and install cost yen/year

		//advice message
		this.advice = "";					//advice messeage
		this.joyfull = "";				//advice message of easy way
		this.figNum = 0;					//picture number

		//subsidy informataion
		this.hojoGov = 0;					//national subsidy
		this.genzeiGov = 0;				//national tax reduction
		this.hojoInfo = "";				//text to describe subsidy and tax reduction

		// not to show cost in case of change to public transport
		this.notShowCost = false;

		//params
		this.def = mdef;
		this.measureName = mdef["name"];			//measure class name
		this.cons = consInstance;					//related consumption class
		this.mesID = mesIDP;
		this.mesdefID = mdef["mid"];

		this.title = mdef["title"];
		this.titleShort = mdef["titleShort"];
		this.lifeTime = mdef["lifeTime"];
		this.priceOrg = mdef["price"];
		this.groupID = this.cons.groupID;
		this.subID = this.cons.subID;
		this.lifestyle = mdef["lifestyle"];
		this.advice = mdef["advice"];
		this.joyfull = mdef["joyfull"];
		this.figNum = mdef["figNum"];
		this.priceNew = mdef["price"];
		this.priceOrg = mdef["price"];
		this.easyness = mdef["easyness"];
		this.relation = mdef["relation"];
	}


	//clear and initialize
	clearMeasure() {
		this.priceNew = 0;
		this.lifeTime = 0;
		this.co2Change = 0;
		this.co2ChangeW1 = 0;
		this.co2ChangeW2 = 0;
		this.costChange = 0;
		this.payBackYear = 0;
		this.costOtherChange = 0;
		this.costTotalChange = 0;
		this.co2ChangeSumup = 0;
		this.costChangeSumup = 0;
		this.costTotalChangeSumup = 0;
		this.available = false;
		this.costUnique = 0;
		this.priceOrg = 0;
		this.price = 0;

		this.clear();
	}

	//calculate save cost and CO2 by each energy change, called by D6.calcMeasureOne()
	calcSave() {
		//calculate CO2
		this.calcCO2();

		this.co2Change = this.co2 - this.cons.co2;

		//weighted value include CO2 and easiness  
		this.co2ChangeW1 = this.co2Change * this.def.easyness
			* (this.def.lifestyle == 1 ? 2 : 1);
		this.co2ChangeW2 = this.co2Change
			* this.def.easyness * this.def.easyness
			* (this.def.lifestyle == 1 ? 3 : 1);

		//calculate cost
		if (this.costUnique != 0 && !isNaN(this.costUnique)) {
			this.cost = this.costUnique;
		} else {
			this.calcCost();
		}
		this.costChange = (this.cost == 0 ? 0 : this.cost - this.cons.cost);

		//do not display measures
		if (this.def.easyness < 0) {
			this.co2Change = 0;
			this.costChange = 0;
		}

		//save as original value if no measure is selected
		if (D6.isOriginal || this.co2ChangeOriginal == 0) {
			this.co2Original = this.co2;
			this.costOriginal = this.cost;
			this.co2ChangeOriginal = this.co2Change;
			this.costChangeOriginal = this.costChange;
			this.co2ChangeW1Original = this.co2ChangeW1;
			this.co2ChangeW2Original = this.co2ChangeW2;
		}

		//calculate total cost include install cost
		if (this.priceNew == 0) this.priceNew = this.priceOrg;
		if (this.priceNew >= 0 && this.lifeTime > 0) {
			this.costTotalChange = this.costChange + this.priceNew / this.lifeTime / 12;

			//payback year
			if (this.costChange > 0) {
				this.payBackYear = 999;
			} else {
				this.payBackYear = Math.min(Math.round(-this.priceNew / this.costChangeOriginal / 12), 999);
			}
		} else {
			this.costTotalChange = this.costChange;
		}

		if (D6.isOriginal) {
			this.costTotalChangeOriginal = this.costTotalChange;
		}

	}


	//set reduction zero, or initialize by copy consumption data
	setzero() {
		this.copy(this.cons);
	};

	//calculate saving amount by reduction rate
	calcReduceRate(reduceRate) {
		this.copy(this.cons);
		this.multiply(1 - reduceRate);
	}

	//calculate saving amount of selected energy by reduction rate
	calcReduceRateOne(target, reduceRate) {
		this.copy(this.cons);
		this[target] = this.cons[target] * (1 - reduceRate);
	}

	//expand reduction rate to sub category
	calcReduceRateWithParts(reduceRate, partCons) {
		this.calcReduceRate(reduceRate);
		for (var c in partCons) {
			this[partCons[c].consName] = new Energy();
			this[partCons[c].consName].copy(partCons[c]);
			this[partCons[c].consName].multiply(1 - reduceRate);
		}
	}

	//select and add this measure, and set reduction value
	addReduction() {
		var margin = new Energy();

		margin.copy(this);
		margin.sub(this.cons);

		//expand difference to related consumption
		this.cons.addReductionMargin(margin, this.cons.consName);
	}

	//calculation of measure, in case want to calculate one measure 
	//
	//	in standard process, D6.calcMeasures() directly call cons.calcMeasure in consumption class. 
	//
	calc() {
		this.clearMeasure();					//clear data
		this.calcMeasure(this.measureName);	//call consumption class 
		this.calcSave();						//calc saving CO2 and cost
	}

	//sum up 12 months, in case of calculate by month
	measureSumMonth(source, month) {
		for (var i in this.Unit.co2) {
			this[i] += source[i] * month;
		}
		this.co2 += source.co2 * month;
		this.co2Change += source.co2Change * month;
		this.co2ChangeOriginal += source.co2ChangeOriginal * month;
		this.cost += source.cost * month;
		this.costChange += source.costChange * month;
		this.costTotalChange += source.costTotalChange * month;
		this.costOriginal += source.costOriginal * month;
		this.costChangeOriginal += source.costChangeOriginal * month;
		this.costTotalChangeOriginal += source.costTotalChangeOriginal * month;
	}

	//room/equip name discripotion
	setRoomTitle(subname) {
		this.title = subname + "の" + this.title;
		this.titleShort = this.titleShort + "(" + subname + ")";

	}

}



