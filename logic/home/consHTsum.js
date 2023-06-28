/* 2017/12/14  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consHTsum.js 
 * 
 * calculate consumption and measures related to heating in cold area
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/14 ver.1.0 set functions
 * 								2018/03/14 			global setting fix
 * 
 * init()			initialize, set parameters when construction
 * precalc()		called just before calc(), input data treatment and clear consumption data
 * calc()			main formula to calculate consumption
 * calc2nd()		called just after calc(), in case of need to use other consumption data
 * calcMeasure()	main formula to calculate measures
 * 
 */

//resolve D6
var D6 = D6 || {};

//Inherited class of ConsBase
class ConsHTsum extends ConsBase {

	constructor() {
		super();

		//construction setting
		this.consName = "consHTsum";   	//code name of this consumption 
		this.consCode = "HT";          	//short code to access consumption, only set main consumption user for itemize
		this.title = "heating";					//consumption title name
		this.orgCopyNum = 0;            //original copy number in case of countable consumption, other case set 0
		this.groupID = "2";							//number code in items
		this.color = "#ff0000";					//color definition in graph
		this.countCall = "";						//how to point n-th equipment

		this.sumConsName = "consTotal";	//code name of consumption sum up include this
		this.sumCons2Name = "";					//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "how to use the whole house heating";

		//common parameters related to heating
		this.heatMcal;						//heating energy (Mcal/month)
		this.heatACCalcMcal;				//in case of heated by air conditioner consumption

		this.heatLoadUnit_Wood = 220 * 1.25 * 0.82;		//average heat load in wood house (W/m2)
		this.heatLoadUnit_Steel = 145 * 1.25 * 0.82;	//average heat load in concrete house (W/m2)
		this.apf = 3;											//APF annual performance factor
		this.apfMax = 4.5;								//max performance

		this.reduceRateFilterCool = 0.05;			//reduce rate of cooling by 

		this.reduceRateFilter = 0.12;					//reduce rate by clean filter
		this.reduceRateDanran = 0.303;					//reduce rate by gathering family
	}


	//change Input data to local value 
	precalc() {
		this.clear(); //clear data

		this.prefecture = this.input("i021", 13); //city, prefecture ##
		this.heatArea = D6.area.getHeatingLevel(this.prefecture);

		this.person = this.input("i001", 3); //person ##
		this.houseType = this.input("i002", 1); //standalone
		this.houseSize = D6.consShow["TO"].houseSize; //home size

		// default area heating set
		this.priceHotWater =
			this.input("i066", 1) == 1
				? (D6.area.averageCostEnergy.hotwater * this.houseSize) / 100
				: 0;

		this.heatSpace = this.input("i201", this.heatArea <= 3 ? 0.6 : 0.2); //part of heating CN
		this.heatMonth = this.input("i206", D6.area.seasonMonth.winter); //heating month

		// heat time default set
		this.heatTime = this.input("i204", this.heatArea <= 1 ? 24 : this.heatArea <= 3 ? 8 : 4); //heating time
		this.heatEquip = this.input("i202", -1);		//heating equipment
		this.heatEquip_in = this.heatEquip;

		this.heatTemp = this.input("i205", 21); //heating temperature setting
		this.priceEleSpring = this.input("i0912", -1); //electricity charge in spring/fall
		this.priceEleWinter = this.input("i0911", -1); //electricity charge in winter
		this.priceGasSpring = this.input("i0922", -1); //gas charge in spring/fall
		this.priceGasWinter = this.input("i0921", -1); //gas charge in winter
		this.consKeros = this.input("i064", -1); //consumption of kerosene
		this.hotwaterEquipType = this.input("i101", -1); //hot water temperature

		this.performanceWindow = this.input("i041", 0); //performance of window
		this.performanceWall = this.input("i042", -1); //performance of wall insulation
		this.reformWindow = this.input("i043", -1); //reform to change window
		this.reformfloor = this.input("i044", -1); //reform to change floor

		//window 
		var heatWindow = [6.5, 1.4, 1.8, 3.6 ,4.65 ,6.5, 6.5 ];
		var nowHeatWindow = heatWindow[this.performanceWindow];
		if ( this.heatArea <= 2 && nowHeatWindow > 5 ){
			//cold area default
			nowHeatWindow =  heatWindow[4];
		}
		var windowrate = 0.48;								// heat loss through window

		this.reduceRateDouble = windowrate * ( 1 - heatWindow[4]/nowHeatWindow );
		this.reduceRateUchimado = windowrate * ( 1 - 2.2 / nowHeatWindow);
		this.reduceRateLowe = windowrate * ( 1 - heatWindow[2]/nowHeatWindow );				//reduce rate by Low-e grass

		//wall
		if ( this.performanceWall == -1 ){
			if( this.heatArea <= 2 ) {
				this.performanceWall = 100;
			} else if( this.heatArea == 3 ) {
				this.performanceWall = 50;
			} else {
				this.performanceWall = 30;
			}
		}
		var wallrate = 0.19;
		this.reduceRateInsulation = wallrate * 0.5;		//reduce rate by wall inslation

	}

