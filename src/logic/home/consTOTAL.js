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

import ConsBase from "../base/consbase.js";
import {calcMonthly} from "../base/d6_calcmonthly.js";
import {D6} from "../d6.js";
import {Unit} from "../areaset/unit.js";

//Inherited class of ConsBase
export class ConsTotal extends ConsBase {

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
		this.priceGas = this.input("i063", D6.area.averageCostEnergy.gas); //gas fee
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
		this.hwUseKeros = (this.hwEquip == 3 || this.hwEquip == 4);

		//kerosene------------------------------
		this.priceKerosSpring = this.input("i0942", -1);
		this.priceKerosSummer = this.input("i0943", -1);
		this.priceKerosWinter = this.input("i0941", -1);
		this.noPriceData.kerosene =
			(this.priceKerosSpring == -1) &
			(this.priceKerosSummer == -1) &
			(this.priceKerosWinter == -1);

		if (this.priceKerosWinter == -1) {
			if (D6.area.averageCostEnergy.kerosene < 1000 || !this.hwUseKeros) {
				this.priceKeros = this.input("i064", 0);
			} else {
				this.priceKeros = this.input(
					"i064",
					D6.area.averageCostEnergy.kerosene / D6.area.seasonMonth.winter * 12
				);				
			}
			if( !this.hwUseKeros ){
				if( this.input("i064",-1)>0 ){
					//in case of not use kerosene for hotwater, price is only winter
					this.priceKeros /= 3;
				}
				this.priceKerosWinter = this.priceKeros;
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
					Unit.price.kerosene *
					Unit.calorie.kerosene /
					Unit.calorie.gas *
					Unit.price.gas;
				this.priceGasSpring += this.keros2gas;
				this.priceGasWinter += this.keros2gas;
			}
		}
	}

	calc() {
		let ret; //return values

		//seasonal parameters
		let seasonConsPattern = D6.area.getSeasonParam(D6.area.area);

		//estimate of electricity
		ret = calcMonthly(
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
		if ( D6.forceele && !this.averageMode){
			this.priceEle = D6.forceele;
		}

		//in case of no fee input, use sum of all consumption
		this.noConsData =
			ret.noConsData &&
			this.input("i061", -1) == -1 &&
			this.noPriceData.gas &&
			this.noPriceData.car &&
			this.noPriceData.kerosene;
		//&& !this.averageMode;

		//depend on hot water equipment
		if (this.equipHWType == 5) {
			this.averagePriceElec =
				this.ratioNightHWElec * Unit.price.nightelectricity +
				(1 - this.ratioNightHWElec) * Unit.price.electricity;
			this.allDenka = true;
		} else if (this.equipHWType == 6) {
			this.averagePriceElec =
				this.ratioNightEcocute * Unit.price.nightelectricity +
				(1 - this.ratioNightEcocute) * Unit.price.electricity;
			this.allDenka = true;
		} else {
			this.averagePriceElec = Unit.price.electricity;
			this.allDenka = false;
		}

		//base price
		let priceBase;
		if (this.allDenka) {
			priceBase = Unit.price.nightelectricity;
		} else {
			priceBase = 0;
		}

		//solar generation
		let generateEle = this.generateEleUnit * this.solarKw / 12;

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
		let pvSellUnitPrice = Unit.price.sellelectricity;
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
		let date = new Date();
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
			let t_solarSaleRatio = ( this.solarSaleRatio + this.solarSaleRate_byprice ) / 2;
			this.solarSaleRatio = Math.max(0.2 , Math.min(0.8 , t_solarSaleRatio));
			// gross = electricity consumed in home include self consumption amount
			this.grossElectricity =
				(1 - this.solarSaleRatio) * generateEle +
				Math.max(
					0,
					this.priceEle - this.priceEleSell +
					this.solarSaleRatio * generateEle * pvSellUnitPrice - priceBase
				) / this.averagePriceElec;
			if( D6.modesolaronlyself ){
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
		ret = calcMonthly(
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
		if ( D6.forcegas  && !this.averageMode){
			this.priceGas = D6.forcegas;
		}

		this.gas = (this.priceGas - Unit.priceBase.gas) / Unit.price.gas;

		//kerosene
		ret = calcMonthly(
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
		this.kerosene = this.priceKeros / Unit.price.kerosene;

		//gasoline
		ret = calcMonthly(
			this.priceCar,
			this.seasonPrice["car"],
			this.monthlyPrice["car"],
			seasonConsPattern.car,
			"car"
		);
		this.priceCar = ret.ave;
		this.seasonPrice["car"] = ret.season;
		this.monthlyPrice["car"] = ret.monthly;

		this.car = this.priceCar / Unit.price.car;
	}

	calcMeasure() {
		let mes;
		let solar_reduceVisualize = this.reduceHEMSRatio;

		let pvSellUnitPrice = this.pvSellUnitPrice;
		let solar_priceDown = 0;

		// monthly generate electricity
		let solar_generate_kWh = this.generateEleUnit * this.standardSize / 12;

		//mTOsolar-----------------------------------------
		// not installed and ( stand alone or desired )
		mes = this.measures["mTOsolar"]; //set mes
		mes.copy(this);
		if(  this.houseType != 2
			&& !this.isSelected("mTOzeh")
		) {
			if (this.solarKw == 0 ){
				// saving by generation
				solar_priceDown =
					solar_generate_kWh * this.solarSaleRatio * pvSellUnitPrice +
					solar_generate_kWh * (1 - this.solarSaleRatio) * Unit.price.electricity;

				// saving by visualize display
				let solar_priceVisualize =
					this.electricity * solar_reduceVisualize * Unit.price.electricity;

				//electricity and cost
				mes.electricity =
					this.electricity * (1 - solar_reduceVisualize) 
					- solar_generate_kWh * (D6.modesolaronlyself ?  (1 - this.solarSaleRatio) : 1);
				mes.costUnique = this.cost - solar_priceDown - solar_priceVisualize;

				//initial cost
				mes.priceNew = this.standardSize * mes.priceOrg;

				//comment add to original definition
				mes.advice =
					D6.scenario.defMeasures["mTOsolar"]["advice"] +
					"<br>(" +
					this.standardSize +
					"kW)";

			} else {
				//insatalled
			}
		}

		//mTObattery
		if ( D6.modesolaronlyself && typeof this.measures["mTObattery"] !== 'undefined') {
			mes = this.measures["mTObattery"]; //set mes
			mes.copy(this);
			if(  
				( this.isSelected("mTOzeh") ||
					this.isSelected("mTOsolar") ||
					this.solarKw > 0 ) &&
				!this.isSelected("mTOv2h")
			) {
				//battery 5kWh , sell rate reduce to 30%
				let selfconsrate = (1-0.3);

				solar_generate_kWh = this.generateEleUnit * this.standardSize / 12;

				solar_priceDown =
					solar_generate_kWh * ( selfconsrate - (1-this.solarSaleRatio) )
					* ( Unit.price.electricity - pvSellUnitPrice );

				//electricity and cost
				mes.electricity =
					this.electricity  
					- solar_generate_kWh *  ( selfconsrate - (1-this.solarSaleRatio) );
				mes.costUnique = this.cost - solar_priceDown;					
			}
		}

		//mTOv2h
		if ( D6.modesolaronlyself && typeof this.measures["mTOv2h"] !== 'undefined') {
			mes = this.measures["mTOv2h"]; //set mes
			mes.copy(this);
			if(  
				( this.isSelected("mTOzeh") ||
					this.isSelected("mTOsolar") ||
					this.solarKw > 0) &&
				( this.consListByName["consCR"][0].measures["mCRreplaceElec"].selected ||
					this.carType == 5 ||
					this.elecCarNum >= 1 ) &&
				!this.isSelected("mTObattery")
			) {
				//battery 50kWh , charge envery day on daytime, sell rate reduce to 10%
				let selfconsrate = (1-0.1);

				solar_generate_kWh = this.generateEleUnit * this.standardSize / 12;

				solar_priceDown =
					solar_generate_kWh * ( selfconsrate - (1-this.solarSaleRatio) )
					* ( Unit.price.electricity - pvSellUnitPrice );

				//electricity and cost
				mes.electricity =
					this.electricity  
					- solar_generate_kWh *  ( selfconsrate - (1-this.solarSaleRatio) );
				mes.costUnique = this.cost - solar_priceDown;
			}			
		}


		//mTOzeh-----------------------------------------
		if ( typeof this.measures["mTOzeh"] !== 'undefined') {
			let mes2 = this.measures["mTOzeh"]; //set mes
			mes2.copy(this);
			if (!this.isSelected("mTOsolar") 
				&& this.solarKw == 0 
				&& this.houseType != 2
			) {

				let zehSolarSize = 5;

				//electricity and cost
				let eleReduce = 0.2;	//Zehエネルギー2割減

				//暖房割合
				let heatRatio = D6.consHTsum.jules / this.jules;

				//灯油の利用を電気にする
				let elec = this.electricity + this.generateEle
					+ this.kerosene * (Unit.calorie.kerosene / Unit.calorie.electricity);
				mes2.electricity = elec * (heatRatio + (1 - heatRatio) * (1 - solar_reduceVisualize) * (1 - eleReduce))
					- solar_generate_kWh;
				mes2.kerosene = 0;

				//暖房に関しては
				let heatParam = 0;
				let heatLoad = D6.consHTsum.heatLoadUnit ? D6.consHTsum.heatLoadUnit : 220;	//0の場合を回避
				if ( D6.consHTsum.heatArea <= 3 ){
					//地域区分3以下の寒冷地では Ua値 0.40
					heatParam = 1.5 / (heatLoad * 860 / 1000);		//暖房の増減比率
				} else {
					//それ以外は Ua値0.6 Q値2W/Km2修正
					heatParam = 2 / (heatLoad * 860 / 1000);		//暖房の増減比率
				}
				mes2.gas -= D6.consHTsum.gas * (1 - heatParam);
				mes2.electricity -= (D6.consHTsum.electricity + D6.consHTsum.kerosene * Unit.calorie.kerosene / Unit.calorie.electricity)
					* (1 - heatParam);

				// monthly generate electricity
				solar_generate_kWh = this.generateEleUnit * zehSolarSize / 12;

				// saving by generation
				solar_priceDown =
					solar_generate_kWh * this.solarSaleRatio * pvSellUnitPrice +
					solar_generate_kWh *
					(1 - this.solarSaleRatio) *
					Unit.price.electricity;

				// saving by visualize display
				let solar_priceVisualize =
					this.electricity * solar_reduceVisualize * Unit.price.electricity;

				//electricity and cost
				mes2.electricity =
					this.electricity * (1 - solar_reduceVisualize) 
					- solar_generate_kWh * (D6.modesolaronlyself ?  (1 - this.solarSaleRatio) : 1);
				mes2.costUnique = this.cost - solar_priceDown - solar_priceVisualize;

				//initial cost
				mes2.priceNew = zehSolarSize * this.measures["mTOsolar"].priceOrg + parseInt(mes2.priceOrg);

				//comment add to original definition
				mes2.advice =
					D6.scenario.defMeasures["mTOzeh"]["advice"] +
					"<br>(" +
					zehSolarSize +
					"kW)";
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
		let watt_panel = 50; // install panel size (W)
		let eff = 0.3; // effectiveness to roof
		mes.electricity -= watt_panel / 1000 * eff * this.generateEleUnit / 12;

		//mTOdemandcontroll
		if( this.measures["mTOdemandcontroll"] ) {
			mes = this.measures["mTOdemandcontroll"];
			mes.copy(this);
			//tokyo-gas co. electriciy management 1.4GWh / 78k house 17.9kWh/house
			//japan average(2019) 3945kWh/house 0.45%
			mes.electricity -= this.electricity * 0.0045;
		}

	}

}


