/*  2017/12/16  version 1.0
 * coding: utf-8, Tab as 4 spaces
 *
 * Home Energy Diagnosis System Ver.6
 * scenariofix.js
 *
 * fix area function and data between home and office
 * fix scenario.js
 * fix logic definition
 *
 * License: http://creativecommons.org/licenses/LGPL/2.1/
 *
 * @author Yasufumi Suzuki, Hinodeya Institute for Ecolife co.ltd.
 * 								2016/04/12 ported to JavaScript
 *
 *
 */


D6.scenario.fix_consParams =function(){
	D6.consAC.title = "机房空调";
	D6.consAC.countCall = "个房间";

	D6.consACcool.title = "机房空调";
	D6.consACcool.addable = "房间空调";
	D6.consACcool.countCall = "个房间";
	D6.consACcool.inputGuide = "如何使用每间客房的空调";

	D6.consACheat.title = "房间暖气";
	D6.consACheat.addable = "房间空调";
	D6.consACheat.countCall = "个房间";
	D6.consACheat.inputGuide = "如何使用每间客房间暖气";

	D6.consCKcook.title = "烹饪";
	D6.consCKcook.inputGuide = "如何使用烹饪重点放在炉子";

	D6.consCKpot.title = "绝热";
	D6.consCKpot.inputGuide = "如何使用隔热装置";

	D6.consCKrice.title = "饭";
	D6.consCKrice.inputGuide = "如何使用火炉";

	D6.consCKsum.title = "做饭";
	D6.consCKsum.inputGuide = "如何使用烹饪相关";

	D6.consCOsum.title = "空调";
	D6.consCOsum.inputGuide = "如何使用空调在整个房子";

	D6.consCR.title = "车辆";
	D6.consCR.addable = "车辆";
	D6.consCR.countCall = "车";
	D6.consCR.inputGuide = "关于性能和每一辆汽车的使用将举行";

	D6.consCRsum.title = "车辆";
	D6.consCRsum.inputGuide = "如何使用汽车，自行车";

	D6.consCRtrip.title = "运动";
	D6.consCRtrip.countCall = "两个地";
	D6.consCRtrip.addable = "目的地";
	D6.consCRtrip.inputGuide = "如何使用汽车等各个目的地";

	D6.consDRsum.title = "洗衣机・干衣机";
	D6.consDRsum.inputGuide = "掃吸尘器，如何使用洗衣机和干衣机";

	D6.consEnergy.title = "通用能源集";
	D6.consEnergy.inputGuide = "在整个房子的使用和能源，每月水电费";

	D6.consHTcold.title = "在寒冷的气候";
	D6.consHTcold.inputGuide = "如何使用在寒冷气候下的加热";

	D6.consHTsum.title = "供暖";
	D6.consHTsum.inputGuide = "如何使用整个房子的供暖";

	D6.consHWdishwash.title = "洗涤";
	D6.consHWdishwash.inputGuide = "如何使用洗碗机";

	D6.consHWdresser.title = "洗";
	D6.consHWdresser.inputGuide = "洗如何在盆地用热水";

	D6.consHWshower.title = "淋浴";
	D6.consHWshower.inputGuide = "如何使用淋浴";

	D6.consHWsum.title = "热水器";
	D6.consHWsum.inputGuide = "如何使用热水供应一般";

	D6.consHWtoilet.title = "厕所";
	D6.consHWtoilet.inputGuide = "如何使用花露水和隔热";

	D6.consHWtub.title = "浴缸";
	D6.consHWtub.inputGuide = "如何使用热水浴缸";

	D6.consLI.addable = "房间照亮";
	D6.consLI.countCall = "个房间";
	D6.consLI.inputGuide = "如何使用单个房间的照明";

	D6.consLIsum.title = "照明";
	D6.consLIsum.inputGuide = "如何使用整个房子的采光";

	D6.consRF.title = "冰箱";
	D6.consRF.addable = "冰箱";
	D6.consRF.countCall = "台";
	D6.consRF.inputGuide = "如何使用个人冰箱";

	D6.consRFsum.title = "冰箱";
	D6.consRFsum.inputGuide = "使用在整个房子的冰箱";

	D6.consSeason.inputGuide = "对于每月的水电费每个季节。请近似值填写。";

	D6.consTotal.title = "整体";
	D6.consTotal.inputGuide = "有关地区和房子的基本信息";

	D6.consTV.title = "电视";
	D6.consTV.addable = "电视";
	D6.consTV.countCall = "台";
	D6.consTV.inputGuide = "如何使用个性化的电视";

	D6.consTVsum.title = "电视";
	D6.consTVsum.inputGuide = "如何使用电视的全屋";

	D6.consHTsum.precalc = function() {
		this.clear(); //clear data
	
		this.prefecture = this.input("i021", 2); //city, prefecture
		this.heatArea = D6.area.getHeatingLevel(this.prefecture);
	
		this.person = this.input("i001", 3); //person
		this.houseType = this.input("i002", 2); //standalone / apartment CN
		this.houseSize = D6.consShow["TO"].houseSize; //home size
	
		// default area heating set
		this.priceHotWater =
			this.input("i066", 1) == 1
				? (D6.area.averageCostEnergy.hotwater * this.houseSize) / 100
				: 0;
	
		this.heatSpace = this.input("i201", this.heatArea <= 3 ? 0.6 : 0.2); //part of heating CN
		this.heatMonth = this.input("i206", D6.area.seasonMonth.winter); //heating month
	
		//default set
		this.heatEquip = this.input("i202", -1); //heating equipment
	
		// heat time default set
		this.heatTime = this.input("i204", 6); //heating time
	
		this.heatTemp = this.input("i205", 21); //heating temperature setting
		this.priceEleSpring = this.input("i0912", -1); //electricity charge in spring/fall
		this.priceEleWinter = this.input("i0911", -1); //electricity charge in winter
		this.priceGasSpring = this.input("i0922", -1); //gas charge in spring/fall
		this.priceGasWinter = this.input("i0921", -1); //gas charge in winter
		this.consKeros = this.input("i064", -1); //consumption of kerosene
		this.hotwaterEquipType = this.input("i101", -1); //hot water temperature
	
		this.performanceWindow = this.input("i041", -1); //performance of window
		this.performanceWall = this.input("i042", -1); //performance of wall insulation
		this.reformWindow = this.input("i043", -1); //reform to change window
		this.reformfloor = this.input("i044", -1); //reform to change floor
	};
	
	//add function
	D6.consHTsum.calc_org = D6.consHTsum.calc;
	D6.consHTsum.calc = function() {
		D6.consHTsum.calc_org();
		//set all for heater
		if (this.priceHotWater > 0) {
			this.hotwater = D6.consShow["TO"].hotwater;
			this.priceHotWater = D6.consShow["TO"].priceHotWater;
		}
	};

	D6.consHWsum.precalc_org = D6.consHWsum.precalc;
	D6.consHWsum.precalc = function() {
		D6.consHWsum.precalc_org();
		this.tabDayWeek = this.input("i103", 0);
		this.tabDayWeekSummer = this.input("i104", 0);
		this.equipType = this.input("i101", 3);
	};
		
	D6.consRFsum.equip = function(year, size) {
		var sizeThreshold = [200, 400, 1000]; //last is maxsize
	
		//definition of equip [size][year][code]
		//	code: pf1,pf2 performance 1 is good one
		//				pr1,pr2 price 1 is good one
		var defEquip = {
			200: {
				1900: { pf1: 250, pf2: 350, pr1: 5000, pr2: 4000 },
				2005: { pf1: 250, pf2: 350, pr1: 5000, pr2: 4000 },
				2015: { pf1: 200, pf2: 300, pr1: 5000, pr2: 4000 },
				2030: { pf1: 200, pf2: 250, pr1: 5000, pr2: 4000 }
			},
			400: {
				1900: { pf1: 450, pf2: 550, pr1: 7000, pr2: 6000 },
				1995: { pf1: 400, pf2: 500, pr1: 7000, pr2: 6000 },
				2015: { pf1: 300, pf2: 350, pr1: 6000, pr2: 5000 },
				2030: { pf1: 250, pf2: 300, pr1: 6000, pr2: 5000 }
			},
			1100: {
				1900: { pf1: 700, pf2: 900, pr1: 12000, pr2: 10000 },
				1995: { pf1: 600, pf2: 800, pr1: 12000, pr2: 10000 },
				2015: { pf1: 400, pf2: 700, pr1: 10000, pr2: 9000 },
				2030: { pf1: 400, pf2: 500, pr1: 10000, pr2: 9000 }
			}
		};
	
		return this.getEquipParameters(year, size, sizeThreshold, defEquip);
	};
	
	D6.consTotal.precalc = function() {
		this.clear();
	
		this.person = this.input("i001", 3); //person
	
		//solar
		this.solarSet = this.input("i051", 0); //PV exist 1:exist
		this.solarKw = this.input("i052", this.solarSet * 3.5); //PV size (kW)
		this.solarYear = this.input("i053", 0); //PV set year
	
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
	
		this.priceEleSell = this.input("i062", 0); //sell electricity
	
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
	
		this.houseType = this.input("i002", 2); //type of house 　小区楼房
		this.houseSize = this.input(
			"i003",
			this.person == 1 ? 60 : 80 + this.person * 10
		);
		//floor size
	
		this.heatEquip = this.input("i202", -1); //main heat equipment
	
		//coal original
		this.priceKeros = this.priceKerosSpring = this.priceKerosSummer = 0;
		if (D6.area.averageCostEnergy.coal < 1000) {
			this.priceCoal = this.input("i065", 0);
		} else {
			this.priceCoal = this.input("i065", D6.area.averageCostEnergy.coal);
		}
		this.priceCoalSpring = this.input("i0942", -1);
		this.priceCoalSummer = this.input("i0943", -1);
		this.priceCoalWinter = this.input("i0941", -1);
	
		//hotwater supply oiginal
		this.priceHotWater =
			this.input("i066", 1) == 1
				? (D6.area.averageCostEnergy.hotwater * this.houseSize) / 100
				: 0;
	
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
			kerosene: [this.priceKeros, this.priceKerosSpring, this.priceKerosSummer],
			coal: [this.priceCoalWinter, this.priceCoalSpring, this.priceCoalSummer],
			hotwater: [-1, -1, -1],
			car: [-1, -1, -1]
		};
	
		//monthly pattern  -1:no input
		this.monthlyPrice = {
			electricity: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			gas: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			kerosene: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			coal: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			hotwater: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			car: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		};
	};
	
	DC = D6.consTotal; //temporaly set as DC
	//consumption override
	DC.calc = function() {
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
		var generateEle = (this.generateEleUnit * this.solarKw) / 12;
	
		//solar sell price
		var pvSellUnitPrice = D6.Unit.price.sellelectricity;
	
		//PV installed
		if (this.solarKw > 0) {
			// gross = electricity consumed in home include self consumption amount
			this.grossElectricity =
				(1 - this.solarSaleRatio) * generateEle +
				Math.max(
					0,
					this.priceEle -
						this.priceEleSell +
						this.solarSaleRatio * generateEle * pvSellUnitPrice -
						priceBase
				) /
					this.averagePriceElec;
			this.electricity = this.grossElectricity - generateEle;
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
	
		this.gas = (this.priceGas - D6.Unit.priceBase.gas) / D6.Unit.price.gas;
	
		//coal original=====================================
		ret = D6.calcMonthly(
			this.priceCoal,
			this.seasonPrice["coal"],
			this.monthlyPrice["coal"],
			seasonConsPattern.coal,
			"coal"
		);
		this.priceCoal = ret.ave;
		this.seasonPrice["coal"] = ret.season;
		this.monthlyPrice["coal"] = ret.monthly;
	
		this.coal = this.priceCoal / D6.Unit.price.coal;
	
		//hotwater  original=====================================
		ret = D6.calcMonthly(
			this.priceHotWater,
			this.seasonPrice["hotwater"],
			this.monthlyPrice["hotwater"],
			seasonConsPattern.hotwater,
			"hotwater"
		);
		this.priceHotWater = ret.ave;
		this.hotwater = this.priceHotWater / D6.Unit.price.hotwater;
		this.seasonPrice["hotwater"] = ret.season;
		this.monthlyPrice["hotwater"] = ret.monthly;
	
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
	};
	
	//対策計算
	DC.calcMeasure = function() {
		var mes;
	
		var solar_reduceVisualize = this.reduceHEMSRatio; //モニターによる消費電力削減率
		var solar_sellPrice = 1; //売電単価
	
		//mTOsolar-----------------------------------------
		mes = this.measures["mTOsolar"]; //set mes
		mes.copy(this);
	
		// not installed and ( stand alone or desired )
		if (this.solarKw == 0 && (this.houseType != 2 || this.replace_solar)) {
			// monthly generate electricity
			var solar_generate_kWh = (this.generateEleUnit * this.standardSize) / 12;
	
			// saving by generation
			var solar_priceDown =
				solar_generate_kWh * this.solarSaleRatio * solar_sellPrice +
				solar_generate_kWh *
					(1 - this.solarSaleRatio) *
					D6.Unit.price.electricity;
	
			// saving by visualize display
			var solar_priceVisualize =
				this.electricity * solar_reduceVisualize * D6.Unit.price.electricity;
	
			//electricity and cost
			mes.electricity =
				this.electricity * (1 - solar_reduceVisualize) - solar_generate_kWh;
			mes.costUnique = this.cost - solar_priceDown - solar_priceVisualize;
	
			//initial cost
			mes.priceNew = this.standardSize * mes.priceOrg;
			//comment add to original definition
			mes.advice =
				D6.scenario.defMeasures["mTOsolar"]["advice"] +
				"<br>　标准" +
				this.standardSize +
				"kW的是该类型的计算结果。";
		}
	
		//mTOhems HEMS-----------------------------------------
		mes = this.measures["mTOhems"]; //set mes
		mes.copy(this);
	
		//pv system is not installed  --- pv system includes visualize display
		if (!this.isSelected("mTOsolar")) {
			mes.electricity = this.electricity * (1 - this.reduceHEMSRatio);
		}
	
		//mTOsolarSmall ベランダ太陽光------------------------------------------
		mes = this.measures["mTOsolarSmall"]; //set mes
		mes.copy(this);
		var watt_panel = 50; // install panel size (W)
		var eff = 0.3; // effectiveness to roof
		mes.electricity -= ((watt_panel / 1000) * eff * this.generateEleUnit) / 12;
	};
	

}

