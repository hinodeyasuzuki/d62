/* 2017/12/15  version 1.0
 * coding: utf-8, Tab as 2 spaces
 * 
 * Home Energy Diagnosis System Ver.6
 * consTotal.js 
 * 
 * calculate consumption and measures related to total house
 * 
 * License: MIT
 * 
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 *								2011/01/21 original PHP version
 *								2011/05/06 ported to ActionScript3
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

var D6 = D6 || {};

//Inherited class of ConsBase
class ConsTotal extends ConsBase {

	//initialize setting
	constructor() {
		super();

		//construction setting
		this.consName = "consTotal"; //code name of this consumption
		this.consCode = "TO"; //short code to access consumption, only set main consumption user for itemize
		this.title = "whole"; //consumption title name
		this.orgCopyNum = 0; //original copy number in case of countable consumption, other case set 0
		this.groupID = "9"; //number code in items
		this.color = "#a9a9a9"; //color definition in graph
		this.countCall = ""; //how to point n-th equipment

		this.sumConsName = ""; //code name of consumption sum up include this
		this.sumCons2Name = ""; //code name of consumption related to this

		//guide message in input page
		this.inputGuide = "Basic information about the area and house";

		//no price Data set 1 if nodata
		this.noPriceData = {};

		//parameters related to solar and nitght time electricity usage
		this.ratioNightEcocute = 0.4; //night consumption rate of heat pump
		this.ratioNightHWElec = 0.6; //night consumption rate of not heat pump
		this.solarSaleRatio_org = 0.6; //PV sell rate
		this.generateEleUnit = 1000; //PV generation   kWh/kW/year
		this.reduceHEMSRatio = 0.1; //reduce rate of Home Energy Management System
		this.standardSize = 3.6; //PV standard size

		this.noConsData = true; //flag of no input of fee

		this.averagePriceElec = 0;
		this.room2size = [15, 15, 30, 50, 70, 100, 120, 150, 170]; //room number to housesize(m2)

		this.seasonConsPattern = [1.4, 1, 1.2]; // consumption rate  - winter, spring, summer
	}

	//change Input data to local value
	precalc() {
		this.clear();

		this.person = this.input("i001", 3); //person
		this.daylighttimeuse = this.input("i320", 2);	//1 exist, 2 nopserson 
	
		//solar
		this.solarSet = this.input("i051", 0); //PV exist 1:exist
		this.solarKw = this.input("i052", this.solarSet * 3.5); //PV size (kW)
		this.solarYear = this.input("i053", 0); //PV set year

		this.solarSetSize = this.input("i951", -1); //PV set size

		//car
		this.carType = this.input("i9111",-1);
		this.elecCarNum = this.input("i943",0);

		//fix selrate by daylight time use
		this.solarSaleRatio = this.solarSaleRatio_org + ( this.daylighttimeuse==2 ? 0.1 : 0 );

		//electricity
		this.priceEle = this.input("i061", D6.area.averageCostEnergy.electricity); //electricity fee
		this.priceEleSpring = this.input("i0912", -1);
		this.priceEleSummer = this.input("i0913", -1);
		this.priceEleWinter = this.input("i0911", -1);
		this.noPriceData.electricity =
			(this.input("i061", -1) == -1) &
			(this.priceEleSpring == -1) &
			(this.priceEleSummer == -1) &
			(this.priceEleWinter == -1);

		this.priceEleSell = this.input("i092", this.input("i062", 0)); //sell electricity

		//gas
		if (this.input("i083",-1) == 3 ){
			this.priceGas = this.input("i063", 0); //gas fee
		} else {
			this.priceGas = this.input("i063", D6.area.averageCostEnergy.gas); //gas fee
		}
		this.priceGasSpring = this.input("i0932", -1);
		this.priceGasSummer = this.input("i0933", -1);
		this.priceGasWinter = this.input("i0931", -1);
		this.noPriceData.gas =
			(this.input("i063", -1) == -1) &
			(this.priceGasSpring == -1) &
			(this.priceGasSummer == -1) &
			(this.priceGasWinter == -1);

		this.houseType = this.input("i002", -1); //type of house

		this.houseSize = this.input(
			"i003",
			this.person == 1 ? 60 : 80 + this.person * 10
		); //floor size
		if (this.input("i003", -1) == -1) {
			if (this.input("i008", -1) != -1) {
				this.houseSize = this.room2size[this.input("i008", 3)];
			}
		}

		this.heatEquip = this.input("i202", -1); //main heat equipment
		this.hwEquip = this.input("i101",-1);		//hot water equipment

		//possibility
		this.hwUseKeros = (this.hwEquip == 3 || this.hwEquip == 4 || this.hwEquip == -1);
		this.heatUseKeros = (this.heatEquip == 4 || this.heatEquip == 14 || this.heatEquip == 44 || this.heatEquip == -1);
			
		//kerosene------------------------------
		this.priceKerosSpring = this.input("i0942", -1);
		this.priceKerosSummer = this.input("i0943", -1);
		this.priceKerosWinter = this.input("i0941", -1);
		
		this.noPriceData.kerosene =
			(this.priceKerosSpring == -1) &&
			(this.priceKerosSummer == -1) &&
			(this.priceKerosWinter == -1);

		//no winter price
		if (this.priceKerosWinter == -1) {
			if (D6.area.averageCostEnergy.kerosene < 1000 || (!this.hwUseKeros && !this.heatUseKeros) ) {
				this.priceKeros = this.input("i064", 0);
			} else {
				this.priceKeros = this.input(
					"i064",
					D6.area.averageCostEnergy.kerosene / D6.area.seasonMonth.winter * 12
				);				
			}

			//in case of spring price is set
			if( this.priceKerosSpring >= 0
				&& this.priceKerosSummer < 0 
				&& this.input("i064", -1) < 0 
			){
				// only spring price is set
				this.priceKeros = this.priceKerosSpring;
				this.priceKerosSpring = -1;				
			}
	
			// hotwater use fix
			if( this.hwUseKeros ){
				if( this.heatUseKeros ){
					this.priceKerosWinter = this.priceKeros*1.5;
					this.priceKerosSpring = this.priceKeros;
					this.priceKerosSummer = this.priceKeros/2;
				} else {
					this.priceKerosWinter = this.priceKeros*1.3;
					this.priceKerosSpring = this.priceKeros;
					this.priceKerosSummer = this.priceKeros*0.7;
				}
			} else {
				// in case of not use kerosene for hotwater, winter use is larger
				this.priceKerosWinter = this.priceKeros*3;
				this.priceKeros = -1;
			}
		}

		this.priceCar = this.input("i075", D6.area.averageCostEnergy.car); //gasoline
		this.noPriceData.car = this.input("i075", -1) == -1;

		this.equipHWType = this.input("i101", 1); //type of heater

		this.generateEleUnit = D6.area.unitPVElectricity; //area parameters of PV generate

		//set seasonal fee
		this.seasonPrice = {
			electricity: [
				this.priceEleWinter,
				this.priceEleSpring,
				this.priceEleSummer
			],
			gas: [this.priceGasWinter, this.priceGasSpring, this.priceGasSummer],
			kerosene: [this.priceKerosWinter, this.priceKerosSpring, this.priceKerosSummer],
			//		coal :			[ -1, -1,-1 ],
			//		hotwater :		[ -1, -1,-1 ],
			car: [-1, -1, -1]
		};

		//monthly pattern  -1:no input
		this.monthlyPrice = {
			electricity: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			gas: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			kerosene: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			//		coal :			[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
			//		hotwater :		[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
			car: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		};

		//add kerosene to gas if both input is null
		if (D6.area.averageCostEnergy.kerosene < 1000) {
			if (
				this.input("i063", -1) < 0 && //gas no input
				this.input("i0931", -1) < 0 &&
				this.input("i0932", -1) < 0 &&
				this.input("i0933", -1) < 0
			) {
				//add kerosene to gas
				this.keros2gas =
					D6.area.averageCostEnergy.kerosene /
					D6.Unit.price.kerosene *
					D6.Unit.calorie.kerosene /
					D6.Unit.calorie.gas *
					D6.Unit.price.gas;
				this.priceGasSpring += this.keros2gas;
				this.priceGasWinter += this.keros2gas;
			}
		}
	}

	calc() {
		var ret; //return values

		//seasonal parameters
		var seasonConsPattern = D6.area.getSeasonParamCommon();

		//estimate of electricity
		ret = D6.calcMonthly(
			this.priceEle,
			this.seasonPrice["electricity"],
			this.monthlyPrice["electricity"],
			seasonConsPattern.electricity,
			"electricity"
		);
		this.priceEle = ret.ave;
		this.seasonPrice["electricity"] = ret.season;
		this.monthlyPrice["electricity"] = ret.monthly;

		//221126 force setting 
		if ( forceele && !D6.averageMode){
			this.priceEle = forceele;
		}

		//in case of no fee input, use sum of all consumption
		this.noConsData =
			ret.noConsData &&
			this.input("i061", -1) == -1 &&
			this.noPriceData.gas &&
			this.noPriceData.car &&
			this.noPriceData.kerosene;
		//&& !D6.averageMode;

		//depend on hot water equipment
		if (this.equipHWType == 5) {
			this.averagePriceElec =
				this.ratioNightHWElec * D6.Unit.price.nightelectricity +
				(1 - this.ratioNightHWElec) * D6.Unit.price.electricity;
			this.allDenka = true;
		} else if (this.equipHWType == 6) {
			this.averagePriceElec =
				this.ratioNightEcocute * D6.Unit.price.nightelectricity +
				(1 - this.ratioNightEcocute) * D6.Unit.price.electricity;
			this.allDenka = true;
		} else {
			this.averagePriceElec = D6.Unit.price.electricity;
			this.allDenka = false;
		}

		//base price
		var priceBase;
		if (this.allDenka) {
			priceBase = D6.Unit.price.nightelectricity;
		} else {
			priceBase = 0;
		}

		//solar generation
		var generateEle = this.generateEleUnit * this.solarKw / 12;

		// solar generation restirict system
		this.pvRestrict = 1;
		if (
			D6.area.electCompany == 2 || //tokyo
			D6.area.electCompany == 3 || //chubu
			D6.area.electCompany == 5 //kansai
		) {
			this.pvRestrict = 0;
		}

		//solar sell price in Japan
		var pvSellUnitPrice = D6.Unit.price.sellelectricity;
		if (this.solarYear > 1990 && this.solarYear <= 2010) {
			pvSellUnitPrice = 48;
		} else if (this.solarYear == 2011 || this.solarYear == 2012) {
			pvSellUnitPrice = 42;
		} else if (this.solarYear == 2013) {
			pvSellUnitPrice = 38;
		} else if (this.solarYear == 2014) {
			pvSellUnitPrice = 37;
		} else if (this.solarYear == 2015) {
			if (this.pvRestrict == 1) {
				pvSellUnitPrice = 35;
			} else {
				pvSellUnitPrice = 33;
			}
		} else if (this.solarYear == 2016) {
			if (this.pvRestrict == 1) {
				pvSellUnitPrice = 33;
			} else {
				pvSellUnitPrice = 31;
			}
		} else if (this.solarYear == 2017) {
			if (this.pvRestrict == 1) {
				pvSellUnitPrice = 30;
			} else {
				pvSellUnitPrice = 28;
			}
		} else if (this.solarYear == 2018) {
			if (this.pvRestrict == 1) {
				pvSellUnitPrice = 28;
			} else {
				pvSellUnitPrice = 26;
			}
		} else if (this.solarYear == 2019) {
			if (this.pvRestrict == 1) {
				pvSellUnitPrice = 26;
			} else {
				pvSellUnitPrice = 24;
			}
		} else if (this.solarYear == 2020) {
			pvSellUnitPrice = 21;
		} else if (this.solarYear == 2021) {
			pvSellUnitPrice = 19;
		} else if (this.solarYear == 2022) {
			pvSellUnitPrice = 17;
		} else if (this.solarYear == 2023) {
			pvSellUnitPrice = 16;
		} else if (this.solarYear >= 2024 && this.solarYear < 2028) {
			pvSellUnitPrice = 15;
		} else if (this.solarYear < 2100) {
			//estimate
			pvSellUnitPrice = 11;
		}

		// end of FIT
		var date = new Date();
		if( this.solarYear < date.getFullYear() - 10 ){
			pvSellUnitPrice = 10;
			this.solarYear = 10;
		}
		this.pvSellUnitPrice = pvSellUnitPrice;

		//PV installed
		if (this.solarKw > 0) {
			// sellrate fitting
			this.sellelec_byprice = this.priceEleSell / pvSellUnitPrice;
			this.solarSaleRate_byprice = this.sellelec_byprice / generateEle;
			var t_solarSaleRatio = ( this.solarSaleRatio + this.solarSaleRate_byprice ) / 2;
			this.solarSaleRatio = Math.max(0.2 , Math.min(0.8 , t_solarSaleRatio));
			// gross = electricity consumed in home include self consumption amount
			this.grossElectricity =
				(1 - this.solarSaleRatio) * generateEle +
				Math.max(
					0,
					this.priceEle - this.priceEleSell +
					this.solarSaleRatio * generateEle * pvSellUnitPrice - priceBase
				) / this.averagePriceElec;
			if( modesolaronlyself ){
				this.electricity = this.grossElectricity - generateEle * ( 1-this.solarSaleRatio);
			} else {
				this.electricity = this.grossElectricity - generateEle;
			}
		} else {
			//not installed
			this.electricity = (this.priceEle - priceBase) / this.averagePriceElec;
			this.grossElectricity = this.electricity;
		}

		//gas
		ret = D6.calcMonthly(
			this.priceGas,
			this.seasonPrice["gas"],
			this.monthlyPrice["gas"],
			seasonConsPattern.gas,
			"gas"
		);
		this.priceGas = ret.ave;
		this.seasonPrice["gas"] = ret.season;
		this.monthlyPrice["gas"] = ret.monthly;

		//221126 force setting 
		if ( forcegas  && !D6.averageMode){
			this.priceGas = forcegas;
		}

		this.gas = (this.priceGas - D6.Unit.priceBase.gas) / D6.Unit.price.gas;

		//kerosene
		ret = D6.calcMonthly(
			this.priceKeros,
			this.seasonPrice["kerosene"],
			this.monthlyPrice["kerosene"],
			seasonConsPattern.kerosene,
			"kerosene"
		);
		this.priceKeros = ret.ave;
		this.seasonPrice["kerosene"] = ret.season;
		this.monthlyPrice["kerosene"] = ret.monthly;

		if ((this.heatEquip == 4 || this.heatEquip == 14 || this.heatEquip == 44 ) && this.priceKeros < 1000) {
			//in case of no input
			this.priceKeros = 2000;
		}
		this.kerosene = this.priceKeros / D6.Unit.price.kerosene;

		//gasoline
		ret = D6.calcMonthly(
			this.priceCar,
			this.seasonPrice["car"],
			this.monthlyPrice["car"],
			seasonConsPattern.car,
			"car"
		);
		this.priceCar = ret.ave;
		this.seasonPrice["car"] = ret.season;
		this.monthlyPrice["car"] = ret.monthly;

		this.car = this.priceCar / D6.Unit.price.car;
	}

	calcMeasure() {
		var mes;
		var solar_reduceVisualize = this.reduceHEMSRatio;

		var pvSellUnitPrice = this.pvSellUnitPrice;

		// monthly generate electricity
		let pvsize =  (this.solarSetSize==-1 ?  this.standardSize : this.solarSetSize );
		var solar_generate_kWh = this.generateEleUnit * pvsize / 12;

		//mTOsolar-----------------------------------------
		// not installed and ( stand alone or desired )
		mes = this.measures["mTOsolar"]; //set mes
		mes.copy(this);
		if(  this.houseType != 2
			&& this.solarSetSize != 0
			&& !this.isSelected("mTOzeh")
		) {
			if (this.solarKw == 0 ){
				// saving by generation
				var solar_priceDown =
					solar_generate_kWh * this.solarSaleRatio * pvSellUnitPrice +
					solar_generate_kWh * (1 - this.solarSaleRatio) * D6.Unit.price.electricity;

				// saving by visualize display
				var solar_priceVisualize =
					this.electricity * solar_reduceVisualize * D6.Unit.price.electricity;

				//electricity and cost
				mes.electricity =
					this.electricity * (1 - solar_reduceVisualize) 
					- solar_generate_kWh * (modesolaronlyself ?  (1 - this.solarSaleRatio) : 1);
				mes.costUnique = this.cost - solar_priceDown - solar_priceVisualize;

				//initial cost
				mes.priceNew = pvsize * mes.priceOrg;

				//comment add to original definition
				mes.advice =
					D6.scenario.defMeasures["mTOsolar"]["advice"] +
					"<br>(" + pvsize + "kW)";

			} else {
				//insatalled
			}
		}

		//mTObattery
		if ( modesolaronlyself && typeof this.measures["mTObattery"] !== 'undefined') {
			mes = this.measures["mTObattery"]; //set mes
			mes.copy(this);
			if(  
				( this.isSelected("mTOzeh") ||
					this.isSelected("mTOsolar") ||
					this.solarKw > 0 ) &&
				!this.isSelected("mTOv2h")
			) {
				//battery 5kWh , sell rate reduce to 30%
				var selfconsrate = (1-0.3);

				var solar_generate_kWh = this.generateEleUnit * this.standardSize / 12;

				var solar_priceDown =
					solar_generate_kWh * ( selfconsrate - (1-this.solarSaleRatio) )
					* ( D6.Unit.price.electricity - pvSellUnitPrice );

				//electricity and cost
				mes.electricity =
					this.electricity  
					- solar_generate_kWh *  ( selfconsrate - (1-this.solarSaleRatio) );
				mes.costUnique = this.cost - solar_priceDown;					
			}
		}

		//mTOv2h
		if ( modesolaronlyself && typeof this.measures["mTOv2h"] !== 'undefined') {
			mes = this.measures["mTOv2h"]; //set mes
			mes.copy(this);
			if(  
				( this.isSelected("mTOzeh") ||
					this.isSelected("mTOsolar") ||
					this.solarKw > 0) &&
				( D6.consListByName["consCR"][0].measures["mCRreplaceElec"].selected ||
					this.carType == 5 ||
					this.elecCarNum >= 1 ) &&
				!this.isSelected("mTObattery")
			) {
				//battery 50kWh , charge envery day on daytime, sell rate reduce to 10%
				var selfconsrate = (1-0.1);

				var solar_generate_kWh = this.generateEleUnit * this.standardSize / 12;

				var solar_priceDown =
					solar_generate_kWh * ( selfconsrate - (1-this.solarSaleRatio) )
					* ( D6.Unit.price.electricity - pvSellUnitPrice );

				//electricity and cost
				mes.electricity =
					this.electricity  
					- solar_generate_kWh *  ( selfconsrate - (1-this.solarSaleRatio) );
				mes.costUnique = this.cost - solar_priceDown;
			}			
		}


		//mTOzeh-----------------------------------------
		if ( typeof this.measures["mTOzeh"] !== 'undefined') {
			var mes2 = this.measures["mTOzeh"]; //set mes
			mes2.copy(this);
			if (!this.isSelected("mTOsolar") 
				&& this.solarKw == 0 
				&& this.houseType != 2
			) {

				//new building
				var zehSolarSize = this.solarSetSize <= 3 ? 5 : this.solarSetSize;

				//electricity and cost
				var eleReduce = 0.2;	//Zehエネルギー2割減

				//暖房割合
				var heatRatio = D6.consHTsum.jules / this.jules;

				//灯油の利用を電気にする
				var elec = this.electricity
					+ this.kerosene * (D6.Unit.calorie.kerosene / D6.Unit.calorie.electricity);
				mes2.electricity = elec * (heatRatio + (1 - heatRatio) * (1 - solar_reduceVisualize) * (1 - eleReduce))
					- solar_generate_kWh;
				mes2.kerosene = 0;

				//暖房に関しては
				var heatParam = 0;
				var heatLoad = D6.consHTsum.heatLoadUnit ? D6.consHTsum.heatLoadUnit : 220;	//0の場合を回避
				if ( D6.consHTsum.heatArea <= 3 ){
					//地域区分3以下の寒冷地では Ua値 0.40
					heatParam = 1.5 / (heatLoad * 860 / 1000);		//暖房の増減比率
				} else {
					//それ以外は Ua値0.6 Q値2W/Km2修正
					heatParam = 2 / (heatLoad * 860 / 1000);		//暖房の増減比率
				}
				mes2.gas -= D6.consHTsum.gas * (1 - heatParam);
				mes2.electricity -= (D6.consHTsum.electricity + D6.consHTsum.kerosene * D6.Unit.calorie.kerosene / D6.Unit.calorie.electricity)
					* (1 - heatParam);

				mes2.calcCost();

				// monthly generate electricity
				var solar_generate_kWh = this.generateEleUnit * zehSolarSize / 12;

				// saving by generation
				var solar_priceDown =
					solar_generate_kWh * this.solarSaleRatio * pvSellUnitPrice +
					solar_generate_kWh * (1 - this.solarSaleRatio) * D6.Unit.price.electricity;

				// saving by visualize display
				var solar_priceVisualize =
					this.electricity * solar_reduceVisualize * D6.Unit.price.electricity;

				//electricity and cost
				mes2.electricity 
					-= solar_generate_kWh * (modesolaronlyself ?  (1 - this.solarSaleRatio) : 1);
				
				mes2.costUnique = mes2.cost - solar_priceDown - solar_priceVisualize;

				//initial cost
				mes2.priceNew = zehSolarSize * this.measures["mTOsolar"].priceOrg + parseInt(mes2.priceOrg);

				//comment add to original definition
				mes2.advice =
					D6.scenario.defMeasures["mTOzeh"]["advice"] +
					"<br>(" + zehSolarSize + "kW)";
			}
		}

		//mTOhems HEMS-----------------------------------------
		mes = this.measures["mTOhems"]; //set mes
		mes.copy(this);

		//pv system is not installed  --- pv system includes visualize display
		if (!this.isSelected("mTOsolar")) {
			mes.electricity = this.electricity * (1 - this.reduceHEMSRatio);
		}

		//mTOsolarSmall ------------------------------------------
		mes = this.measures["mTOsolarSmall"]; //set mes
		mes.copy(this);
		var watt_panel = 50; // install panel size (W)
		var eff = 0.3; // effectiveness to roof
		mes.electricity -= watt_panel / 1000 * eff * this.generateEleUnit / 12;

		//mTOdemandcontroll
		if( this.measures["mTOdemandcontroll"] ) {
			mes = this.measures["mTOdemandcontroll"];
			mes.copy(this);
			//tokyo-gas co. electriciy management 1.4GWh / 78k house 17.9kWh/house
			//japan average(2019) 3945kWh/house 0.45%
			mes.electricity -= this.electricity * 0.0045;
		}

		//mTOzeroelectricity	脱炭素電源
		//他の対策よりも後に評価する
		if ( this.measures["mTOzeroelectricity"] ) {
			mes = this.measures["mTOzeroelectricity"];
			mes.copy(this);
			mes.electricity = 0;
			//コスト強制設定
			mes.costUnique = this.cost + 2 * this.electricity;	//現時点でのコストに 1kWhあたり2円を追加
		}
	
	}

}