	calc() {
		this.priceEleSpring = D6.consShow["TO"].priceEleSpring;	//electricity charge in spring/fall
		this.priceEleWinter = D6.consShow["TO"].priceEleWinter;	//electricity charge in winter
		this.priceGasSpring = D6.consShow["TO"].priceGasSpring;	//gas charge in spring/fall
		this.priceGasWinter = D6.consShow["TO"].priceGasWinter;	//gas charge in winter

		//heat floor/room size m2
		var heatArea_m2 = this.houseSize * this.heatSpace;
		if (this.heatSpace > 0.05) {
			heatArea_m2 = Math.max(heatArea_m2, 13);		//minimum 13m2
		}

		//calculate heat energy
		var heatKcal = this.calcHeatLoad(heatArea_m2, this.heatTime, this.heatMonth, this.heatTemp);
		this.heatLoadUnit = heatKcal / heatArea_m2 / (this.heatMonth ? this.heatMonth : 3 ) / 30 / (this.heatTime ? this.heatTime : 4);
	
		//covert to monthly by seasonal data
		heatKcal *= this.heatMonth / 12;
		this.endEnergy = heatKcal;

		//guess of heat source
		if (this.heatEquip <= 0) {
			if (this.consKeros > 0
				|| D6.area.averageCostEnergy.kerosene > 1000
			) {
				//kerosene 
				this.heatEquip = 4;
			} else if (this.priceGasWinter < 0
				|| this.priceGasWinter > 4000
			) {
				//gas
				this.heatEquip = 3;
			} else {
				//electricity
				this.heatEquip = 1;
			}
		}

		//calculate residue
		var elecOver = 0;
		var coef = (this.heatEquip == 1 ? this.apf : 1);
		if (this.heatEquip == 1 || this.heatEquip == 2) {
			if (this.priceEleWinter > 0) {
				var priceMaxCons = this.priceEleWinter * 0.7
					/ D6.Unit.price.electricity
					* this.heatMonth / 12;
				if (heatKcal / coef / D6.Unit.calorie.electricity > priceMaxCons) {
					//in case that calculated electricity is more than fee
					elecOver = heatKcal - priceMaxCons * coef * D6.Unit.calorie.electricity;
					heatKcal -= elecOver;
				}
			}
		}

		//estimate of heat source
		if (this.heatEquip == 1 || this.heatEquip == 2) {
			//electricity / air conditioner
			this.mainSource = "electricity";
		} else if (this.heatEquip == 3) {
			//gas
			this.mainSource = "gas";
		} else if (this.heatEquip == 4) {
			//kerosene
			this.mainSource = "kerosene";
		} else if (this.priceHotWater > 0) {
			this.mainSource = "hotwater";
		} else {
			this.mainSource = this.sumCons.mainSource;
		}

		//calculate as air conditioner, calculate this value for change heat method
		this.calcACkwh = heatKcal / this.apf / D6.Unit.calorie.electricity;
		if (this.mainSource == "electricity" && this.heatEquip != 2) {
			//set air conditioner
			this[this.mainSource] = this.calcACkwh;
		} else {
			//other than air conditioner
			this[this.mainSource] = heatKcal / D6.Unit.calorie[this.mainSource];
		}

		//estimate from fee
		var consbyprice = -1;

		//electricity
		consbyprice = Math.max(0, this.priceEleWinter - this.priceEleSpring) / D6.Unit.price.electricity;
		if (this.priceEleSpring != -1 && this.priceEleWinter != -1) {
			if (this.hotwaterEquipType != 5 && this.hotwaterEquipType != 6) {
				this.electricity = (this.electricity * 2 + consbyprice) / 3;
			}
		} else {
			this.electricity = (this.electricity * 4 + consbyprice) / 5;
		}

		//gas
		consbyprice = Math.max(0, this.priceGasWinter - this.priceGasSpring) / D6.Unit.price.gas;
		//var gasover = 0;
		if (this.priceGasSpring != -1 && this.priceGasWinter != -1) {
			if (this.hotwaterEquipType >= 3 && this.hotwaterEquipType <= 6) {	//not gas
				this.gas = (this.gas * 3 + consbyprice) / 4;
			} else {
				this.gas = (this.gas * 2 + consbyprice) / 3;
			}
		} else {
			this.gas = (this.gas * 4 + consbyprice) / 5;
		}
		//gasover = Math.max( 0,  this.gas - consbyprice );

		//kerosene
		//var keroseneover = 0;
		if (this.consKeros != -1 && this.hotwaterEquipType != 3 && this.hotwaterEquipType != 4) {
			consbyprice = this.consKeros / D6.Unit.price.kerosene;
			//keroseneover = Math.max( 0,  this.kerosene - consbyprice );
			this.kerosene = consbyprice;
		}

		/*
		//	fix electricity estimate is more than that of by fee
		//	it will be better fix in calc2nd
		if ( elecOver > 0 ) {
			//kerosene fix
			if (D6.Unit.areaHeating <= 4 && this.priceKeros > 0 ) {
				this.kerosene +=  elecOver *  D6.Unit.calorie.electricity /D6.Unit.calorie.kerosene;
			} else {
				this.gas +=  elecOver *  D6.Unit.calorie.electricity /D6.Unit.calorie.gas;
			}
		}
		//gas over fix
		if ( gasover>0 ){
			if( this.priceKeros > 0 ) {
				this.kerosene = Math.min( gasover * D6.Unit.calorie.gas / D6.Unit.calorie.kerosene, this.consKeros / D6.Unit.price.kerosene );
			} else {
				this.electricity +=  gasover * D6.Unit.calorie.gas / D6.Unit.calorie.electricity/ this.apf;
			}
		}

		//kerosene use estimate is more than fee
		if (keroseneover>0){
			this.electricity +=  keroseneover * D6.Unit.calorie.kerosene / D6.Unit.calorie.electricity/ this.apf;
		}

		//re-calculate after fix
		this.calcACkwh = heatKcal / this.apf /D6.Unit.calorie.electricity;
		if ( this.mainSource == "electricity" && this.heatEquip != 2) {
			//air conditioner
			this[this.mainSource] =  this.calcACkwh;
		} else {
			//other than air conditioner
			this[this.mainSource] =  heatKcal /D6.Unit.calorie[this.mainSource];
		}
		*/
		if (this.heatEquip_in == 5) {
			//biomass
			this.electricity = 10;
			this.gas = 0;
			this.kerosene = 0;
		}
		if (this.heatEquip_in == 6) {
			//near body heating 
			this.electricity = 30;
			this.gas = 0;
			this.kerosene = 0;
		}

		var nowapf = 1;
		if (this.heatEquip != 2) {
			nowapf = this.apf;
		}
		heatKcal = this.electricity * D6.Unit.calorie.electricity * nowapf
			+ this.gas * D6.Unit.calorie.gas
			+ this.kerosene * D6.Unit.calorie.kerosene;
		this.endEnergy = heatKcal;

		//set all for heater
		if (this.priceHotWater > 0) {
			this.hotwater = D6.consShow["TO"].hotwater;
			this.priceHotWater = D6.consShow["TO"].priceHotWater;
		}

	}