// D6.scenario.areafix  fix area set by home/office
// called by diagnosis.js  just after create scenario

D6.scenario.areafix = function() {
	/*
	//set area and person to calculate average, heat load etc.
	D6.area.setCalcBaseParams = function(){
		D6.area.setPersonArea( D6.doc.data.i001, D6.doc.data.i021, D6.doc.data.i023);		
	};
	
	//get seasonal parameters
	D6.area.getSeasonParamCommon = function(){
		return D6.area.getSeasonParam(  D6.area.area  );
	};
*/


D6.scenario.defMeasures['mTOsolar'] = { mid:"1",  name:"mTOsolar",  title:"安装太阳能光伏板",  easyness:"0.5",  refCons:"consTotal",  titleShort:"太阳能发电", level:"",  figNum:"25",  lifeTime:"20",  price:"40000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"太阳能发电设备上没有诸如电动机之类的部件，只要安装太阳能板就能发电。因此使用寿命长，维修简单。其中的交直流转换器需要每十年更换一次。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mTOhems'] = { mid:"2",  name:"mTOhems",  title:"安装家庭智能控制系统",  easyness:"1",  refCons:"consTotal",  titleShort:"安装家庭智能控制系统", level:"",  figNum:"3",  lifeTime:"20",  price:"20000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"HEMS(家庭能源管理系统)是家用的电量测量系统。帮助用户精确掌握家电的每小时耗电量，也可以对空调等家电进行自动控制，达到节电目的。该系统可为用户提供有关家电的耗电方式的信息，节电小窍门。用户可根据系统所显示的图表查看家庭的高耗电时间段，寻找耗电原因。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mTOsolarSmall'] = { mid:"3",  name:"mTOsolarSmall",  title:"将太阳能发电板安装在阳光照射充足的地方",  easyness:"2",  refCons:"consTotal",  titleShort:"太阳能发电板", level:"",  figNum:"25",  lifeTime:"10",  price:"5000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"这里提到的太阳能设备不是安装在屋顶上，而是可放置在阳台上为照明供电的可移动式小型面板。相关产品可在市场上买到，用户也可以自己动手制作。材料可在网上或建材市场买到。就像在晴天晒被褥一样，可通过日照给电池充电，再对充电获取的电力加以利用。但在阴天等阳光不足的条件下可能无法供电。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWecocute'] = { mid:"101",  name:"mHWecocute",  title:"使用高效节能的热水器",  easyness:"2",  refCons:"consHWsum",  titleShort:"高效节能的热水器", level:"",  figNum:"8",  lifeTime:"10",  price:"40000",  roanShow:"1",  standardType:"電気温水器",  subsidy :"",  advice:"Eco-cute（冷媒热泵式电气热水器）上带有类似空调室外机的设备，因此可利用户外空气中的热能来烧开水，比电热水器效果增加3倍以上。推荐给家庭人口多，每天都必须泡澡的家庭使用。另外，可根据日常的用水方式设置节约模式，还可以更加节能。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWecojoze'] = { mid:"102",  name:"mHWecojoze",  title:"使用高效节能的煤气热水器",  easyness:"2",  refCons:"consHWsum",  titleShort:"高效节能的煤气热水器", level:"",  figNum:"10",  lifeTime:"10",  price:"20000",  roanShow:"",  standardType:"既存型",  subsidy :"",  advice:"Eco-jouzu（潜热回收型热水器）可回收散失的水蒸气中的热量，和现有的燃气热水器相比效率增加10%。体积与现有的燃气热水器几乎相等，只是为了回收热量的缘故体积稍大一些，另外该热水器带有引水导管，引出回收热气时产生的水分。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWecofeel'] = { mid:"103",  name:"mHWecofeel",  title:"###not show##使用高效节能的热水器",  easyness:"1",  refCons:"consHWsum",  titleShort:"高效节能的热水器", level:"",  figNum:"10",  lifeTime:"10",  price:"25000",  roanShow:"",  standardType:"既存型",  subsidy :"",  advice:"Eco-feel（潜热回收型热水器）可回收散失的水蒸气中的热量，和现有的煤油热水器相比效率增加10%。体积与现有的煤油热水器几乎相等，只是为了回收热量的缘故体积稍大一些，该热水器也带有引水管，引出回收热气时产生的水分。类似的使用燃气的设备称为Eco-jouzu。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWenefarm'] = { mid:"105",  name:"mHWenefarm",  title:"###not show#使用高效节能的热水器",  easyness:"0.5",  refCons:"consHWsum",  titleShort:"高效节能的热水器", level:"5",  figNum:"10",  lifeTime:"10",  price:"120000",  roanShow:"1",  standardType:"エコジョーズ",  subsidy :"",  advice:"Ene-farm使用燃料电池边发电边烧开水，效率很高。所生产的电力不但可供家庭消费，发电产生的余热还可以洗澡水的形式储存起来使用。更适用于用电量大烧水量大的家庭，节能效果显著。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWsolarHeater'] = { mid:"106",  name:"mHWsolarHeater",  title:"安装太阳能热水器",  easyness:"1",  refCons:"consHWsum",  titleShort:"太阳能热水器", level:"",  figNum:"9",  lifeTime:"10",  price:"40000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"在温暖月份的晴天，仅用太阳能就可以烧开泡澡用水。在冬季可以将太阳能加热过的水再加热后使用，大幅削减烧洗澡水的能耗。因为构造比较简单，可将洗澡水烧开，降低碳排放量，在世界各地都被广泛采用。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWsolarSystem'] = { mid:"107",  name:"mHWsolarSystem",  title:"安装太阳能系统",  easyness:"1",  refCons:"consHWsum",  titleShort:"太阳能系统", level:"",  figNum:"9",  lifeTime:"10",  price:"60000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"由于这款热水器的蓄水槽是放置在地面，而不是被摆放在屋顶，因此不会增加屋顶的负荷。在气温较高的晴天，仅用太阳能就可以烧开泡澡用水。在冬天可以将太阳能加热过的水再加热后使用，大幅削减烧洗澡水的能耗。因为构造比较简单，供热效果好，在世界各地都被广泛采用。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWshowerHead'] = { mid:"108",  name:"mHWshowerHead",  title:"使用节水花洒",  easyness:"5",  refCons:"consHWshower",  titleShort:"节水花洒", level:"",  figNum:"11",  lifeTime:"10",  price:"200",  roanShow:"",  standardType:"",  subsidy :"",  advice:"这款花洒的头部是可更换的。节水花洒的出水孔设计得比较小，因此水势强大。另外还带有止水按钮。它可以节约30%左右水量。在电器店或者网上可以买。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWshowerTime'] = { mid:"109",  name:"mHWshowerTime",  title:"每个人每天少淋浴一分钟",  easyness:"4",  refCons:"consHWshower",  titleShort:"每个人每天少淋浴一分钟", level:"",  figNum:"11",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"淋浴的耗电量很大，持续出水状态下的耗电量相当于300台电视机用电量。即使停用很短时间，也能够达到省电效果。可在涂抹浴液时关闭水流，注意减少用水时间。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWshowerTime30'] = { mid:"110",  name:"mHWshowerTime30",  title:"减少30%的淋浴时间",  easyness:"3",  refCons:"consHWshower",  titleShort:"减少30%的淋浴时间", level:"",  figNum:"11",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"淋浴的耗电量很大，持续出水状态下的耗电量相当于300台电视机用电量。即使停用很短时间，也能够达到省电效果。可在涂抹浴液时关闭水流，注意减少用水时间。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWkeep'] = { mid:"111",  name:"mHWkeep",  title:"###not show#为了不要再加热，家人都连续不断洗澡",  easyness:"3",  refCons:"consHWtub",  titleShort:"不要再烧洗澡水", level:"",  figNum:"12",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"洗澡水温度过低时，需要将洗澡水从浴缸取出，送到热水器进行再次加热。送水过程会导致水温降低，消耗更多电量。所以让家人一个紧接一个洗澡，不使用二次加热功能，可以达到节能效果。另外，通过给浴缸加上盖板，也可以防止水温快速降低。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWsaveMode'] = { mid:"112",  name:"mHWsaveMode",  title:"###not show#将热水器设置为节能模式",  easyness:"3",  refCons:"consHWsum",  titleShort:"将热水器设置为节能模式", level:"",  figNum:"8",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"Eco-cute（冷媒热泵式电气热水器）可以设定夜晚的烧开水量。如果因为担心不够用而额外多烧水，在保温状态下会增加热量损失。在正常使用的情况下，尤其是日常使用不存在不够用的问题时，通过设置节约模式，达到节能目的。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWstopAutoKeep'] = { mid:"113",  name:"mHWstopAutoKeep",  title:"#####如果洗澡完后没人继续洗澡，不要自动保温，而即将有人洗澡之前再加热",  easyness:"3",  refCons:"consHWtub",  titleShort:"不要自动保温", level:"",  figNum:"12",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"自动保温模式下，由于浴缸里的水会被不断的输送到屋外的热水器去加热，造成了管道部分的热量浪费。可以让家人一个接一个的去泡澡，这样就无需设置保温。如果大家的洗澡时间不一样，可以在泡澡前进行再次加热，节约能源。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWinsulation'] = { mid:"114",  name:"mHWinsulation",  title:"#####改装绝热型浴缸",  easyness:"1",  refCons:"consHWtub",  titleShort:"绝热型浴缸", level:"",  figNum:"12",  lifeTime:"10",  price:"60000",  roanShow:"",  standardType:"普及型",  subsidy :"",  advice:"现在越来越多浴缸配备了发泡沫苯乙烯等阻热材料的盖板，防止水温快速下降。虽然用户需要对浴缸进行改造，但改造后可以避免水温下降，不需要二次加热。由于改造成一体化浴室，整个浴室内的热量不会轻易散失。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWonlyShower'] = { mid:"115",  name:"mHWonlyShower",  title:"#####夏天浴缸不要放满热水，泡淋浴就够",  easyness:"3",  refCons:"consHWtub",  titleShort:"夏天泡淋浴", level:"",  figNum:"11",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"给浴缸加满水相当于10～20分钟的淋浴时间。如果不使用自动充水设备，只用浴缸里的水洗澡的家庭，水量反倒多，可和淋浴同时使用的话使用浴缸的水量会减少。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWdishTank'] = { mid:"116",  name:"mHWdishTank",  title:"冲洗餐具的时候，请不要一直开着水龙头",  easyness:"2",  refCons:"consHWdishwash",  titleShort:"不要流水一直冲洗餐具 ", level:"",  figNum:"13",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"在用洗涤剂洗碗时停用热水，请尽可能想办法缩短开水龙头的时间。先用旧布擦拭油腻部分再用水洗会更快捷。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWdishWater'] = { mid:"117",  name:"mHWdishWater",  title:"水温可以接受的季节，请使用冷水冲洗餐具蔬果",  easyness:"2",  refCons:"consHWdishwash",  titleShort:"洗餐具使用冷水", level:"",  figNum:"13",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"在气温较高的季节，不用热水也可以充分洗净餐具。比如洗碗使用10分钟热水仅相当于使用电水壶烧三壶水的能耗。先用旧布擦拭油腻部分再用水洗会更快捷。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCKdishWasher'] = { mid:"118",  name:"mCKdishWasher",  title:"使用洗碗机",  easyness:"2",  refCons:"consHWdishwash",  titleShort:"洗碗机", level:"",  figNum:"15",  lifeTime:"10",  price:"8000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"与使用流动的热水洗碗相比，洗碗机因为是蓄水式洗碗，所以更加节能。直接用冷水洗碗比洗碗机更节能。因此手工洗碗也是节能的好方法。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWtap'] = { mid:"119",  name:"mHWtap",  title:"在厨房和洗手间安装节水水龙头",  easyness:"2",  refCons:"consHWsum",  titleShort:"节水水龙头", level:"",  figNum:"13",  lifeTime:"20",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"使用新型水龙头，比如伸手出水型的感应式龙头，或者冷热混水型龙头（必须向左拧才会出热水），用起来都很方便，但可以减少20%以上的热水用量。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWreplaceToilet5'] = { mid:"120",  name:"mHWreplaceToilet5",  title:"安装节水型座便器",  easyness:"1",  refCons:"consHWtoilet",  titleShort:"节水型座便器", level:"",  figNum:"19",  lifeTime:"10",  price:"3000",  roanShow:"",  standardType:"既存型",  subsidy :"",  advice:"虽然需要施工更换坐便器，但用水量可比普通座便器减少一半以上。水费会大幅度降低。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWreplaceToilet'] = { mid:"121",  name:"mHWreplaceToilet",  title:"##使用瞬间温水式马桶",  easyness:"1",  refCons:"consHWtoilet",  titleShort:"瞬间温水式马桶", level:"",  figNum:"19",  lifeTime:"10",  price:"3000",  roanShow:"",  standardType:"既存型",  subsidy :"",  advice:"新产品具有节能功能，比如在我打开盖子的瞬间升温的类型，它需要较少的电力消耗。请选择节能的全年用电量，这显示在目录中作为参考。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHWtemplatureToilet'] = { mid:"122",  name:"mHWtemplatureToilet",  title:"##降低保温马桶温度",  easyness:"3",  refCons:"consHWtoilet",  titleShort:"设定马桶温度", level:"",  figNum:"19",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"时间不冷或关闭隔热，您可以通过设置温度设置为较低的节约能源。应用在马桶座盖，这将是很难感觉到寒冷。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHWcoverTilet'] = { mid:"123",  name:"mHWcoverTilet",  title:"##关保温马桶盖",  easyness:"3",  refCons:"consHWtoilet",  titleShort:"关保温马桶盖", level:"",  figNum:"19",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"如果您离开该国提出的马桶座圈的盖，热量可能逃走隔热，功耗也会增加。当您完成使用时，它会通过关闭盖子节约能源。如果没有寒冷，也导致节能，你不想要的温暖。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mACreplace'] = { mid:"201",  name:"mACreplace",  title:"使用一级能耗的空调",  easyness:"1",  refCons:"consAC",  titleShort:"一级能耗的空调", level:"",  figNum:"1",  lifeTime:"10",  price:"16000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"买换空调的时候，推荐选择一级能耗空调。供暖性能更高，与使用燃气或煤油的取暖设备相比，减少了二氧化碳排放。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mACreplaceHeat'] = { mid:"202",  name:"mACreplaceHeat",  title:"##使用节能空调取暖功能要不要加“开集中供暖之前”",  easyness:"2",  refCons:"consAC",  titleShort:"节能空调取暖", level:"",  figNum:"1",  lifeTime:"10",  price:"16000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"现在有很多一级能耗空调使用的是户外空气中的热量，与使用燃气或煤油的取暖设备相比，减少了二氧化碳排放。买换空调的时候，请选择一级能耗空调。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mACchangeHeat'] = { mid:"203",  name:"mACchangeHeat",  title:"##使用空调取暖功能要不要加“开集中供暖之前”",  easyness:"2",  refCons:"consACheat",  titleShort:"空调取暖", level:"",  figNum:"1",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"由于空调取暖使用的是户外空气中的热量，与使用燃气或煤油的取暖设备相比，可大幅减少二氧化碳排放。但使用空调取暖时，暖风必须吹到地板才能达到取暖效果，所以建议设定强风模式或者使用扇子扇风。另外，最近的新型空调都增加了吹热地板的功能，推荐使用。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTchangeHeat'] = { mid:"204",  name:"mHTchangeHeat",  title:"##使用空调取暖功能要不要加“开集中供暖之前”",  easyness:"1",  refCons:"consHTsum",  titleShort:"空调取暖", level:"",  figNum:"1",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"空调采暖会使用室外空气中的热量，与燃气或煤油供暖相比，可大幅减少二氧化碳的排放，削减采暖费用。但使用空调取暖时，暖风必须吹到地板才能达到取暖效果，所以建议设定强风模式或使用扇子扇风。另外，最近的新型空调都增加了吹热地板的功能，推荐使用。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCOsunCut'] = { mid:"205",  name:"mCOsunCut",  title:"夏天，开空调时，用遮光帘隔热",  easyness:"4",  refCons:"consCOsum",  titleShort:"遮光帘", level:"",  figNum:"1",  lifeTime:"5",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"开空调时如果阳光照入室内，就好像窗户边上放了个烤炉一样。遮蔽阳光会更节能，更凉快。使用普通窗帘会导致窗户内侧的窗帘被烤热，因此推荐使用百叶窗或竹帘。另外，如果从5月份开始种植苦瓜、牵牛花、丝瓜等植物，夏天会形成美丽的“绿色窗帘”，使人舒适度夏。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCOtemplature'] = { mid:"206",  name:"mCOtemplature",  title:"夏天空调调到26度",  easyness:"3",  refCons:"consACcool",  titleShort:"空调设定26度（夏天）", level:"",  figNum:"1",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"夏季的空调推荐温度为26度以上。设置温度的目标是“不热就行”而不是“越凉快越好”。因为暑热感觉有个体差异，设置温度时无需勉强，也可以多使用电扇、或少穿些衣服。开窗通风、风铃的声音都会使人感觉凉爽。空调温度每调高1度，就可以减少约10%的二氧化碳排放量。可以在夏季快结束时早些停用空调，达到减排效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTtemplature'] = { mid:"207",  name:"mHTtemplature",  title:"冬天空调取暖不要高于20度",  easyness:"3",  refCons:"consACheat",  titleShort:"空调设定20度（冬天）", level:"",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"冬天的空调推荐温度为20度以下。设置温度的目标是“不冷就行”而不是“越热越好”。因为寒冷感觉有个体差异，设置温度时无需勉强，还可以在家多穿衣服，吃容易让身体发热的饭食。空调温度每调低1度，就可以减少约10%的二氧气化碳排放量。可以在冬季快结束时提前停用暖气设备，达到减排效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTwindowSheet'] = { mid:"208",  name:"mHTwindowSheet",  title:"开空调取暖时，将绝热材料贴在窗户上",  easyness:"3",  refCons:"consACheat",  titleShort:"窗户贴绝热材料", level:"",  figNum:"4",  lifeTime:"3",  price:"300",  roanShow:"",  standardType:"",  subsidy :"",  advice:"绝热材料（类似气泡膜那样的材料）在网上或者家装市场上可以买到。清洁窗户并喷雾后，直接将绝热材料贴在窗户，不仅绝热还防止结露。使窗外吹进的冷风变得柔和，令人感到更舒适。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTdouble'] = { mid:"209",  name:"mHTdouble",  title:"将单层窗户更换为多层窗",  easyness:"1",  refCons:"consACheat",  titleShort:"多层窗", level:"5",  figNum:"4",  lifeTime:"30",  price:"10000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"取暖时室内热气容易从窗户或者窗框散失，将单层玻璃更换为双层玻璃可以减少一半的热量损失。不仅节能，还可以防止结露。使窗外吹进的冷风变得柔和，令人感到更舒适。针对不同房屋结构有不同的解决方案。具体请咨询装修公司或者自然之友低碳家庭实验室。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTlowe'] = { mid:"210",  name:"mHTlowe",  title:"将窗户更换为low-E玻璃，窗框换树脂制品",  easyness:"1",  refCons:"consACheat",  titleShort:"low-E玻璃，树脂窗框", level:"",  figNum:"4",  lifeTime:"30",  price:"15000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"取暖时室内热气容易从窗户或者窗框散失，将普通双层玻璃更换为low-E玻璃，将窗框更换为树脂制品可减少一半的热量散失。与一般的双层玻璃相比，low-E玻璃绝热性能高，减少了从窗框散失出去的热气，不仅绝热而且防止结露。针对不同房屋结构有不同的解决方案。具体请咨询装修公司或者自然之友低碳家庭实验室。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTuchimado'] = { mid:"211",  name:"mHTuchimado",  title:"安装内部窗户",  easyness:"2",  refCons:"consACheat",  titleShort:"多层窗", level:"5",  figNum:"4",  lifeTime:"30",  price:"6000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"取暖时室内热气容易从窗户或者窗框散失。可在现有窗户或窗框内侧增加一个“内窗”，解决此类问题。内窗安装费便宜，一个小时即可完成施工，有防止结露和防盗效果。具体请咨询装修公司或者自然之友低碳家庭实验室。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTdoubleGlassAll'] = { mid:"212",  name:"mHTdoubleGlassAll",  title:"将家里所有的窗户都更换为多层玻璃",  easyness:"1",  refCons:"consHTsum",  titleShort:"所有的房间使用多层玻璃", level:"",  figNum:"4",  lifeTime:"30",  price:"10000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"取暖时热气从窗户或者窗框容易出去。将单层玻璃更换为双层玻璃可以减少一半的热量散失。不仅节能而且防止结露。使窗外吹进的冷风变得柔和，减少冬季早晨的风寒感觉。针对不同房屋结构有不同的解决方案。具体请咨询装修公司或者自然之友低碳家庭实验室。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTuchimadoAll'] = { mid:"213",  name:"mHTuchimadoAll",  title:"家里所有的窗户安装内部窗户",  easyness:"1",  refCons:"consHTsum",  titleShort:"所有的房间安装内部窗户", level:"",  figNum:"4",  lifeTime:"30",  price:"10000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"取暖时室内热气容易从窗户或者窗框散失。可在现有窗户或窗框内侧增加一个“内窗”，解决此类问题。内窗安装费便宜，一个小时即可完成施工，有防止结露和防盗效果。使窗外吹进的冷风变得柔和，减少冬季早晨的风寒感觉。具体请咨询装修公司或者自然之友低碳家庭实验室。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTloweAll'] = { mid:"214",  name:"mHTloweAll",  title:"将家里所有的窗户都更换为low-E玻璃和树脂窗框",  easyness:"1",  refCons:"consHTsum",  titleShort:"所有的房间使用low-E玻璃和树脂窗框", level:"",  figNum:"4",  lifeTime:"30",  price:"15000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"取暖时热气从窗户或者窗框容易出去。将单层玻璃窗更换为low-E玻璃窗，将窗框更换为树脂产品可减少一半的热量散失。low-E玻璃窗与普通双层玻璃窗相比，绝热性能高，而且可以减少从窗框流失的热气。不仅节能还防止结露。从窗外吹进的冷风会变得柔和，减少冬季早晨的风寒感觉。针对不同家庭有不同的解决方案，具体请咨询装修公司或者自然之友低碳家庭实验室。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mACfilter'] = { mid:"215",  name:"mACfilter",  title:"清洁空调过滤器",  easyness:"2",  refCons:"consACheat",  titleShort:"清洁过滤器", level:"5",  figNum:"1",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"推荐一个月清洗一次空调过滤器。过滤网堵塞了会导致送风强度减弱，降低空调供暖效率。厨房或靠近厨房的房间容易沾上油污，过滤网很容易脏，所以需要仔细清洁。有些新款空调已经带有了过滤网自动清洁功能。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTtime'] = { mid:"216",  name:"mHTtime",  title:"##缩短空调使用时间要不要加“开集中供暖之前”",  easyness:"3",  refCons:"consACheat",  titleShort:"缩短空调使用时间", level:"",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"人们一般容易长时间的开空调取暖，建议房间变暖后关闭空调。也可以在临睡或外出前30分钟关闭空调。没人的房间开空调非常浪费，请尽量避免这种情况。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTpartialHeating'] = { mid:"217",  name:"mHTpartialHeating",  title:"##为了少用空调，使用电热地毯或日式取暖桌中国都没有或很少哈",  easyness:"2",  refCons:"consACheat",  titleShort:"电热地毯和日式取暖桌", level:"",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"使用取暖桌或电热地毯只加热身体周边的温度，耗电量比较小。这时把空调采暖温度调低，也不会降低体感舒适度。假如在空调取暖的房间里建有通风结构或复式结构的楼梯，这种结构很容易造成热气流上升，好不容易加热的空气跑到屋顶，降低了室内增温效率。针对这样的房间可考虑使用地暖，另外还可以穿袜子，多穿衣服来应对。使用电热地毯时将铝膜绝热材料铺在地板和垫子的中间，给取暖桌配备厚被子，都可以达到省电效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTceiling'] = { mid:"218",  name:"mHTceiling",  title:"取暖时循环上面的空气",  easyness:"2",  refCons:"consACheat",  titleShort:"循环空气", level:"",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"空调取暖时，天棚温度经常比地板温度高出5～10度。用扇子、空气循环设备、电风扇等向上吹风加速空气流动，使屋顶的暖空气回流到地面，增加舒适度。穿袜子或多穿衣服也可达到保暖效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTareaLimit'] = { mid:"219",  name:"mHTareaLimit",  title:"取暖时关门，缩小供暖范围",  easyness:"2",  refCons:"consACheat",  titleShort:"缩小供暖范围", level:"5",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"房间面积越大取暖用电量越高，因此用推拉门、隔断门将房间分隔成较小的空间，即便使用小功率取暖设备也可以达到效果。相反带有通风结构的房间或层高很高的房间，就需要更多的供暖。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTdanran'] = { mid:"220",  name:"mHTdanran",  title:"一家人聚在一个房间取暖",  easyness:"3",  refCons:"consHTsum",  titleShort:"一家人聚在一个房间取暖", level:"",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"如果家里每个人都待在自己的房间里，那么每个房间都需要开灯开空调。大家聚在一个房间里可以减少空调、照明的使用量。因此可以尝试都聚在一个房间里娱乐休息，达到节能目标。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTbiomass'] = { mid:"221",  name:"mHTbiomass",  title:"##使用木柴取暖炉（颗粒壁炉）在中国有吗？ 日本也很少哈",  easyness:"1",  refCons:"consACheat",  titleShort:"木柴取暖炉（颗粒壁炉）", level:"",  figNum:"3",  lifeTime:"20",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mHTcentralNotUse'] = { mid:"222",  name:"mHTcentralNotUse",  title:"不使用的集中供暖设定低温",  easyness:"2",  refCons:"consHTsum",  titleShort:"集中供暖设定低温", level:"5",  figNum:"3",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"如果你使用集中供暖，无人的房间也会有供暖。完全关闭无人房间的供暖又可能带来结露、冻结的问题。可以给无人房间设置一个较低温度以减少浪费。有人房间的暖气推荐温度是20度。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mHTkanki'] = { mid:"223",  name:"mHTkanki",  title:"安装全热交换器",  easyness:"1",  refCons:"consHTsum",  titleShort:"全热交换器", level:"",  figNum:"3",  lifeTime:"20",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"换气设备导致了暖气的流失。选择可回收热量减少流失量的换气设备，可大幅度减少热气损失。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mPTstopPot'] = { mid:"301",  name:"mPTstopPot",  title:"不使用电水壶保温",  easyness:"2",  refCons:"consCKpot",  titleShort:"不使用电水壶保温", level:"",  figNum:"17",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"电水壶在保温时会额外消耗电量。请根据需要烧水或使用保温杯。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mPTstopPotNight'] = { mid:"302",  name:"mPTstopPotNight",  title:"出门时或夜间不使用电水壶保温",  easyness:"3",  refCons:"consCKpot",  titleShort:"夜间关闭电水壶保温功能", level:"",  figNum:"17",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"外出或夜间等长时间不使用热水时，关闭电水壶的电源也可以节能。关闭电饭锅、坐便器的的保温功能也同样可以达到节能效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mPTstopRiceCooker'] = { mid:"303",  name:"mPTstopRiceCooker",  title:"不使用电饭煲保温",  easyness:"3",  refCons:"consCKrice",  titleShort:"不使用电饭煲保温", level:"",  figNum:"18",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"加热饭菜时，用微波炉加热比用电饭锅保温更加省电。长时间保温可能导致米饭变色，常温保温的米饭会更好吃。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mPTreplacePot'] = { mid:"304",  name:"mPTreplacePot",  title:"使用节能电水壶",  easyness:"2",  refCons:"consCKpot",  titleShort:"节能电水壶", level:"",  figNum:"17",  lifeTime:"",  price:"",  roanShow:"",  standardType:"既存型",  subsidy :"",  advice:"市场上有带有类似保温瓶隔热结构的电水壶，可降低保温时的用电量。购买时可参考店家提供的产品保温耗电量信息。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mCKflame'] = { mid:"305",  name:"mCKflame",  title:"火焰不要超出锅外围",  easyness:"2",  refCons:"consCKcook",  titleShort:"调整火焰", level:"",  figNum:"14",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"烧菜时火焰超出锅外围不仅带来燃气浪费，也不能缩短烧菜时间。请注意调节火焰大小。合理的烧菜步骤也可以减少煤气消费量。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mDRsolar'] = { mid:"401",  name:"mDRsolar",  title:"晴天不用干衣机，在阳光下暴晒",  easyness:"2",  refCons:"consDRsum",  titleShort:"在阳光下曝晒", level:"",  figNum:"16",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"洗衣机的烘干功能虽然方便，但耗电量却是洗衣时的10倍以上。尽量不用烘干功能，直接在阳光下晾晒可达到节能效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mDRheatPump'] = { mid:"402",  name:"mDRheatPump",  title:"使用热泵式洗衣干衣机",  easyness:"1",  refCons:"consDRsum",  titleShort:"热泵式洗衣干衣机", level:"",  figNum:"16",  lifeTime:"10",  price:"14000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"在衣物烘干机或带有烘干功能的洗衣机设备中，有一种热泵式烘干机，耗电量只是普通烘干机的一半，使用热泵式烘干机可以减少电费支出。但由于烘干本身就是高能耗功能，所以最好是不使用烘干功能，改为阳光下晾晒。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mLIceilingLED'] = { mid:"501",  name:"mLIceilingLED",  title:"将荧光灯更换为LED灯",  easyness:"4",  refCons:"consLI",  titleShort:"LED灯", level:"",  figNum:"6",  lifeTime:"20",  price:"",  roanShow:"",  standardType:"蛍光灯",  subsidy :"",  advice:"LED灯的节能性好，经久耐用。没有虫子进入灯罩的问题，可节省清洁时间。安装LED灯时需要去除原来的照明灯具，因为可以继续使用原有灯具的插座，所以不需要请专业技工，使用LED灯还可以调节灯光颜色和亮度。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mLILED'] = { mid:"502",  name:"mLILED",  title:"改为使用LED",  easyness:"2",  refCons:"consLI",  titleShort:"LED灯", level:"",  figNum:"5",  lifeTime:"40000h",  price:"200",  roanShow:"",  standardType:"電球",  subsidy :"",  advice:"安装LED灯时可直接使用原有白炽灯的插座，因此可以在更换灯泡时直接把原来的白炽灯换为LED灯。这样可减少80%的耗电量，使用寿命是原来的40倍以上。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mLIsensor'] = { mid:"503",  name:"mLIsensor",  title:"使用人体感应灯",  easyness:"2",  refCons:"consLI",  titleShort:"人体感应灯", level:"",  figNum:"5",  lifeTime:"10",  price:"",  roanShow:"",  standardType:"電球",  subsidy :"",  advice:"住宅大门口的照明，和一直亮着灯相比，来人时亮灯的防范效果更好。而且开灯时间短，可以大幅减少耗电量。在走廊里也可以设置这样的人体感应灯，仅在人通过时亮灯，非常实用有效。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mLItime'] = { mid:"504",  name:"mLItime",  title:"减少开灯时间",  easyness:"3",  refCons:"consLI",  titleShort:"减少开灯时间", level:"",  figNum:"6",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"只要开灯就会耗电，所以勤关灯就可以节能。离开房间时随手关灯是好习惯。开着灯睡觉也容易影响睡眠，不利于身体健康。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mLIoff'] = { mid:"505",  name:"mLIoff",  title:"出门时关灯",  easyness:"4",  refCons:"consLI",  titleShort:"熄灯", level:"",  figNum:"6",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"离开房间时随手关灯，哪怕还会回来。毕竟只要开灯就会费电，所以随手关灯，举手之劳就可以更加节能。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mTVreplace'] = { mid:"601",  name:"mTVreplace",  title:"改为使用节能电视",  easyness:"2",  refCons:"consTV",  titleShort:"节能电视", level:"",  figNum:"7",  lifeTime:"10",  price:"4000",  roanShow:"",  standardType:"普及型",  subsidy :"",  advice:"最近电视机的节能性越来越高，同样尺寸的电视机，新产品的耗电量只有老产品的一半，购买时请尽量选择年均电费更低的产品。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mTVradio'] = { mid:"602",  name:"mTVradio",  title:"不用看电视而听收音机",  easyness:"1",  refCons:"consTVsum",  titleShort:"收音机", level:"",  figNum:"7",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"收音机的耗电量只有电视的1%～10%。如果你是因为无聊才开着电视的话，可以把一半时间换成收音机或CD机试试。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mTVtime'] = { mid:"603",  name:"mTVtime",  title:"缩短看电视时间",  easyness:"3",  refCons:"consTV",  titleShort:"缩短看电视时间", level:"",  figNum:"7",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"先想好要看哪个节目，看完后立刻关电视。一直开着电视，就会一个接一个节目的看下去。用电视机打游戏也容易玩很长时间，可以试试减少时间。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mTVbright'] = { mid:"604",  name:"mTVbright",  title:"将电视屏幕要调暗",  easyness:"2",  refCons:"consTV",  titleShort:"调节电视亮度", level:"",  figNum:"7",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"新出的电视机有调节屏幕亮度的功能。电视机在销售时一般屏幕会被调得很亮，直接放在家里用会过于刺眼，并且耗电量高。调暗屏幕可减少20%～40%的耗电量。有些新产品自带亮度感应器，可自动调节亮度。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mRFreplace'] = { mid:"701",  name:"mRFreplace",  title:"使用节能冰箱",  easyness:"2",  refCons:"consRF",  titleShort:"节能冰箱", level:"",  figNum:"2",  lifeTime:"10",  price:"15000",  roanShow:"",  standardType:"普及型",  subsidy :"",  advice:"与以前的冰箱相比，现在的节能型冰箱的耗电量只有过去的一半。购买时请选择一级能耗产品。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mRFstop'] = { mid:"702",  name:"mRFstop",  title:"停用另一个冰箱",  easyness:"2",  refCons:"consRF",  titleShort:"使用一个冰箱", level:"",  figNum:"2",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"如果你同时使用2台以上的冰箱，请停用1台。小型冰箱的耗电量和大型冰箱是差不多的。闲置在那里可能会让你感到可惜，但只要开着就会给环境带来负担，因此建议减少使用。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mRFwall'] = { mid:"703",  name:"mRFwall",  title:"从墙离开冰箱",  easyness:"4",  refCons:"consRF",  titleShort:"从墙离开冰箱", level:"",  figNum:"2",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"放置冰箱时一般要和墙壁间隔5厘米。因为冰箱需要从侧面或顶部散热，如果紧贴墙壁，不利于散热，还会增加10%的耗电量。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mRFtemplature'] = { mid:"704",  name:"mRFtemplature",  title:"冰箱内温度不要调太低",  easyness:"4",  refCons:"consRF",  titleShort:"调节冰箱温度", level:"",  figNum:"2",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"冰箱具有温控功能，从强到中，从中到弱，每调低1档都能减少约10%的耗电量。但食品腐败程度也会加快。如果没有太大问题，可以适当调节温度达到节能效果。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCRreplace'] = { mid:"801",  name:"mCRreplace",  title:"出了电动汽车以外，随着技术提高，",  easyness:"2",  refCons:"consCR",  titleShort:"节能车", level:"",  figNum:"21",  lifeTime:"8",  price:"180000",  roanShow:"",  standardType:"普及型",  subsidy :"",  advice:"除了混合动力汽车、电动汽车以外，随着技术进步，新上市的低燃油型汽车的耗油量仅为原来的的一半，推荐购买。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mCRreplaceElec'] = { mid:"802",  name:"mCRreplaceElec",  title:"改为使用电动汽车",  easyness:"1",  refCons:"consCR",  titleShort:"电动汽车", level:"",  figNum:"21",  lifeTime:"7",  price:"300000",  roanShow:"",  standardType:"",  subsidy :"",  advice:"电动汽车使用充电式电池存储电力，用发动机替代汽车引擎来驱动汽车，和汽车引擎相比效率高，实用性好。但目前充电站不够普及，充电时间长，因此推荐在夜间充电。",   lifestyle:"",   season:"wss"};
D6.scenario.defMeasures['mCRecoDrive'] = { mid:"803",  name:"mCRecoDrive",  title:"车子没有行进的情况下，熄火",  easyness:"3",  refCons:"consCRsum",  titleShort:"节能驾驶", level:"",  figNum:"21",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"等红绿灯时熄火节省燃油，平缓启动汽车，可减少10%的能耗。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCRtrain'] = { mid:"804",  name:"mCRtrain",  title:"使用地铁、公交车等公共交通",  easyness:"2",  refCons:"consCRtrip",  titleShort:"公共交通", level:"",  figNum:"22",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"如果只是2公里左右的短距离且天气状况好时，推荐骑自行车或步行前往，还有益于身体健康。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCR20percent'] = { mid:"805",  name:"mCR20percent",  title:"减少20%的汽车使用率",  easyness:"1",  refCons:"consCRtrip",  titleShort:"少开车", level:"",  figNum:"22",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"开车需要更多能耗，不是特别必须的情况下，建议减少用车。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mCRwalk'] = { mid:"806",  name:"mCRwalk",  title:"去附近不用开车，骑自行车或走路",  easyness:"2",  refCons:"consCRtrip",  titleShort:"骑车或走路", level:"",  figNum:"22",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"如果只是2公里左右的短距离且天气状况好时，推荐骑自行车或步行前往，还有益于身体健康。",   lifestyle:"1",   season:"wss"};
D6.scenario.defMeasures['mPTstopPlug'] = { mid:"901",  name:"mPTstopPlug",  title:"将插头从插座里拨下，减少待机电量",  easyness:"3",  refCons:"consTotal",  titleShort:"待机电量", level:"",  figNum:"20",  lifeTime:"",  price:"",  roanShow:"",  standardType:"",  subsidy :"",  advice:"电视机、录像机、空调等在不使用时也会耗电。特别是5年前的老产品，长时间不使用时可将插头从插座拨下。注意要先用遥控器关闭空调，确认叶片停止摆动后再拔出插头。新产品的待机耗电量和从前相比已经大幅降低，不太需要这样的操作。",   lifestyle:"1",   season:"wss"};

D6.scenario.defInput["i010"] = {  cons:"consTotal",  title:"作为对策重视的观点",  unit:"",  text:"优先考虑哪个因素？", inputType:"sel010", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"2",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel010"]= [ "请选择", "优先减少二氧化碳排放量", "优先省钱", "优先简单", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel010']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i001"] = {  cons:"consTotal",  title:"家庭人口",  unit:"人",  text:"您家一共几口人共同居住（包括您本人）", inputType:"sel001", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"2",d12t:"2",d12p:"1",d13t:"1",d13p:"0",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel001"]= [ "请选择", "1人", "2人", "3人", "4人", "5人", "6人", "7人", "8人", "9或更多的人", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel001']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '', '', '', '', '' ];
D6.scenario.defInput["i002"] = {  cons:"consTotal",  title:"房屋种类",  unit:"",  text:"您家是小区楼房还是独栋建筑？", inputType:"sel002", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"2",d11p:"2",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel002"]= [ "请选择", "独栋建筑", "小区楼房", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel002']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i003"] = {  cons:"consTotal",  title:"房屋面积",  unit:"m2",  text:"您家的面积多大？请选择最接近的值。", inputType:"sel003", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"150",d11p:"0",d12t:"100",d12p:"1",d13t:"0",d13p:"2",d1w:"3",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel003"]= [ "请选择", "15平方米", "30平方米", "50平方米", "70平方米", "100平方米", "120平方米", "150平方米", "200平方米以上", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel003']= [ '-1', '15', '30', '50', '70', '100', '120', '150', '220', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i004"] = {  cons:"consTotal",  title:"拥有房屋",  unit:"",  text:"您家是自己的房屋还是租房？", inputType:"sel004", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel004"]= [ "请选择", "自己的房屋", "租房", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel004']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i005"] = {  cons:"consTotal",  title:"楼层数",  unit:"",  text:"您家一共几层？如果是楼房，您住几层？", inputType:"sel005", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel005"]= [ "请选择", "一楼", "二楼", "三楼以上", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel005']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i006"] = {  cons:"consTotal",  title:"顶楼",  unit:"",  text:"您家是在最顶层吗？", inputType:"sel006", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel006"]= [ "请选择", "是", "否", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel006']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i007"] = {  cons:"consTotal",  title:"向阳",  unit:"",  text:"阳光朝向好不好？", inputType:"sel007", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"3",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel007"]= [ "请选择", "非常好", "很好", "有时不太好", "不好", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel007']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i008"] = {  cons:"consTotal",  title:"房间数",  unit:"部屋",  text:"您家共有几个房间？", inputType:"sel008", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"8",d11p:"0",d12t:"5",d12p:"1",d13t:"1",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel008"]= [ "请选择", "1个", "2个", "3个", "4个", "5个", "6个", "7个", "8个以上", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel008']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i009"] = {  cons:"consTotal",  title:"建造年数",  unit:"年",  text:"您家房屋的建筑年代？", inputType:"sel009", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel009"]= [ "请选择", "不到5年", "5 - 10年", "10 - 20年", "20年以上", "我不知道", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel009']= [ '-1', '3', '7', '13', '30', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i021"] = {  cons:"consTotal",  title:"省份",  unit:"",  text:"请选择您所在的省份。", inputType:"sel021", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue[""]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i022"] = {  cons:"consTotal",  title:"#",  unit:"",  text:"", inputType:"sel022", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue[""]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i023"] = {  cons:"consTotal",  title:"城区还是郊区",  unit:"",  text:"您家附近交通方便吗？", inputType:"sel023", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel023"]= [ "请选择", "很方便", "还可以", "不太方便", "不方便", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel023']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i041"] = {  cons:"consTotal",  title:"窗户隔热性",  unit:"",  text:"您家窗户的隔热性能怎么样？", inputType:"sel041", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"5",d21p:"0",d22t:"4",d22p:"1",d23t:"0",d23p:"2",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel041"]= [ "请选择", "树脂窗框与三层玻璃窗", "树脂窗框与low-E玻璃窗", "树脂（铝合成）窗框与两层玻璃窗", "铝窗框与两层玻璃窗", "铝窗框与单层玻璃窗", "我不知道", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel041']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i042"] = {  cons:"consTotal",  title:"墙隔热性",  unit:"",  text:"您家的墙面隔热材料有多少厚度？", inputType:"sel042", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"100",d11p:"2",d12t:"50",d12p:"1",d13t:"",d13p:"",d1w:"2",d1d:"1", d21t:"100",d21p:"2",d22t:"50",d22p:"1",d23t:"",d23p:"",d2w:"3",d2d:"1", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel042"]= [ "请选择", "墙含有玻璃棉200毫米", "墙含有玻璃棉150毫米", "墙含有玻璃棉100毫米", "墙含有玻璃棉50毫米", "墙含有玻璃棉30毫米", "墙没含有玻璃棉", "我不知道", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel042']= [ '-1', '200', '150', '100', '50', '30', '10', '-1', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i043"] = {  cons:"consTotal",  title:"窗隔热装修",  unit:"",  text:"您家做过窗户隔热改造吗？", inputType:"sel043", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"1",d21p:"2",d22t:"2",d22p:"1",d23t:"",d23p:"",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel043"]= [ "请选择", "已全部实施", "部分实施", "未实施", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel043']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i044"] = {  cons:"consTotal",  title:"墙隔热装修",  unit:"",  text:"您做过墙、顶棚、地板的隔热改造吗？", inputType:"sel044", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"1",d21p:"2",d22t:"2",d22p:"1",d23t:"",d23p:"",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel044"]= [ "请选择", "已全部实施", "部分实施", "未实施", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel044']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i051"] = {  cons:"consEnergy",  title:"安装太阳能",  unit:"",  text:"您家安装太阳能发电设备了吗？", inputType:"sel051", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"1",d11p:"2",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"4",d1d:"0", d21t:"1",d21p:"2",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"4",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel051"]= [ "请选择", "否", "是", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel051']= [ '-1', '0', '1', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i052"] = {  cons:"consEnergy",  title:"太阳能的大小",  unit:"kW",  text:"请选择您家的太阳能发电设备的功率。", inputType:"sel052", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"5",d11p:"2",d12t:"2",d12p:"1",d13t:"",d13p:"",d1w:"2",d1d:"0", d21t:"5",d21p:"2",d22t:"2",d22p:"1",d23t:"",d23p:"",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel052"]= [ "请选择", "未安装", "〜3千瓦", "～4千瓦", "～5千瓦", "6〜10千瓦", "超过10千瓦", "", "", "", " ", "", "", "", "", "" ];			D6.scenario.defSelectData['sel052']= [ '-1', '0', '3', '4', '5', '8', '11', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i053"] = {  cons:"consEnergy",  title:"太阳能安装年数",  unit:"",  text:"您何时安装的太阳能发电器？", inputType:"sel053", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel053"]= [ "请选择", "2010年以前", "2011-2012年", "2013年", "2014年", "2015年", "2016年", "2017年以后", "我家没安装", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel053']= [ '-1', '2010', '2011', '2013', '2014', '2015', '2016', '2017', '9999', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i054"] = {  cons:"consEnergy",  title:"您是否用煤油",  unit:"",  text:"您家是否使用煤油？", inputType:"sel054", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel054"]= [ "请选择", "是", "否", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel054']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i061"] = {  cons:"consEnergy",  title:"电费",  unit:"円",  text:"请选择每个月的大概电费。", inputType:"sel061", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"15000",d11p:"0",d12t:"10000",d12p:"1",d13t:"0",d13p:"2",d1w:"3",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel061"]= [ "请选择", "100元以内", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "", "" ];			D6.scenario.defSelectData['sel061']= [ '-1', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '', '' ];
D6.scenario.defInput["i062"] = {  cons:"consEnergy",  title:"#电力销售费用",  unit:"円",  text:"您每个月可以卖多少太阳能发电过的电量？", inputType:"sel062", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel062"]= [ "请选择", "100元", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "", "" ];			D6.scenario.defSelectData['sel062']= [ '-1', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '', '' ];
D6.scenario.defInput["i063"] = {  cons:"consEnergy",  title:"煤气费",  unit:"円",  text:"请选择每个月的大概煤气费。", inputType:"sel063", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"10000",d11p:"0",d12t:"6000",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel063"]= [ "请选择", "不使用", "100元以内", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "" ];			D6.scenario.defSelectData['sel063']= [ '-1', '0', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '' ];
D6.scenario.defInput["i064"] = {  cons:"consEnergy",  title:"#煤油费",  unit:"円",  text:"请选择每个月的大概煤油费。", inputType:"sel064", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"10000",d11p:"0",d12t:"6000",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel064"]= [ "请选择", "不使用", "100元", "150元", "200元", "300元", "500元", "700元", "1000元", "1500元", "更多", "", "", "", "", "" ];			D6.scenario.defSelectData['sel064']= [ '-1', '0', '100', '150', '200', '300', '500', '700', '1000', '1500', '2000', '', '', '', '', '' ];
D6.scenario.defInput["i065"] = {  cons:"consEnergy",  title:"#煤球费",  unit:"円",  text:"请选择每月大概煤球费。", inputType:"sel065", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"10000",d11p:"0",d12t:"6000",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel065"]= [ "请选择", "不使用", "100元", "150元", "200元", "300元", "500元", "700元", "1000元", "1500元", "更多", "", "", "", "", "" ];			D6.scenario.defSelectData['sel065']= [ '-1', '0', '100', '150', '200', '300', '500', '700', '1000', '1500', '2000', '', '', '', '', '' ];
D6.scenario.defInput["i066"] = {  cons:"consEnergy",  title:"#区供热的使用",  unit:"円",  text:"是否使用区域供暖", inputType:"sel066", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"10000",d11p:"0",d12t:"6000",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel066"]= [ "请选择", "不使用", "使用", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel066']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i072"] = {  cons:"consEnergy",  title:"#",  unit:"",  text:"", inputType:"sel072", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel072"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel072']= [ '-1', '100', '200', '300', '400', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i073"] = {  cons:"consEnergy",  title:"#",  unit:"",  text:"", inputType:"sel073", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel073"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel073']= [ '-1', '3', '5', '8', '12', '18', '24', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i074"] = {  cons:"consEnergy",  title:"水费",  unit:"円",  text:"请选择每个月的大概水费。", inputType:"sel074", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel074"]= [ "请选择", "40元以内", "70元", "100元", "150元", "200元", "250元", "300元", "500元", "700元", "1000元", "更多", "", "", "", "" ];			D6.scenario.defSelectData['sel074']= [ '-1', '40', '70', '100', '150', '200', '250', '300', '500', '700', '1000', '1500', '', '', '', '' ];
D6.scenario.defInput["i075"] = {  cons:"consEnergy",  title:"车油费",  unit:"円",  text:"选择的约一个月的汽油费（轻质汽油）。", inputType:"sel075", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"10000",d11p:"0",d12t:"6000",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel075"]= [ "请选择", "不使用", "100元", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "" ];			D6.scenario.defSelectData['sel075']= [ '-1', '0', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '' ];
D6.scenario.defInput["i081"] = {  cons:"consEnergy",  title:"#",  unit:"",  text:"", inputType:"sel081", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel081"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel081']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '', '', '', '' ];
D6.scenario.defInput["i082"] = {  cons:"consEnergy",  title:"#电合同",  unit:"",  text:"", inputType:"sel082", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel082"]= [ "请选择", "普通家用（收费）", "每个时区合同", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel082']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i083"] = {  cons:"consEnergy",  title:"#气体类型",  unit:"",  text:"", inputType:"sel083", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel083"]= [ "请选择", "城市燃气", "液化石油气", "不使用燃气", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel083']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i091"] = {  cons:"consSeason",  title:"电费",  unit:"円",  text:"请选择每个月的大概电费。", inputType:"sel091", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel091"]= [ "请选择", "100元以内", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "", "" ];			D6.scenario.defSelectData['sel091']= [ '-1', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '', '' ];
D6.scenario.defInput["i092"] = {  cons:"consSeason",  title:"#电力销售费用",  unit:"円",  text:"", inputType:"sel092", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel092"]= [ "请选择", "100元", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "", "" ];			D6.scenario.defSelectData['sel092']= [ '-1', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '', '' ];
D6.scenario.defInput["i093"] = {  cons:"consSeason",  title:"煤气费",  unit:"円",  text:"请选择每个月的大概煤气费。", inputType:"sel093", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel093"]= [ "请选择", "不使用", "100元以内", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "2000元", "更多", "", "", "" ];			D6.scenario.defSelectData['sel093']= [ '-1', '0', '100', '150', '200', '300', '500', '700', '800', '1000', '1500', '2000', '3000', '', '', '' ];
D6.scenario.defInput["i094"] = {  cons:"consSeason",  title:"#煤球购买量",  unit:"円",  text:"", inputType:"sel094", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel094"]= [ "请选择", "不使用", "100元", "150元", "200元", "300元", "500元", "700元", "800元", "1000元", "1500元", "更多", "", "", "", "" ];			D6.scenario.defSelectData['sel094']= [ '-1', '0', '100', '150', '200', '300', '500', '700', '1000', '1500', '2000', '', '', '', '', '' ];
D6.scenario.defInput["i101"] = {  cons:"consHWsum",  title:"热水器的类型",  unit:"",  text:"请选择您家的热水器类型。", inputType:"sel101", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"6",d21p:"2",d22t:"3",d22p:"0",d23t:"2",d23p:"1",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel101"]= [ "请选择", "燃气热水器", "煤气潜热回收型", "煤油热水器", "煤油潜热回收型", "电热水器", "电动热泵", "热电联产", "燃料电池", "木柴", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel101']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '', '', '', '', '' ];
D6.scenario.defInput["i102"] = {  cons:"consHWsum",  title:"太阳能热水器",  unit:"",  text:"您家是否使用太阳能热水器？", inputType:"sel102", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"1",d12p:"2",d13t:"",d13p:"",d1w:"2",d1d:"0", d21t:"3",d21p:"0",d22t:"1",d22p:"2",d23t:"",d23p:"",d2w:"2",d2d:"0", d31t:"3",d31p:"0",d32t:"1",d32p:"2",d33t:"",d33p:"",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel102"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel102']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i103"] = {  cons:"consHWtub",  title:"#",  unit:"日/週",  text:"", inputType:"sel103", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"5",d31p:"0",d32t:"2",d32p:"1",d33t:"0",d33p:"2",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel103"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel103']= [ '-1', '0', '1', '2', '3.5', '5.5', '7', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i104"] = {  cons:"consHWtub",  title:"#",  unit:"日/週",  text:"", inputType:"sel104", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"5",d31p:"0",d32t:"2",d32p:"1",d33t:"0",d33p:"2",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel104"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel104']= [ '-1', '0', '1', '2', '3.5', '5.5', '7', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i105"] = {  cons:"consHWshower",  title:"淋浴时间（夏季除外）",  unit:"分/日",  text:"您家所有人一天内的淋浴时间一共是多少。（夏季除外）", inputType:"sel105", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"40",d11p:"0",d12t:"20",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"0", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"40",d31p:"0",d32t:"20",d32p:"1",d33t:"0",d33p:"2",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel105"]= [ "请选择", "不使用", "5分钟", "10分钟", "15分钟", "20分钟", "30分钟", "40分钟", "60分钟", "90分钟", "120分钟", "", "", "", "", "" ];			D6.scenario.defSelectData['sel105']= [ '-1', '0', '5', '10', '15', '20', '30', '40', '60', '90', '120', '', '', '', '', '' ];
D6.scenario.defInput["i106"] = {  cons:"consHWshower",  title:"淋浴时间（夏季）",  unit:"分/日",  text:"您家所有人一天内的淋浴时间一共是多少。（夏季）", inputType:"sel106", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"40",d11p:"0",d12t:"20",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"0", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"40",d31p:"0",d32t:"20",d32p:"1",d33t:"0",d33p:"2",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel106"]= [ "请选择", "不使用", "5分钟", "10分钟", "15分钟", "20分钟", "30分钟", "40分钟", "60分钟", "90分钟", "120分钟", "", "", "", "", "" ];			D6.scenario.defSelectData['sel106']= [ '-1', '0', '5', '10', '15', '20', '30', '40', '60', '90', '120', '', '', '', '', '' ];
D6.scenario.defInput["i107"] = {  cons:"consHWtub",  title:"#",  unit:"",  text:"", inputType:"sel107", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"8",d31p:"0",d32t:"0",d32p:"2",d33t:"",d33p:"",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel107"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel107']= [ '-1', '8', '4', '0', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i108"] = {  cons:"consHWtub",  title:"#",  unit:"時間",  text:"", inputType:"sel108", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"10",d31p:"0",d32t:"4",d32p:"1",d33t:"0",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel108"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel108']= [ '-1', '0', '3', '6', '10', '16', '24', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i109"] = {  cons:"consHWtub",  title:"#",  unit:"",  text:"", inputType:"sel109", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel109"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel109']= [ '-1', '10', '5', '2', '0', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i110"] = {  cons:"consHWtub",  title:"#",  unit:"割",  text:"", inputType:"sel110", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"10",d31p:"0",d32t:"0",d32p:"2",d33t:"",d33p:"",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel110"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel110']= [ '-1', '10', '5', '5', '0', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i111"] = {  cons:"consHWtub",  title:"#",  unit:"割",  text:"", inputType:"sel111", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel111"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel111']= [ '-1', '10', '5', '0', '5', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i112"] = {  cons:"consHWshower",  title:"花洒需要多久热水出来",  unit:"秒",  text:"您家的花洒打开后需要多长时间出热水？", inputType:"sel112", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"20",d21p:"0",d22t:"10",d22p:"1",d23t:"0",d23p:"2",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel112"]= [ "请选择", "立即出来热水", "等待约5秒", "等待约10秒", "等待约20秒", "等待一分钟弱", "我不知道", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel112']= [ '-1', '3', '5', '10', '20', '50', '20', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i113"] = {  cons:"consHWdishwash",  title:"洗碗时是否使用热水",  unit:"",  text:"您洗碗时会直接用凉水而不是热水吗？", inputType:"sel113", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel113"]= [ "请选择", "平常使用水", "大概使用水", "有时使用水", "平时不使用水", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel113']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i114"] = {  cons:"consHWdresser",  title:"一年中多久使用热水洗脸",  unit:"ヶ月",  text:"您一年中几个月需要用热水洗脸？", inputType:"sel114", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"5",d31p:"0",d32t:"0",d32p:"2",d33t:"",d33p:"",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel114"]= [ "请选择", "不用热水洗脸", "2个月", "4个月", "6个月", "8个月", "10个月", "12个月", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel114']= [ '-1', '0', '2', '4', '6', '8', '10', '12', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i115"] = {  cons:"consHWdishwash",  title:"一年中多久使用热水碗",  unit:"ヶ月",  text:"您一年中有几个月需要用热水洗碗？", inputType:"sel115", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel115"]= [ "请选择", "不用热水洗碗", "使用洗碗机", "2个月", "4个月", "6个月", "8个月", "10个月", "12个月", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel115']= [ '-1', '0', '99', '2', '4', '6', '8', '10', '12', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i116"] = {  cons:"consHWshower",  title:"节水花洒",  unit:"",  text:"您的淋浴花洒是否为节水型花洒？", inputType:"sel116", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"2",d21p:"0",d22t:"1",d22p:"2",d23t:"",d23p:"",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel116"]= [ "请选择", "是", "否", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel116']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i117"] = {  cons:"consHWtub",  title:"#",  unit:"",  text:"", inputType:"sel117", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"0",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel117"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel117']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i131"] = {  cons:"consHWtoilet",  title:"#",  unit:"",  text:"", inputType:"sel131", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"4",d31p:"2",d32t:"2",d32p:"1",d33t:"1",d33p:"0",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel131"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel131']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i132"] = {  cons:"consHWtoilet",  title:"#",  unit:"",  text:"", inputType:"sel132", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"4",d31p:"0",d32t:"3",d32p:"1",d33t:"2",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel132"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel132']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i133"] = {  cons:"consHWtoilet",  title:"#",  unit:"",  text:"", inputType:"sel133", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel133"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel133']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i134"] = {  cons:"consHWtoilet",  title:"#",  unit:"",  text:"", inputType:"sel134", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"2",d31p:"0",d32t:"1",d32p:"2",d33t:"",d33p:"1",d3w:"1",d3d:""}; 			D6.scenario.defSelectValue["sel134"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel134']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i201"] = {  cons:"consHTsum",  title:"取暖范围",  unit:"",  text:"您家的取暖范围大概是多少？", inputType:"sel201", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"1",d11p:"0",d12t:"0.5",d12p:"1",d13t:"0",d13p:"2",d1w:"1",d1d:"0", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel201"]= [ "请选择", "全屋", "一半左右", "一部分", "不取暖", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel201']= [ '-1', '1', '0.5', '0.25', '0.1', '0.02', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i202"] = {  cons:"consHTsum",  title:"主要使用的取暖器",  unit:"",  text:"您家最常使用的取暖方式是什么？如果地板采暖，请选择热源。", inputType:"sel202", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"6",d11p:"0",d12t:"5",d12p:"2",d13t:"",d13p:"",d1w:"2",d1d:"0", d21t:"6",d21p:"0",d22t:"5",d22p:"2",d23t:"",d23p:"",d2w:"2",d2d:"0", d31t:"5",d31p:"2",d32t:"2",d32p:"0",d33t:"1",d33p:"1",d3w:"2",d3d:"0"}; 			D6.scenario.defSelectValue["sel202"]= [ "请选择", "空调", "电子", "煤气", "燃油", "木柴", "区域供热", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel202']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i203"] = {  cons:"consHTsum",  title:"辅助取暖方式",  unit:"",  text:"您家的辅助取暖方式是什么？", inputType:"sel203", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel203"]= [ "请选择", "空调", "电子", "煤气", "燃油", "木柴", "区域供热", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel203']= [ '-1', '0', '18', '19', '20', '21', '22', '23', '24', '25', '26', '', '', '', '', '' ];
D6.scenario.defInput["i204"] = {  cons:"consHTsum",  title:"取暖时长",  unit:"時間",  text:"冬季一天的取暖时间有多少？", inputType:"sel204", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"24",d11p:"0",d12t:"0",d12p:"2",d13t:"",d13p:"",d1w:"2",d1d:"0", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel204"]= [ "请选择", "不取暖", "1小时", "2小时", "3小时", "4小时", "6时间", "8时间", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel204']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '', '', '', '', '' ];
D6.scenario.defInput["i205"] = {  cons:"consHTsum",  title:"取暖温度",  unit:"℃",  text:"您家取暖时的温度设置是多少？如果无法调节，感觉大概达到了多少度？", inputType:"sel205", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"23",d11p:"0",d12t:"21",d12p:"1",d13t:"0",d13p:"2",d1w:"3",d1d:"0", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"23",d31p:"0",d32t:"21",d32p:"1",d33t:"0",d33p:"2",d3w:"3",d3d:"0"}; 			D6.scenario.defSelectValue["sel205"]= [ "请选择", "不取暖", "18℃", "19℃", "20℃", "21℃", "22℃", "23℃", "24℃", "25℃", "26℃以上", "", "", "", "", "" ];			D6.scenario.defSelectData['sel205']= [ '-1', '0', '18', '19', '20', '21', '22', '23', '24', '25', '26', '', '', '', '', '' ];
D6.scenario.defInput["i206"] = {  cons:"consHTsum",  title:"一年中多久取暖",  unit:"ヶ月",  text:"您家一年中有几个月需要取暖？", inputType:"sel206", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel206"]= [ "请选择", "不取暖", "1个月", "3个月", "3个月", "6个月", "6个月", "6个月", "11个月", "12个月", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel206']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '8', '10', '', '', '', '', '', '' ];
D6.scenario.defInput["i211"] = {  cons:"consACheat",  title:"#房间的名称",  unit:"",  text:"", inputType:"", right:"", postfix:"", nodata:"", varType:"String", min:"", max:"", defaultValue:"", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue[""]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i212"] = {  cons:"consACheat",  title:"房间面积",  unit:"m2",  text:"请选择多大的房间开一个空调？如果房屋内部有楼梯结构，请加2倍。", inputType:"sel212", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel212"]= [ "请选择", "10平米", "12平米", "14平米", "18平米", "20平米", "25平米", "30平米", "40平米", "50平米", "60平米以上", "", "", "", "", "" ];			D6.scenario.defSelectData['sel212']= [ '-1', '7.3', '10', '13', '16', '19.5', '24', '33', '41', '49', '65', '', '', '', '', '' ];
D6.scenario.defInput["i213"] = {  cons:"consACheat",  title:"玻璃窗尺寸",  unit:"m2",  text:"您家一个房间内的窗户面积有多少？", inputType:"sel213", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel213"]= [ "请选择", "一个小窗户（90cm×120cm）", "一个小窗户（120cm×180cm）", "2个落地式窗户（180cm×180cm）", "4个落地式窗户（180cm×360cm）", "6个落地式窗户（180cm×540cm）", "8个落地式窗户（180cm×720cm）", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel213']= [ '-1', '1.1', '2.2', '3.3', '6.5', '9.7', '13', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i214"] = {  cons:"consACheat",  title:"玻璃窗类型",  unit:"w/m2K",  text:"请选择您家窗户的类型。", inputType:"sel214", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"4",d21p:"2",d22t:"3",d22p:"1",d23t:"",d23p:"",d2w:"1",d2d:"1", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel214"]= [ "请选择", "单层玻璃窗户", "铝制窗框多层玻璃", "非铝窗框多层玻璃窗户", "双层窗户", "low-E多层玻璃", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel214']= [ '-1', '6', '3.5', '2.5', '2.5', '1.5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i215"] = {  cons:"consACcool",  title:"空调使用年数",  unit:"年",  text:"您家的空调已经使用了多少年？", inputType:"sel215", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel215"]= [ "请选择", "未装空调", "不到一年", "1年到3年", "3年到5年", "5年到7年", "7年到10年", "10年到15年", "15年到20年", "20年以上", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel215']= [ '-1', '0', '1', '2', '4', '6', '9', '13', '18', '25', '', '', '', '', '', '' ];
D6.scenario.defInput["i216"] = {  cons:"consACcool",  title:"空调性能",  unit:"",  text:"您购买的是节能型空调吗？", inputType:"sel216", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"2",d11p:"0",d12t:"1",d12p:"2",d13t:"",d13p:"",d1w:"2",d1d:"0", d21t:"2",d21p:"0",d22t:"1",d22p:"2",d23t:"",d23p:"",d2w:"2",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel216"]= [ "请选择", "是", "否", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel216']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i217"] = {  cons:"consACcool",  title:"空调过滤器清洗",  unit:"",  text:"您平时打扫空调过滤器吗？", inputType:"sel217", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"2",d31p:"0",d32t:"1",d32p:"2",d33t:"",d33p:"",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel217"]= [ "请选择", "是", "否", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel217']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i231"] = {  cons:"consACheat",  title:"主要使用的取暖器",  unit:"",  text:"您家最使用的取暖方式是什么？如果地板采暖，请选择热源。", inputType:"sel231", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel231"]= [ "请选择", "空调", "电子", "煤气", "燃油", "木柴", "区域供热", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel231']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i232"] = {  cons:"consACheat",  title:"辅助取暖方式",  unit:"",  text:"您家的辅助取暖方式是什么？", inputType:"sel232", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel232"]= [ "请选择", "空调", "电子", "煤气", "燃油", "木柴", "区域供热", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel232']= [ '-1', '0', '18', '19', '20', '21', '22', '23', '24', '25', '26', '', '', '', '', '' ];
D6.scenario.defInput["i233"] = {  cons:"consACheat",  title:"空调取暖时间",  unit:"時間",  text:"冬季您家一天的取暖时间有多少？", inputType:"sel233", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel233"]= [ "请选择", "不使用", "1小时", "2小时", "3小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel233']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '', '', '', '', '' ];
D6.scenario.defInput["i234"] = {  cons:"consACheat",  title:"空调取暖温度",  unit:"℃",  text:"空调取暖时的温度设置是多少？如果无法设置温度，感觉大概达到了多少度？", inputType:"sel234", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel234"]= [ "请选择", "不使用", "18℃", "19℃", "20℃", "21℃", "22℃", "23℃", "24℃", "25℃", "26℃以上", "", "", "", "", "" ];			D6.scenario.defSelectData['sel234']= [ '-1', '0', '18', '19', '20', '21', '22', '23', '24', '25', '26', '', '', '', '', '' ];
D6.scenario.defInput["i235"] = {  cons:"consACheat",  title:"一年中多久使用空调取暖",  unit:"ヶ月",  text:"您家一年开多长时间空调取暖？", inputType:"sel235", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel235"]= [ "请选择", "不使用", "1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "8个月", "10个月", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel235']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '8', '10', '', '', '', '', '', '' ];
D6.scenario.defInput["i236"] = {  cons:"consACheat",  title:"一年中多久使用加湿器",  unit:"ヶ月",  text:"您家一年使用多长时间加湿器？", inputType:"sel236", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel236"]= [ "请选择", "不使用加湿器", "1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel236']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i237"] = {  cons:"consACheat",  title:"隔热材料",  unit:"",  text:"您家冬季会使用厚窗帘或隔热材料吗？", inputType:"sel237", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel237"]= [ "请选择", "是", "否", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel237']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i238"] = {  cons:"consACheat",  title:"房间门是否可以关上",  unit:"",  text:"您家房间的门可以关上吗？", inputType:"sel238", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel238"]= [ "请选择", "是", "否", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel238']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i239"] = {  cons:"consACheat",  title:"#房间是否通顶设计",  unit:"",  text:"", inputType:"sel239", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel239"]= [ "请选择", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel239']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i240"] = {  cons:"consACheat",  title:"#",  unit:"",  text:"", inputType:"sel240", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel240"]= [ "请选择", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel240']= [ '-1', '0', '2', '3', '5', '7', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i241"] = {  cons:"consACheat",  title:"取暖电炉的使用时间",  unit:"",  text:"您家一天内使用电炉或油汀取暖器的时间有多少？", inputType:"sel241", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel241"]= [ "请选择", "不使用", "1小时", "2小时", "3小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel241']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '', '', '', '', '' ];
D6.scenario.defInput["i242"] = {  cons:"consACheat",  title:"房间寒冷程度",  unit:"",  text:"您家取暖时感觉房间温暖吗？", inputType:"sel242", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel242"]= [ "请选择", "很暖和", "比较暖和", "有点儿冷", "很冷", "不需要取暖", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel242']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i243"] = {  cons:"consHTsum",  title:"窗户是否有结露",  unit:"",  text:"您家窗户发生结露吗？", inputType:"sel243", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel243"]= [ "请选择", "平常发生", "有时发生", "很少发生", "不发生", "我不知道", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel243']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i244"] = {  cons:"consHTsum",  title:"墙是否有结露",  unit:"",  text:"您家墙面发生结露吗？", inputType:"sel244", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel244"]= [ "请选择", "平常发生", "有时发生", "很少发生", "不发生", "我不知道", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel244']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i245"] = {  cons:"consHTsum",  title:"早上寒冷程度",  unit:"ヶ月",  text:"出现以下哪种情况时您觉得最冷？", inputType:"sel245", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel245"]= [ "请选择", "因为冷，早上醒不过来", "手与脚特别凉", "看到窗户有霜", "在房间呼出的气变成白雾", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel245']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i246"] = {  cons:"consHTsum",  title:"早上开始降温的季节",  unit:"",  text:"您觉得从何时开始能感觉到早上的寒冷？", inputType:"sel246", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel246"]= [ "请选择", "10月上旬", "10月下旬", "11月上旬", "11月下旬", "12月上旬", "12月下旬", "1月上旬", "1月下旬", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel246']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i247"] = {  cons:"consHTsum",  title:"早上结束降温的季节",  unit:"",  text:"您觉得早上的寒冷感到何时结束？", inputType:"sel247", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel247"]= [ "请选择", "2月上旬", "2月下旬", "3月上旬", "3月下旬", "4月上旬", "4月下旬", "5月上旬", "5月下旬", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel247']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i248"] = {  cons:"consHTsum",  title:"是否多穿衣服",  unit:"",  text:"您使用空调前是否会考虑先多穿衣服？", inputType:"sel248", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel248"]= [ "请选择", "平常", "有时", "偶尔", "完全不", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel248']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i249"] = {  cons:"consHTsum",  title:"无人房间的空调",  unit:"",  text:"您会关闭无人房间的空调吗", inputType:"sel249", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"4",d11p:"2",d12t:"3",d12p:"1",d13t:"",d13p:"",d1w:"1",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"4",d31p:"2",d32t:"3",d32p:"1",d33t:"",d33p:"",d3w:"2",d3d:"1"}; 			D6.scenario.defSelectValue["sel249"]= [ "请选择", "平常", "有时", "偶尔", "完全不", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel249']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i261"] = {  cons:"consCOsum",  title:"空调制冷时间",  unit:"時間",  text:"夏季您家一天内的空调制冷时间是多少？", inputType:"sel261", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"24",d31p:"0",d32t:"8",d32p:"1",d33t:"",d33p:"",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel261"]= [ "请选择", "不使用", "1小时", "2小时", "3小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel261']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '', '', '', '', '' ];
D6.scenario.defInput["i262"] = {  cons:"consCOsum",  title:"空调制冷的时区",  unit:"",  text:"使用空调的主要时间段是？", inputType:"sel262", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel262"]= [ "请选择", "不使用", "早上", "白天", "傍晚", "晚上", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel262']= [ '-1', '0', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i263"] = {  cons:"consCOsum",  title:"空调制冷温度",  unit:"℃",  text:"夏季空调的设置温度是？", inputType:"sel263", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"28",d11p:"2",d12t:"25",d12p:"1",d13t:"",d13p:"",d1w:"1",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"28",d31p:"2",d32t:"25",d32p:"1",d33t:"",d33p:"",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel263"]= [ "请选择", "24℃以下", "25℃", "26℃", "27℃", "28℃", "29℃", "30℃", "不使用", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel263']= [ '-1', '24', '25', '26', '27', '28', '29', '30', '0', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i264"] = {  cons:"consCOsum",  title:"一年中多久使用空调制冷（包含除湿功能）",  unit:"ヶ月",  text:"您家一年中需要几个月的空调制冷？（包括除湿）", inputType:"sel264", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel264"]= [ "请选择", "不使用", "1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel264']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i265"] = {  cons:"consCOsum",  title:"房间的热暑热程度",  unit:"",  text:"空调制冷时，感觉房间很热吗？", inputType:"sel265", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel265"]= [ "请选择", "凉快", "有点儿热", "开空调也有点儿热", "开空调也热", "不使用空调", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel265']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i266"] = {  cons:"consCOsum",  title:"是否照进房间",  unit:"",  text:"夏季的早晚时分否有阳光照进房间？", inputType:"sel266", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel266"]= [ "请选择", "照得多", "照得有点儿多", "照不进房间里", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel266']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i267"] = {  cons:"consCOsum",  title:"遮挡阳光照射",  unit:"",  text:"早晚时分如果有阳光照进房屋，房间温度会上升。您是否会采取措施防止阳光进入？", inputType:"sel267", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"4",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"4",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel267"]= [ "请选择", "平时做", "有时做", "很少做", "不做", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel267']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i268"] = {  cons:"consCOsum",  title:"是否使用电扇",  unit:"",  text:"您会尽量多用电扇少开空调吗？", inputType:"sel268", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"4",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel268"]= [ "请选择", "平时", "有时", "必很少", "不", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel268']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i271"] = {  cons:"consACcool",  title:"电扇冷却时间",  unit:"時間",  text:"夏季您家一天开几小时空调？", inputType:"sel271", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"10",d31p:"0",d32t:"4",d32p:"1",d33t:"0",d33p:"2",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel271"]= [ "请选择", "不使用", "1小时", "2小时", "3小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel271']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '', '', '', '', '' ];
D6.scenario.defInput["i272"] = {  cons:"consACcool",  title:"使用电扇的时区",  unit:"",  text:"使用空调的主要时间段是？", inputType:"sel272", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel272"]= [ "请选择", "不使用", "1小时", "2小时", "3小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel272']= [ '-1', '0', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i273"] = {  cons:"consACcool",  title:"制冷温度",  unit:"℃",  text:"您家开空调制冷时，温度会调到几度？", inputType:"sel273", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel273"]= [ "请选择", "24℃以下", "25℃", "26℃", "27℃", "28℃", "29℃", "30℃", "不使用", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel273']= [ '-1', '24', '25', '26', '27', '28', '29', '30', '0', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i274"] = {  cons:"consACcool",  title:"一年中多久制冷",  unit:"ヶ月",  text:"您家一年中需要几个月的空调制冷？（包括除湿）", inputType:"sel274", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel274"]= [ "请选择", "不使用空调制冷", "1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel274']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i275"] = {  cons:"consACcool",  title:"房间的暑热程度",  unit:"",  text:"您觉得房间热吗？", inputType:"sel275", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel275"]= [ "请选择", "当冷却热并不感到", "有点热", "如果很酷注", "即使冷却热", "空调不", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel275']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i276"] = {  cons:"consACcool",  title:"是否照进房间",  unit:"",  text:"夏季早上或傍晚是否照进房间？", inputType:"sel276", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel276"]= [ "请选择", "照得多", "照得有点儿多", "照不进房间里", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel276']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i277"] = {  cons:"consACcool",  title:"遮挡阳光照射",  unit:"",  text:"早晚时分如果有阳光照进房屋，房间温度会上升。您是否会采取措施防止阳光进入？", inputType:"sel277", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel277"]= [ "请选择", "平时做", "有时做", "很少做", "不做", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel277']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i278"] = {  cons:"consACcool",  title:"是否使用电扇",  unit:"",  text:"您会尽量多用电扇少开空调吗？", inputType:"sel278", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel278"]= [ "请选择", "平时", "有时", "必很少", "不", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel278']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i281"] = {  cons:"consHTcold",  title:"集中供暖",  unit:"",  text:"您家是集中供暖吗？", inputType:"sel281", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel281"]= [ "请选择", "是", "否", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel281']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i282"] = {  cons:"consHTcold",  title:"集中供暖的热源",  unit:"",  text:"您家集中供暖的热源是什么？", inputType:"sel282", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel282"]= [ "请选择", "煤油", "电气", "电气（热泵）", "煤气+热泵", "区域供热", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel282']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i283"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel283", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel283"]= [ "请选择", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel283']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i284"] = {  cons:"consHTcold",  title:"集中供暖期间",  unit:"",  text:"您家的集中供暖时间段是？", inputType:"sel284", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel284"]= [ "请选择", "不使用", "1个月", "2个月", "3个月", "4个月", "5个月", "6个月", "8个月", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel284']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '8', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i285"] = {  cons:"consHTsum",  title:"全热交换新风换气机",  unit:"",  text:"您家使用全热交换新风换气机吗？", inputType:"sel285", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"2",d11p:"0",d12t:"1",d12p:"2",d13t:"",d13p:"",d1w:"1",d1d:"0", d21t:"2",d21p:"0",d22t:"1",d22p:"2",d23t:"",d23p:"",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel285"]= [ "请选择", "是", "否", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel285']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i286"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel286", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel286"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel286']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i287"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel287", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel287"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel287']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i288"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel288", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel288"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel288']= [ '-1', '3', '7', '10', '15', '30', '50', '65', '100', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i289"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel289", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel289"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel289']= [ '-1', '2', '6', '12', '30', '50', '100', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i290"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel290", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel290"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel290']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i291"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel291", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel291"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel291']= [ '-1', '10', '30', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i292"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel292", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel292"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel292']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i293"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel293", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel293"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel293']= [ '-1', '2', '6', '15', '30', '50', '100', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i294"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel294", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel294"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel294']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i295"] = {  cons:"consHTcold",  title:"#",  unit:"",  text:"", inputType:"sel295", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel295"]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel295']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i401"] = {  cons:"consDRsum",  title:"是否使用干衣机",  unit:"",  text:"您家使用干衣机或者烘干功能吗？请选择使用频率。", inputType:"sel401", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"5",d11p:"0",d12t:"3",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel401"]= [ "请选择", "不使用", "一个月1〜3次", "一周1～2次", "两天1次", "每天", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel401']= [ '-1', '5', '4', '3', '2', '1', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i402"] = {  cons:"consDRsum",  title:"烘干机的类型",  unit:"",  text:"请选择干衣机的类型。", inputType:"sel402", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel402"]= [ "请选择", "电力（热泵）", "电力", "煤气", "我不知道", "我家没有", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel402']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i403"] = {  cons:"consDRsum",  title:"洗衣机使用频率",  unit:"",  text:"请选择洗衣机的使用频率。", inputType:"sel403", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel403"]= [ "请选择", "每天使用很多次", "每天使用两次", "每天使用一次", "没洗的衣服多了才使用", "我不知道", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel403']= [ '-1', '4', '2', '1', '0.5', '1', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i411"] = {  cons:"consDRsum",  title:"真空吸尘器的强度",  unit:"",  text:"您家吸尘机的吸力强度是多少？", inputType:"sel411", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel411"]= [ "请选择", "基本上调强使用", "按脏度分别调整", "基本上调弱", "不能调整强度", "我不知道", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel411']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i412"] = {  cons:"consDRsum",  title:"吸尘器使用时间",  unit:"分/日",  text:"您每天使用多长时间吸尘器？", inputType:"sel412", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel412"]= [ "请选择", "基本上不使用", "5分钟", "10分钟", "15分钟", "30分钟", "1小时", "使用吸尘机器人", "我不知道", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel412']= [ '-1', '0', '5', '10', '15', '30', '60', '11', '12', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i501"] = {  cons:"consLIsum",  title:"客厅的照明",  unit:"W",  text:"您家客厅主要照明灯具是什么？", inputType:"sel501", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"3",d21p:"2",d22t:"2",d22p:"1",d23t:"",d23p:"",d2w:"1",d2d:"1", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel501"]= [ "请选择", "白炽灯", "荧光灯", "LED ", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel501']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i502"] = {  cons:"consLIsum",  title:"房间没人时是否关灯",  unit:"",  text:"房间里没有人的时候，会关灯吗？", inputType:"sel502", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"7",d11p:"0",d12t:"1",d12p:"1",d13t:"0",d13p:"2",d1w:"1",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"7",d31p:"0",d32t:"1",d32p:"1",d33t:"0",d33p:"2",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel502"]= [ "请选择", "都开灯", "有的房间开灯", "几乎关灯", "都关灯", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel502']= [ '-1', '10', '6', '2', '0', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i511"] = {  cons:"consLI",  title:"有照明的地方",  unit:"",  text:"您家在哪些位置有照明？", inputType:"sel511", right:"1", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel511"]= [ "请选择", "门口", "门口外", "走廊", "厕所", "更衣室", "洗澡", "客厅", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel511']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '', '', '', '', '' ];
D6.scenario.defInput["i512"] = {  cons:"consLI",  title:"照明类型",  unit:"",  text:"请选择您家的灯具类型。", inputType:"sel512", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel512"]= [ "请选择", "白炽灯", "荧光灯", "荧光", "荧光灯管", "LED", "人体感应灯", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel512']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i513"] = {  cons:"consLI",  title:"灯泡多少瓦特",  unit:"W",  text:"您家一个灯泡的功率有多大？", inputType:"sel513", right:"1", postfix:"Number", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel513"]= [ "请选择", "5W", "10W", "15W", "20W", "30W", "40W", "60W", "80W", "100W ", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel513']= [ '-1', '5', '10', '15', '20', '30', '40', '60', '80', '100', '', '', '', '', '', '' ];
D6.scenario.defInput["i514"] = {  cons:"consLI",  title:"灯泡数量",  unit:"球・本",  text:"您家一共使用几个灯泡？", inputType:"sel514", right:"1", postfix:"Number", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel514"]= [ "请选择", "1个", "2个", "3个", "4个", "6个", "8个", "10个", "15个", "20个", "30个", "", "", "", "", "" ];			D6.scenario.defSelectData['sel514']= [ '-1', '1', '2', '3', '4', '6', '8', '10', '15', '20', '30', '', '', '', '', '' ];
D6.scenario.defInput["i515"] = {  cons:"consLI",  title:"开灯时间",  unit:"時間/日",  text:"您家一天开几小时灯？", inputType:"sel515", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel515"]= [ "请选择", "不使用", "1小时", "2小时", "3小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel515']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '12', '16', '24', '', '', '', '', '' ];
D6.scenario.defInput["i601"] = {  cons:"consTVsum",  title:"看电视时间",  unit:"時間",  text:"把家里所有电视机都计算在内，您家一天一共开几小时电视？包括用电视机打游戏的时间。", inputType:"sel601", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel601"]= [ "请选择", "不看电视", "2小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "32小时", "40小时", "", "", "", "", "" ];			D6.scenario.defSelectData['sel601']= [ '-1', '0', '2', '4', '6', '8', '12', '16', '24', '32', '40', '', '', '', '', '' ];
D6.scenario.defInput["i631"] = {  cons:"consTV",  title:"电视尺寸",  unit:"インチ",  text:"请选择您家的电视尺寸。", inputType:"sel631", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel631"]= [ "请选择", "我家没有", "20寸以下", "20〜30寸", "30〜40寸", "45〜50寸", "50～65寸", "65寸以上", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel631']= [ '-1', '0', '18', '25', '35', '45', '60', '70', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i632"] = {  cons:"consTV",  title:"电视使用年数",  unit:"年",  text:"请选择您家的电视使用年数。", inputType:"sel632", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel632"]= [ "请选择", "我家没有", "1年未满", "3年未满", "5年未满", "7年未满", "10未满年", "15年未满", "20年未满", "20年以上", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel632']= [ '-1', '0', '1', '2', '4', '6', '9', '13', '18', '25', '', '', '', '', '', '' ];
D6.scenario.defInput["i633"] = {  cons:"consTV",  title:"看电视时间",  unit:"年",  text:"您一天看多长时间电视？", inputType:"sel633", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel633"]= [ "请选择", "不使用", "2小时", "4小时", "6小时", "8小时", "12小时", "16小时", "24小时", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel633']= [ '-1', '0', '2', '4', '6', '8', '12', '16', '24', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i701"] = {  cons:"consRFsum",  title:"冰箱的数量",  unit:"台",  text:"您家有几台冰箱。冷柜也按1台计算。", inputType:"sel701", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"2",d11p:"0",d12t:"0",d12p:"2",d13t:"",d13p:"",d1w:"1",d1d:"2", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"2",d31p:"0",d32t:"0",d32p:"2",d33t:"",d33p:"",d3w:"1",d3d:"2"}; 			D6.scenario.defSelectValue["sel701"]= [ "请选择", "我家没有", "1台", "2台", "3台", "4台", "5台", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel701']= [ '-1', '0', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i711"] = {  cons:"consRF",  title:"冰箱的使用年数",  unit:"年",  text:"您现在的冰箱已经使用了几年？", inputType:"sel711", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel711"]= [ "请选择", "我家没有", "1年未满", "3年未满", "5年未满", "7年未满", "10未满年", "15年未满", "20年未满", "20年以上", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel711']= [ '-1', '0', '1', '2', '4', '6', '8', '12', '17', '25', '', '', '', '', '', '' ];
D6.scenario.defInput["i712"] = {  cons:"consRF",  title:"冰箱类型",  unit:"",  text:"请选择您家的冰箱类型。", inputType:"sel712", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel712"]= [ "请选择", "冰箱", "冷冻机", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel712']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i713"] = {  cons:"consRF",  title:"冰箱的容量",  unit:"",  text:"请选择您家的冰箱容量。", inputType:"sel713", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel713"]= [ "请选择", "100升以下", "101～200升", "201～300升", "301～400升", "401～500升", "501升以上", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel713']= [ '-1', '80', '150', '250', '350', '450', '550', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i714"] = {  cons:"consRF",  title:"冰箱温度设置",  unit:"",  text:"您家冰箱内的温度设置是多少？", inputType:"sel714", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"4",d31p:"1",d32t:"3",d32p:"2",d33t:"0",d33p:"1",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel714"]= [ "请选择", "强", "中", "弱", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel714']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i715"] = {  cons:"consRF",  title:"冰箱里的空间",  unit:"",  text:"您会注意不把冰箱塞得太满吗？", inputType:"sel715", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel715"]= [ "请选择", "能注意", "有时不能注意", "完全不能注意", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel715']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i716"] = {  cons:"consRF",  title:"冰箱离墙距离",  unit:"",  text:"冰箱放置位置是否离开墙面5厘米?", inputType:"sel716", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel716"]= [ "请选择", "是", "否", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel716']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i801"] = {  cons:"consCKcook",  title:"炉的热源",  unit:"",  text:"请选择您家的灶台热源。", inputType:"sel801", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel801"]= [ "请选择", "燃气", "电气（IH等）", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel801']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i802"] = {  cons:"consCKcook",  title:"做饭频率",  unit:"割",  text:"请选择做饭频率。", inputType:"sel802", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel802"]= [ "请选择", "不做饭", "一周一次以下", "一周两、三次", "一天一次", "一天两次", "一天三次", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel802']= [ '-1', '0', '1', '2', '4', '7', '10', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i811"] = {  cons:"consCKrice",  title:"电饭锅的保温功能",  unit:"",  text:"您是否使用电饭锅的保温功能？", inputType:"sel811", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel811"]= [ "请选择", "不保温", "6个小时左右", "12个小时左右", "24个小时左右", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel811']= [ '-1', '0', '6', '12', '24', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i821"] = {  cons:"consCKpot",  title:"电水壶的保温",  unit:"",  text:"您是否使用电水壶的保温功能？", inputType:"sel821", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"10",d11p:"0",d12t:"4",d12p:"1",d13t:"0",d13p:"2",d1w:"1",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"10",d31p:"0",d32t:"4",d32p:"1",d33t:"0",d33p:"2",d3w:"1",d3d:"1"}; 			D6.scenario.defSelectValue["sel821"]= [ "请选择", "不保温", "6个小时左右", "12个小时左右", "24个小时左右", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel821']= [ '-1', '0', '6', '12', '24', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i822"] = {  cons:"consCKpot",  title:"电水壶的节能性",  unit:"",  text:"您的电水壶是否为节能型产品？", inputType:"sel822", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel822"]= [ "请选择", "是", "否", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel822']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i901"] = {  cons:"consCRsum",  title:"汽保有量",  unit:"",  text:"您家有几辆汽车？", inputType:"sel901", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"4",d11p:"0",d12t:"2",d12p:"1",d13t:"0",d13p:"2",d1w:"2",d1d:"1", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel901"]= [ "请选择", "我家没有", "一辆", "二辆", "三辆", "四辆", "五辆以上", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel901']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i902"] = {  cons:"consCRsum",  title:"电动车、摩托车的保有量",  unit:"",  text:"您家有几辆电动车或摩托车？", inputType:"sel902", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel902"]= [ "请选择", "没有", "一辆", "二辆", "三辆", "四辆", "五个或以上", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel902']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i911"] = {  cons:"consCR",  title:"汽车类型",  unit:"",  text:"请选择汽车类型。", inputType:"sel911", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel911"]= [ "请选择", "小型汽车", "小型货车", "大篷货车", "电动车", "摩托车", "大排量摩托车", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel911']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i912"] = {  cons:"consCR",  title:"汽车的耗油量",  unit:"",  text:"请选择汽车的耗油量。", inputType:"sel912", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"30",d11p:"2",d12t:"15",d12p:"1",d13t:"",d13p:"",d1w:"2",d1d:"1", d21t:"30",d21p:"2",d22t:"15",d22p:"1",d23t:"",d23p:"",d2w:"2",d2d:"1", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel912"]= [ "请选择", "6公里/ L以下", "7～9km / L", "10～12km / L", "13～15km / L", "16～20km / L", "21～26km / L", "27～35km / L", "36公里/ L以上", " ", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel912']= [ '-1', '6', '8', '11', '14', '18', '23', '30', '40', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i913"] = {  cons:"consCR",  title:"#汽车的主要用户",  unit:"",  text:"在汽车的任何人。或请填写是否有打电话给你。", inputType:"", right:"", postfix:"", nodata:"", varType:"String", min:"", max:"", defaultValue:"", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue[""]= [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i914"] = {  cons:"consCR",  title:"轮胎是否有节能性",  unit:"",  text:"您是否使用节能轮胎？", inputType:"sel914", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel914"]= [ "请选择", "是", "否", "我不知道", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel914']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i921"] = {  cons:"consCRtrip",  title:"#目的地",  unit:"",  text:"请选择您常开车去的地方。", inputType:"", right:"", postfix:"", nodata:"", varType:"String", min:"", max:"", defaultValue:"", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue[""]= [ "请选择", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i922"] = {  cons:"consCRtrip",  title:"开车频率",  unit:"",  text:"请选择您的开车频率。", inputType:"sel922", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel922"]= [ "请选择", "每日", "每周5次", "每周2～3次", "每周1次", "每月2次", "每月1次", "2个月1次", "一年2～3次", "一年1次", "不开车", "", "", "", "", "" ];			D6.scenario.defSelectData['sel922']= [ '-1', '365', '250', '120', '50', '25', '12', '6', '2', '1', '', '', '', '', '', '' ];
D6.scenario.defInput["i923"] = {  cons:"consCRtrip",  title:"单程距离",  unit:"km",  text:"请选择您开车时的大概单程距离。", inputType:"sel923", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel923"]= [ "请选择", "1公里", "2公里", "3公里", "5公里", "10公里", "20公里", "30公里", "50公里", "100公里", "200公里", "400公里", "600公里以上", "", "", "" ];			D6.scenario.defSelectData['sel923']= [ '-1', '1', '2', '3', '5', '10', '20', '30', '50', '100', '200', '400', '700', '', '', '' ];
D6.scenario.defInput["i924"] = {  cons:"consCRtrip",  title:"开第几辆车",  unit:"",  text:"您常开第几辆车？", inputType:"sel924", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel924"]= [ "请选择", "第一辆", "第二辆", "第三辆", "第四辆", "第五辆", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel924']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i931"] = {  cons:"consCRsum",  title:"停车熄火",  unit:"",  text:"长时间停车时，您会关闭发动器吗？", inputType:"sel931", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"0", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel931"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel931']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i932"] = {  cons:"consCRsum",  title:"急加速与急减速",  unit:"",  text:"您开车时会注意不急加速或急启动吗？", inputType:"sel932", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel932"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel932']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i933"] = {  cons:"consCRsum",  title:"固定速度驾驶",  unit:"",  text:"您开车时会尽量减少加减速动作吗？", inputType:"sel933", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel933"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel933']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i934"] = {  cons:"consCRsum",  title:"松开油门",  unit:"",  text:"您在停车时会提前松开油门吗", inputType:"sel934", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel934"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel934']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i935"] = {  cons:"consCRsum",  title:"查看道路交通信息",  unit:"",  text:"您开车时查看道路交通信息吗？", inputType:"sel935", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel935"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel935']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i936"] = {  cons:"consCRsum",  title:"减少载重",  unit:"",  text:"您开车时会清理掉车内不需要的物品，减少载重吗？", inputType:"sel936", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel936"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel936']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i937"] = {  cons:"consCRsum",  title:"汽车空调的温度调节",  unit:"",  text:"您开车时会注意调节车内空调风量的大小吗？", inputType:"sel937", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel937"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel937']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i938"] = {  cons:"consCRsum",  title:"热车",  unit:"",  text:"在寒冷季节，您开车前会热车吗？                                                                                                                                                                                        ", inputType:"sel938", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"3",d31p:"0",d32t:"2",d32p:"1",d33t:"1",d33p:"2",d3w:"1",d3d:"0"}; 			D6.scenario.defSelectValue["sel938"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel938']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i939"] = {  cons:"consCRsum",  title:"轮胎内的气压",  unit:"",  text:"您会主意轮胎气压吗？", inputType:"sel939", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"",d11p:"",d12t:"",d12p:"",d13t:"",d13p:"",d1w:"",d1d:"", d21t:"",d21p:"",d22t:"",d22p:"",d23t:"",d23p:"",d2w:"",d2d:"", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel939"]= [ "请选择", "是", "有时", "否", "", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel939']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i221"] = {  cons:"consCOsum",  title:"空调能效",  unit:"",  text:"您家的空调节能性能好不好？", inputType:"sel221", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"0", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"2",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel221"]= [ "请选择", "一级", "二级", "三级", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel221']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i121"] = {  cons:"consHWsum",  title:"热水器能效",  unit:"",  text:"您家的热水器节能性能好不好？", inputType:"sel121", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"0", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"2",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel121"]= [ "请选择", "一级", "二级", "三级", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel121']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i621"] = {  cons:"consTVsum",  title:"电视能效",  unit:"",  text:"您家的电视节能性能好不好？", inputType:"sel621", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"0", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"2",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel621"]= [ "请选择", "一级", "二级", "三级", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel621']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i421"] = {  cons:"consDRsum",  title:"洗衣机能效",  unit:"",  text:"您家的洗衣机节能性能好不好？", inputType:"sel421", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"0", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"2",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel421"]= [ "请选择", "一级", "二级", "三级", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel421']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];
D6.scenario.defInput["i721"] = {  cons:"consRFsum",  title:"冰箱能效",  unit:"",  text:"您家的冰箱节能性能好不好？", inputType:"sel721", right:"", postfix:"", nodata:"", varType:"Number", min:"", max:"", defaultValue:"-1", d11t:"3",d11p:"0",d12t:"2",d12p:"1",d13t:"1",d13p:"2",d1w:"1",d1d:"0", d21t:"3",d21p:"0",d22t:"2",d22p:"1",d23t:"1",d23p:"2",d2w:"1",d2d:"0", d31t:"",d31p:"",d32t:"",d32p:"",d33t:"",d33p:"",d3w:"",d3d:""}; 			D6.scenario.defSelectValue["sel721"]= [ "请选择", "一级", "二级", "三级", "我不知道", "", "", "", "", "", "", "", "", "", "", "" ];			D6.scenario.defSelectData['sel721']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ];

	// prefecture definition ----------------------------------------------------
	D6.scenario.defSelectValue["sel021"] = [
		"请选择",
		'河北',
		'山西',
		'辽宁',
		'吉林',
		'黑龙江',
		'江苏',
		'浙江',
		'安徽',
		'福建',
		'江西',
		'山东',
		'河南',
		'湖北',
		'湖南',
		'广东',
		'海南',
		'四川',
		'贵州',
		'云南',
		'陕西',
		'甘肃',
		'青海',
		'台湾',
		'内蒙古',
		'广西',
		'西藏',
		'宁夏',
		'新疆',
		'北京',
		'天津',
		'上海',
		'重庆',
		'香港',
		'澳门'
	];
	D6.scenario.defSelectData["sel021"] = [
		"-1",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"29",
		"30",
		"31",
		"32",
		"33",
		"34"
	];
	D6.scenario.defSelectValue["sel022"] = ["请选择", "北部", "南部"];
	D6.scenario.defSelectData["sel022"] = ["-1", "1", "2"];

	//easy input
	D6.scenario.defEasyQues[0].title = "简单的输入";
	D6.scenario.defEasyQues[1].title = "行为检查输入";
};
