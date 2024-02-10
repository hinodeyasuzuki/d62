/*  2017/12/15  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consHWsum.js 
 * 
 * calculate consumption and measures related to hot water supply
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2013/10/03 original ActionScript3
 * 								2016/04/12 ported to JavaScript
 * 								2017/12/15 ver.1.0 set functions
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
class ConsHWsum extends ConsBase {

	//initialize-------------------------------
	constructor() {
		super();

		//construction setting
		this.consName = "consHWsum"; 			//code name of this consumption
		this.consCode = "HW"; 						//short code to access consumption, only set main consumption user for itemize
		this.title = "hot water supply"; 	//consumption title name
		this.orgCopyNum = 0; 							//original copy number in case of countable consumption, other case set 0
		this.groupID = "1"; 							//number code in items
		this.color = "#ffb700"; 					//color definition in graph
		this.countCall = ""; 							//how to point n-th equipment

		this.sumConsName = "consTotal"; //code name of consumption sum up include this
		this.sumCons2Name = ""; 				//code name of consumption related to this

		//guide message in input page
		this.inputGuide = "how to use hot water supply in general";

		this.hwEnergy = 0;

		// parameters setting in this consumption
		this.waterTemp = 18; //temperature of water degree-C
		this.hotWaterTemp = 42; //hot water temperature degree-C
		this.tabWaterLitter = 200; //tab hot water amount L
		this.showerWaterLitterUnit = 10; //shower speed L/min
		this.reduceRateShowerHead = 0.3; //reduce rate by saving shower head
		this.showerWaterMinutes = 5; //shower time min/person
		this.otherWaterLitter = 50; //other amount of hot water L/day
		this.tankLossWatt = 100; //keep tank hot energy
		this.tabTemplatureDown = 2; //temperature down in tab water degree-C/hour
		this.tabTemplatureInsulationDown = 0.5; //temperature down in insulated tab degree-C/hour

		this.performanceGas = 0.73; //efficient of ordinal gas heater
		this.performanceEcojozu = 0.877; //efficient of good gas heater
		this.performanceElec = 0.8; //efficient of electric heater
		this.performanceEcocute = 3; //efficient of heat pump heater
		this.performanceEnefarmEle = 0.289 / 0.36 * 0.38; //efficient of electricity generation of fuel cell 0.289/0.36*0.38
		this.performanceEnefarmHW = 0.38; //efficient of heat supply of fuel cell
		this.performanceEnefarmSOFCEle = 0.5; //efficient of electricity generation of SOFC fuel cell
		this.performanceEnefarmSOFCHW = 0.35; //efficient of heat supply of SOFC fuel cell
		this.performanceKeepWithTank = 0.6; //efficient of keep tab temperature with stock hot water

		this.reduceRateSaveMode = 0.2; //reduce rate to use electric heater with saving mode
		this.reduceRateSolar = 0.4; //reduce rate to use solar heater
		this.reduceRateSolarSystem = 0.5; //reduce rate to use solar heating system

		this.warmerElec_kWh_y = 200; //hot seat of toilet kWh/year
		this.water_m3_d = 0.1; //water use for toilet m3/person/day

		this.hybridelecratio = 0.7; //hybrid heater electricity ratio

		this.reduceRateKeepStop;
	}

	//change Input data to local value
	precalc() {
		this.clear();

		// use answers for calclation
		this.person = this.input("i001", 3); //person number
		this.housetype = this.input("i002", 1); //structure of house
		this.prefecture = this.input("i021", 13); //prefecture
		this.solarHeater = this.input("i102", 3); //solar heater
		this.heatArea = D6.area.getHeatingLevel(this.prefecture); //heating level
		this.tabDayWeek = this.input(
			"i103",
			this.heatArea == 1 || this.heatArea == 6 ? 2 : 6
		); //use tab day day/week
		this.tabDayWeekSummer = this.input("i104", 2); //use tab day in summer day/week
		var ret = this.input2seasons(
			"i105",
			"i106",
			this.showerWaterMinutes * this.person
		);
		this.showerMinutes = ret[0]; //shower time min/day
		this.showerMinutesSummer = ret[1]; //shower time in summer min/day
		this.showerHotTimeSpan = this.input("i112", 10); //time(seconds) to pour Hot Water

		this.savingShower = this.input("i116", -1); //saving shower head
		this.tabKeepHeatingTime = this.input("i108", this.person > 1 ? 3 : 0); //keep time to tab hot hour/day

		this.keepMethod2 = this.input("i111", 5); //keep hot method 2
		this.keepMethod = this.input("i110", this.keepMethod2); //keep hot method
		this.tabInsulation = this.input("i117", -1); //tab insulation
		this.tabHeight = this.input("i107", 8); //height of tab hot water 0-10

		this.equipType = this.input("i101", -1); //type of heater
		this.priceGas = D6.consShow["TO"].priceGas; //gas fee yen/month
		this.priceKeros = D6.consShow["TO"].priceKeros; //kerosene price yen/month

		this.dresserMonth = this.input("i114", 4); //months of use hot water for dresser month
		this.dishWashMonth = this.input("i115", 4); //months of use hot water for dish wash month / 99 is machine
		this.dishWashWater = this.input("i113", 3); //use cold water for dish wash 1every day - 4 not
		this.heaterPerformance = this.input("i121", 2); //performance of heater 1good  3bad
		this.cookingFreq = this.input("i802", 6); //frequency of cooking 0-10

		this.keepSeason = this.input("i131", 2); //use keep toilet seat hot 1:everyday - 4not use
	}

	// calculation of this consumption ------------------------------------
	calc() {
		// guess equip type
		if (this.equipType <= 0) {
			if (this.priceGas == 0) {
				if (this.priceKeros > 3000) {
					this.equipType = 3;
				} else {
					this.equipType = 5;
				}
			} else {
				this.equipType = 1;
			}
		}

		//good type
		if (this.equipType == 1 && this.heaterPerformance == 1) {
			this.equipType == 2;
		}
		if (this.equipType == 5 && this.heaterPerformance == 1) {
			this.equipType == 6;
		}
		//bad type
		if (this.equipType == 2 && this.heaterPerformance == 3) {
			this.equipType == 1;
		}

		// estimate templature of tap water
		this.waterTemp = D6.area.getWaterTemplature();

		//adjust by solar heater
		this.waterTemp =
			this.solarHeater == 1
				? 0.4 * this.hotWaterTemp + 0.6 * this.waterTemp
				: this.solarHeater == 2
					? 0.15 * this.hotWaterTemp + 0.85 * this.waterTemp
					: this.waterTemp;

		// estimate amount of hot water used as shower litter/day
		this.showerWaterLitter =
			((this.showerMinutes * (12 - D6.area.seasonMonth.summer) +
				this.showerMinutesSummer * D6.area.seasonMonth.summer) /
				12 *
				(this.savingShower == 1 ? 1 - this.reduceRateShowerHead : 1) +
				this.showerHotTimeSpan / 60 * 5) * //	5 times
			this.showerWaterLitterUnit;

		// estimate amount of hot water used in tub	litter/day
		this.consHWtubLitter =
			this.tabWaterLitter *
			this.tabHeight /
			10 *
			(this.tabDayWeek * (12 - D6.area.seasonMonth.summer) +
				this.tabDayWeekSummer * D6.area.seasonMonth.summer) /
			12 /
			7;

		// sum hot water use litter/day
		this.allLitter =
			this.consHWtubLitter + this.showerWaterLitter + this.otherWaterLitter;

		// tap water heating energy   kcal/month
		this.heatTapEnergy =
			this.allLitter * (this.hotWaterTemp - this.waterTemp) * 365 / 12;

		// tab keep energy kcal/month
		this.tabKeepEnergy =
			this.consHWtubLitter *
			this.tabKeepHeatingTime *
			365 /
			12 *
			(this.tabInsulation == 1 || this.tabInsulation == 2
				? this.tabTemplatureInsulationDown
				: this.tabTemplatureDown) /
			(this.equipType == 4 || this.equipType == 5
				? this.performanceKeepWithTank
				: 1) *
			this.keepMethod /
			10;

		// heating energy   kcal/month
		this.heatEnergy = this.heatTapEnergy + this.tabKeepEnergy;
		this.hwEnergy = this.heatEnergy;

		// ratio of tub
		this.consHWtubRate =
			this.consHWtubLitter / this.allLitter +
			this.tabKeepEnergy / this.heatEnergy;

		// ratio of shower
		this.consHWshowerRate =
			this.showerWaterLitter /
			this.allLitter *
			(this.heatTapEnergy / this.heatEnergy);

		// ratio of dresser
		this.consHWdresserRate =
			this.otherWaterLitter /
			2 /
			this.allLitter *
			(this.heatTapEnergy / this.heatEnergy) *
			this.dresserMonth /
			6;

		// ratio of dish wash
		this.consHWdishwashRate =
			this.otherWaterLitter /
			2 /
			this.allLitter *
			(this.heatTapEnergy / this.heatEnergy) *
			(this.dishWashMonth == 99 ? 1 : this.dishWashMonth / 6) *
			(4 - this.dishWashWater) /
			2 *
			this.cookingFreq /
			6;

		// estimate loss energy when stored in tank  kcal/month
		this.tanklossEnergy =
			this.tankLossWatt / 1000 * D6.Unit.calorie.electricity * 365 / 12;

		// Heater Equip Type
		switch (this.equipType) {
			case 1:
				//gas heater
				this.mainSource = "gas";
				this[this.mainSource] =
					this.heatEnergy /
					this.performanceGas /
					D6.Unit.calorie[this.mainSource];
				this.performanceOrg = this.performanceGas;
				break;
			case 2:
				//high efficient gas heater
				this.mainSource = "gas";
				this[this.mainSource] =
					this.heatEnergy /
					this.performanceEcojozu /
					D6.Unit.calorie[this.mainSource];
				this.performanceOrg = this.performanceEcojozu;
				break;
			case 3:
				//kerosene heater
				this.mainSource = "kerosene";
				this[this.mainSource] =
					this.heatEnergy /
					this.performanceGas /
					D6.Unit.calorie[this.mainSource];
				this.performanceOrg = this.performanceGas;
				break;
			case 4:
				//high efficient kerosene heate
				this.mainSource = "kerosene";
				this[this.mainSource] =
					this.heatEnergy /
					this.performanceEcojozu /
					D6.Unit.calorie[this.mainSource];
				this.performanceOrg = this.performanceEcojozu;
				break;
			case 5:
				//electricity heater
				this.mainSource = "electricity";
				this[this.mainSource] =
					(this.heatEnergy + this.tanklossEnergy) /
					this.performanceElec /
					D6.Unit.calorie[this.mainSource];
				this.performanceOrg = this.performanceElec;
				break;
			case 6:
				//heat pump heater
				this.mainSource = "electricity";
				this[this.mainSource] =
					(this.heatEnergy + this.tanklossEnergy) /
					this.performanceEcocute /
					D6.Unit.calorie[this.mainSource];
				this.performanceOrg = this.performanceEcocute;
				break;
			case 7:
			case 8:
			default:
				this.mainSource = "gas";
				this.gas =
					this.heatEnergy / this.performanceEcojozu / D6.Unit.calorie.gas;
				this.performanceOrg = this.performanceEcojozu;
		}

		//toilet
		// this.electricity += this.warmerElec_kWh_y / 12 * (4 - this.keepSeason) / 3;
		// this.water += this.water_m3_d * this.person * 30;

		//reduce rate by use shower
		this.reduceRateShowerTime =
			1 / (this.showerMinutes / this.person - 1) * this.consHWshowerRate;

		//reduce rate by stop keep hot
		this.reduceRateTabKeep =
			this.tabKeepEnergy /
			(this.heatEnergy * this.consHWtubLitter / this.allLitter);

		//reduce rate by insulation tab
		this.reduceRateInsulation =
			this.tabInsulation == 1 || this.tabInsulation == 2
				? 0
				: this.reduceRateTabKeep *
				(this.tabTemplatureDown - this.tabTemplatureInsulationDown) /
				this.tabTemplatureDown;

		//reduce rate by use shower in summer
		var ssummer = this.tabDayWeekSummer * D6.area.seasonMonth.summer;
		var snsummer = this.tabDayWeek * (12 - D6.area.seasonMonth.summer);
		this.reduceRateStopTabSummer = ssummer / (ssummer + snsummer);
	}

	// calclate measures ----------------------------------------------
	//		calculate co2/cost saving related to this consumption
	// parameter
	//		none
	// result
	//		none
	// set
	//		calclate result in this.measures[] also link to D6.measuresList[]
	calcMeasure() {
		var goodPerformance = false;

		// installed good performance equipments
		if (
			this.isSelected("mHWecocute") ||
			this.isSelected("mHWhybrid") ||
			// this.isSelected("mHWecofeel") ||
			//|| this.isSelected( "mHWecojoze" )
			this.isSelected("mHWenefarm") ||
			this.isSelected("mHWenefarmSOFC") ||
			D6.consTotal.isSelected("mTOzeh")
		) {
			goodPerformance = true;
		}

		//endEnergy adjust with installed measures 170426
		// 230203 fix
		var endEnergyNow = this.jules * 1000 / 4.18 * this.performanceOrg;
		if (
			this.equipType < 5 &&
			!goodPerformance
		) {
			//mHWecocute
			if (this.housetype == 1) {
				this.measures["mHWecocute"].clear();
				this.measures["mHWecocute"].nightelectricity =
					(endEnergyNow + this.tanklossEnergy) /
					this.performanceEcocute /
					D6.Unit.calorie.nightelectricity;
				this.measures["mHWecocute"].water = this.water;
			}

			//mHWhybrid
			if (typeof this.measures["mHWhybrid"] !== 'undefined') {
				if (this.housetype == 1) {
					this.measures["mHWhybrid"].clear();
					this.measures["mHWhybrid"].nightelectricity =
						endEnergyNow * this.hybridelecratio /
						this.performanceEcocute /
						D6.Unit.calorie.nightelectricity;
					this.measures["mHWhybrid"].gas =
						endEnergyNow * (1 - this.hybridelecratio) /
						this.performanceEcojozu /
						D6.Unit.calorie.gas;
					this.measures["mHWhybrid"].water = this.water;
				}
			}

			//mHWecofeel
			if (this.equipType == 3) {
				this.measures["mHWecofeel"].clear();
				this.measures["mHWecofeel"].kerosene =
					endEnergyNow / this.performanceEcojozu / D6.Unit.calorie.kerosene;
				this.measures["mHWecofeel"].water = this.water;
			}

			//mHWecojoze
			this.measures["mHWecojoze"].clear();
			this.measures["mHWecojoze"].gas =
				endEnergyNow / this.performanceEcojozu / D6.Unit.calorie.gas;
			this.measures["mHWecojoze"].water = this.water;
		}

		if ( 
			this.housetype == 1 &&
			this.equipType <=5 &&
			!goodPerformance
		) {
			//mHWenefarm
			this.measures["mHWenefarm"].clear();
			//electricity generation
			var notCoGenerationEnergy = Math.min(endEnergyNow, 500 * 1000 / 12); //	kcal/month
			var coGenerationEnergy = endEnergyNow - notCoGenerationEnergy;
			coGenerationEnergy = Math.min(coGenerationEnergy, D6.consShow["TO"].electricity * 700);
			notCoGenerationEnergy = endEnergyNow - coGenerationEnergy;

			var baseGas = 500 * 1000 / 12; //	kcal/month

			this.measures["mHWenefarm"].gas =
				(coGenerationEnergy / this.performanceEnefarmHW +
					(notCoGenerationEnergy + baseGas) / this.performanceEcojozu) /
				D6.Unit.calorie.gas;

			this.measures["mHWenefarm"].electricity =
				-coGenerationEnergy /
				this.performanceEnefarmHW *
				this.performanceEnefarmEle /
				D6.Unit.calorie.electricity;

			this.measures["mHWenefarm"].water = this.water;

			//コスト強制設定
			this.measures["mHWenefarm"].calcCost();

			//割引は都市ガスの場合限定
			if (D6.consTotal.gasType != 2) {
				this.measures["mHWenefarm"].costUnique = this.measures["mHWenefarm"].cost
					- this.measures["mHWenefarm"].gas * (D6.consHTsum.useHW ? 60 : 80);
			}

			//mHWenefarmSOFC after 3
			if (typeof this.measures["mHWenefarmSOFC"] !== 'undefined') {
				this.measures["mHWenefarmSOFC"].clear();
				//electricity generation( depends on electiricity consumption)
				var generateElectricity = Math.min(400, D6.consTotal.electricity * 0.7);
				notCoGenerationEnergy = 0; //	kcal/month
				var availableEnergy = 25 * 2 * (80 - 20) * 30; //	kcal/month 25L*2,60K
				coGenerationEnergy = endEnergyNow - notCoGenerationEnergy;

				this.measures["mHWenefarmSOFC"].gas =
					(
						generateElectricity * D6.Unit.calorie.electricity / this.performanceEnefarmSOFCEle +
						(coGenerationEnergy - availableEnergy) / this.performanceEcojozu
					) / D6.Unit.calorie.gas;

				this.measures["mHWenefarmSOFC"].electricity =
					this.electricity - generateElectricity;

				this.measures["mHWenefarmSOFC"].water = this.water;

				//コスト強制設定
				this.measures["mHWenefarmSOFC"].calcCost();

				//割引は都市ガスの場合限定
				if (D6.consTotal.gasType != 2) {
					this.measures["mHWenefarmSOFC"].costUnique = this.measures["mHWenefarmSOFC"].cost
						- this.measures["mHWenefarmSOFC"].gas * (D6.consHTsum.useHW ? 60 : 80);
				}
			}

		}

		//mHWsaveMode
		if (this.equipType == 6 || this.equipType == 5) {
			this.measures["mHWsaveMode"].calcReduceRate(this.reduceRateSaveMode);
		}

		var rejectSolarSelect = false; //can or not to install solar heater
		if (
			this.isSelected("mHWecocute") ||
			this.isSelected("mHWhybrid") ||
			this.isSelected("mHWenefarm") ||
			this.isSelected("mHWenefarmSOFC") ||
			this.isSelected("mHWsolarSystem") ||
			this.isSelected("mHWsolarHeater")
		) {
			//tank type or co generation type
			rejectSolarSelect = true;
		}

		if (
			this.equipType != 5 &&
			this.equipType != 6 &&
			!rejectSolarSelect &&
			this.solarHeater != 1 &&
			this.housetype == 1
		) {
			this.measures["mHWsolarHeater"].calcReduceRate(this.reduceRateSolar);
			this.measures["mHWsolarSystem"].calcReduceRate(this.reduceRateSolarSystem);
		}
	}

	//hot water energy is also adjusted
	calcAdjustStrategy(energyAdj) {
		this.heatEnergy *= energyAdj[this.mainSource];
		this.tanklossEnergy *= energyAdj[this.mainSource];
		this.hwEnergy *= energyAdj[this.mainSource];
	}
}