	calc2nd() {
		var spaceK;
		var spaceG;
		var consHW = D6.consShow["HW"];
		var consTotal = D6.consShow["TO"];
		var consCK = D6.consShow["CK"];

		//amount of not fixed kerosene
		spaceK = Math.max(0, consTotal.kerosene - consHW.kerosene);

		//amount of not fixed gas
		spaceG = Math.max(0,
			consTotal.gas - consHW.gas - consCK.gas);

		//in case of use kerosene for heat, check electricity usage
		if (this.heatEquip == 4) {
			//in case kerosene estimate is more than fee
			if (this.kerosene > spaceK && this.consKeros != -1) {
				//heat consumption is over gas residue
				if (this.kerosene - spaceK
					> spaceG * D6.Unit.calorie.gas / D6.Unit.calorie.kerosene
				) {
					//estimate heat is supplied by electricity
					this.electricity +=
						(this.kerosene - spaceK)
						* D6.Unit.calorie.kerosene
						/ D6.Unit.calorie.electricity;
					//not over 70% of winter electricity
					this.electricity = Math.min(this.electricity,
						D6.consShow["TO"].electricity * this.heatMonth / 12 * 0.7);
					this.kerosene = spaceK;
					this.gas = spaceG;
				} else {
					//in case to use gas residure
					this.gas +=
						(this.kerosene - spaceK)
						* D6.Unit.calorie.kerosene
						/ D6.Unit.calorie.gas;
					this.kerosene = spaceK;
				}
			}
		}

		//kerosene cannot find suitable usage
		var ret;
		if (spaceK > 0) {
			if (this.consKeros == -1) {
				/*
				//221126 
				D6.consShow["TO"].kerosene = consHW.kerosene + this.kerosene;

				//total kerosene recalculate
				var seasonConsPattern = D6.area.getSeasonParamCommon();
				ret = D6.calcMonthly(D6.consShow["TO"].kerosene * D6.Unit.price.kerosene, [-1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], seasonConsPattern.kerosene, "kerosene");
				D6.consShow["TO"].priceKeros = ret.ave;
				D6.consShow["TO"].seasonPrice["kerosene"] = ret.season;
				D6.consShow["TO"].monthlyPrice["kerosene"] = ret.monthly;
				*/
			} else {
				this.kerosene = spaceK;
			}
		}

		//in case of use gas heater
		if (this.heatEquip == 3) {
			if (this.gas > spaceG) {
				this.electricity +=
					(this.gas - spaceG)
					* D6.Unit.calorie.gas
					/ D6.Unit.calorie.electricity;
				this.gas = spaceG;
			}
		}

		//add electricity use in toilet
		//this.electricity += D6.consListByName["consHWtoilet"][0].electricity;

	}

	//calculate heat load kcal/month
	//
	//		cons.houseType : type of house
	//		cons.houseSize : floor size(m2)
	//		cons.heatSpace : heat area rate(-)   room size(m2)
	calcHeatLoad(heatArea_m2, heatTime, heatMonth, heatTemp) {
		var energyLoad = 0;

		// heat loss when temperature difference between house and outside is 20 degree-C  kcal/h/m2
		var heatLoadUnit = this.heatLoadUnit_Wood;

		// cold area insulation standard
		if (this.heatArea == 1) {
			heatLoadUnit *= 0.3;
		} else if (this.heatArea <= 2) {
			heatLoadUnit *= 0.6;
		}

		//thickness of insulation
		if (this.performanceWall >= 200) {
			heatLoadUnit = this.heatLoadUnit_Wood * 0.2;
		} else if (this.performanceWall >= 100) {
			heatLoadUnit = this.heatLoadUnit_Wood * 0.4;
		} else if (this.performanceWall >= 50) {
			heatLoadUnit = this.heatLoadUnit_Wood * 0.7;
		} else if (this.performanceWall >= 30) {
			heatLoadUnit = this.heatLoadUnit_Wood;
		}

		// collective house heat load adjust
		if (this.houseType == 2) {
			heatLoadUnit *= this.heatLoadUnit_Steel / this.heatLoadUnit_Wood;
		}

		//heat factor by month and hours
		var heatFactor = D6.area.getHeatFactor(heatMonth, heatTime);

		//heat time adjust for long time use
		var heatTimeFactor = Math.min(heatTime, (heatTime - 8) * 0.3 + 8) / (heatTime ? heatTime : 4);

		//coefficient by temperature
		var coefTemp = (heatTemp - 20) / 10 + 1;

		energyLoad = heatLoadUnit * heatFactor[1] * heatArea_m2 * heatTime * heatTimeFactor * 30 * coefTemp;

		return energyLoad;
	}

	//calculate heat load by fee
	calcHeatLoadbyPrice() {
		var energyLoad = 0;
		return energyLoad;
	}

	//adjust heat load 
	calcAdjustStrategy(energyAdj) {
		this.calcACkwh *= energyAdj[this.mainSource];
		this.endEnergy *= energyAdj[this.mainSource];
	}

	calcMeasure() {
		if (!this.isSelected("mHTreformLV5")
		&& !this.isSelected("mHTreformLV6")
		&& !D6.consTotal.isSelected("mTOzeh")
		) {
			//mHTdoubleGlassAll
			if (!this.isSelected("mHTuchimadoAll") &&
				!this.isSelected("mHTloweAll") &&
				this.houseType != 2
			) {
				this.measures["mHTdoubleGlassAll"].calcReduceRate(this.reduceRateDouble);
			}
			//mHTuchimadoAll
			if (!this.isSelected("mHTloweAll")) {
				this.measures["mHTuchimadoAll"].calcReduceRate(this.reduceRateUchimado);
			}
			//mHTloweAll
			if (this.houseType != 2) {
				this.measures["mHTloweAll"].calcReduceRate(this.reduceRateLowe);
			}
		}

		if (this.houseType != 2
			&& !this.isSelected("mHTreformLV5")
			&& !this.isSelected("mHTreformLV6")
			&& !D6.consTotal.isSelected("mTOzeh")
		) {
			//mHTreformLV5,mHTreformLV6
			var heatlossfactor = 1 /  (this.performanceWall + 50);
			var newlossfactor = 1 / (150 + 50);

			if ( typeof this.measures["mHTreformLV5"] !== 'undefined') {
				this.measures["mHTreformLV5"].calcReduceRate(1 - newlossfactor/heatlossfactor );
			}
			
			if ( typeof this.measures["mHTreformLV6"] !== 'undefined') {
				newlossfactor = 1 / (250 + 50);
				this.measures["mHTreformLV6"].calcReduceRate(1 - newlossfactor/heatlossfactor );
			}
		}

		//mHTdanran
		if (this.person >= 2
			&& this.heatSpace > 0.3
			&& this.houseSize > 40
		) {
			this.measures["mHTdanran"].calcReduceRate(this.reduceRateDanran);
		}

	}

}




