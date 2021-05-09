/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsTotal
* 全体の消費量
* 
* @author Yasufumi SUZUKI 	2011/01/17 diagnosis5
*								2011/05/06 actionscript3
*/


class consTotal extends ConsBase {
	//初期設定値
	constructor() {
		super();

		this.averagePriceElec;

		this.seasonConsPattern = [1.4, 1, 1.2];	//業種ごとに設定

		//構造設定
		this.consName = "consTotal";	//分野コード
		this.consCode = "TO";			//うちわけ表示のときのアクセス変数
		this.title = "全体";			//分野名として表示される名前
		this.orgCopyNum = 0;			//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.sumConsName = "";			//集約先の分野コード
		this.sumCons2Name = "";			//関連の分野コード
		this.groupID = "9";				//うちわけ番号
		this.color = "#a9a9a9";		//表示の色}
		this.inputGuide = "全体のエネルギーの使い方について";		//入力欄でのガイド

		//no price Data set 1 if nodata
		this.noPriceData = {};

		this.measureName = [
			"mTOcontracthigh",
			"mTOcontracthome",
			"mTOcontractequip",
			"mTOcontractbreaker",
			"mTOcontractintegrated",
			"mTOdemand",
			"mTOreducetranse",
			"mTOpeakgenerator",
			"mTOpeakcut"
		];
	}

	//Documentからの変換
	paramSet() {
		this.business = this.input("i001", 1);				//業種
		this.floor = this.input("i005", D6.area.businessParams[this.business].floor);
		//床面積 m2
		this.workTime = this.input("i002", D6.area.businessParams[this.business].workTime);
		//業務時間
		this.workDay = this.input("i003", D6.area.businessParams[this.business].workDay);
		//業務日

		this.workTimeRatio = this.workTime / D6.area.businessParams[this.business].workTime;
		this.workDayRatio = this.workDay / D6.area.businessParams[this.business].workDay;

		//契約
		this.contract = this.input('i034', 3);	//'電気契約の種類',
		this.baseJuryo = this.input('i027', -1);	//'電気契約容量：従量電灯分',
		this.baseTime = this.input('i028', -1);	//'電気契約容量：従量時間帯契約',
		this.baseLow = this.input('i029', -1);	//'電気契約容量：低圧電力分',
		this.baseTotal = this.input('i030', -1);	//'電気契約容量：低圧総合電力分',
		this.baseHigh = this.input('i031', -1);	//'電気契約容量：高圧電力分',
		if (this.contract == 1) {
			this.kw = 0;
		} else {
			this.kw = Math.max(this.baseTime, this.baseTotal, this.baseLow, this.baseHigh, 10);
		}

		//太陽光
		this.solarSet = this.input("i022", 0);			//太陽光発電の設置　あり=1
		this.solarKw = this.input("i023", 0);			//太陽光発電の設置容量(kW)
		this.solarYear = this.input("i024", 0);		//太陽光発電の設置年

		//月平均の入力のパターン
		this.priceEle = this.priceandcons("i051", "i041", "electricity");
		if (this.priceEle == -1) {
			this.priceEle = D6.Unit.consToCost(D6.area.businessParams[this.business].energy
				* this.floor
				* this.workTimeRatio
				* this.workDayRatio
				/ D6.Unit.jules.electricity / 12
				, "electricity", 1, 0);			//月電気代
		}

		this.priceEleWinter = this.input("i0611", -1);	//電気料金（冬）
		this.priceEleSpring = this.input("i0612", -1);	//電気料金（春秋）
		this.priceEleSummer = this.input("i0613", -1);	//電気料金（夏）

		this.priceGasWinter = this.input("i0621", -1);	//ガス料金（冬）
		this.priceGasSpring = this.input("i0622", -1);	//ガス料金（春秋）
		this.priceGasSummer = this.input("i0623", -1);	//ガス料金（夏）

		this.priceKerosWinter = this.input("i0631", -1);	//灯油料金（冬）
		this.priceKerosSpring = this.input("i0632", -1);	//灯油料金（春秋）
		this.priceKerosSummer = this.input("i0633", -1);	//灯油料金（夏）

		//ガス代
		this.priceGas = this.input("i042", 0);				//月ガス代

		this.houseType = this.input("i004", -1);			//戸建て集合
		this.heatEquip = this.input("i231", -1);			//主な暖房機器

		this.priceKeros = this.input("i043", 0);		//月灯油代0（円)

		this.priceCar = this.input("i044", 0);			//月車燃料代

		this.equipHWType = this.input("i101", 1);			//給湯器の種類

		this.generateEleUnit = D6.area.unitPVElectricity;	//地域別の値を読み込む

		//季節別の光熱費の入力のパターン（初期値　-1:無記入）
		this.seasonPrice = [[this.priceEleWinter, this.priceEleSpring, this.priceEleSummer],		//電気
		[this.priceGasWinter, this.priceGasSpring, this.priceGasSummer],			//ガス
		[this.priceKerosWinter, this.priceKerosSpring, this.priceKerosSummer], 	//灯油
		[-1, -1, -1] 	//ガソリン
		];

		//毎月の消費量の入力のパターン（初期値　-1：無記入）
		this.monthlyPrice = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
		[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]];
		var ene = ["electricity", "gas", "kerosene", "car"];
		for (var i = 0; i < 4; i++) {
			for (var m = 1; m <= 12; m++) {
				this.monthlyPrice[i][m - 1] = parseInt(this.priceandcons("i08" + (i + 1) + ("" + m),
					"i07" + (i + 1) + ("" + m),
					ene[i]));
			}
		}
	}

	//消費量の計算
	calc() {

		this.clear();			//結果の消去
		var ret;

		//入力値の読み込み
		this.paramSet();

		//季節係数の読込（全エネルギー）
		var seasonConsPattern = D6.area.getSeasonParamCommon();

		//電気の推計
		ret = D6.calcMonthly(this.priceEle, this.seasonPrice[0], this.monthlyPrice[0], seasonConsPattern.electricity, "electricity");
		this.priceEle = ret.ave;
		this.seasonPrice["electricity"] = ret.season;
		this.monthlyPrice["electricity"] = ret.monthly;

		//平均電気代
		var def = D6.area.elecPrice[this.contract];
		averagePriceElec = (def[1] + def[2]) / 2;

		//基本料金
		var priceBase = def[4];

		//太陽光発電量
		var generateEle = this.generateEleUnit * this.solarKw / 12;

		if (this.solarKw > 0) {
			//this.grossElectricity = D6.area.calcEleCons( this.priceEle, this.kw, this.contract );
			this.grossElectricity = D6.Unit.costToCons(this.priceEle, "electricity", this.contract, this.kw);
			this.electricity = this.grossElectricity - generateEle;
		} else {
			//this.electricity = D6.area.calcEleCons( this.priceEle, this.kw, this.contract );
			this.electricity = D6.Unit.costToCons(this.priceEle, "electricity", this.contract, this.kw);
			this.grossElectricity = this.electricity;
		}

		//ガス
		ret = D6.calcMonthly(this.priceGas, this.seasonPrice[1], this.monthlyPrice[1], seasonConsPattern.gas, "gas");
		this.priceGas = ret.ave;
		this.seasonPrice["gas"] = ret.season;
		this.monthlyPrice["gas"] = ret.monthly;

		this.gas = (this.priceGas - D6.Unit.priceBase.gas)
			/ D6.Unit.price.gas;
		if (this.gas < 0) this.gas = 0;

		//灯油
		ret = D6.calcMonthly(this.priceKeros, this.seasonPrice[2], this.monthlyPrice[2], seasonConsPattern.kerosene, "kerosene");
		this.priceKeros = ret.ave;
		this.seasonPrice["kerosene"] = ret.season;
		this.monthlyPrice["kerosene"] = ret.monthly;
		this.kerosene = this.priceKeros / D6.Unit.price.kerosene;

		//ガソリン
		ret = D6.calcMonthly(this.priceCar, this.seasonPrice[3], this.monthlyPrice[3], seasonConsPattern.car, "car");
		this.priceCar = ret.ave;
		this.seasonPrice["car"] = ret.season;
		this.monthlyPrice["car"] = ret.monthly;
		this.car = this.priceCar / D6.Unit.price.car;

		//重油
	}


	//対策計算
	calcMeasure() {
		if (this.contract == 4) {
			this.measures["mTOcontracthigh"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", 6, this.kw);
			//低圧契約から高圧契約に変更する
			this.measures["mTOcontracthome"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", 3, this.kw);
			//低圧契約から従量電灯契約に変更する
			this.measures["mTOcontractintegrated"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", 5, this.kw);
			//低圧＋従量電灯から、低圧総合電力に変更する
			this.measures["mTOcontractbreaker"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", this.contract, this.kw * 0.8);
			//負荷設備量ではなく、契約主開閉器（ブレーカー）による契約に変更する
			this.measures["mTOcontractequip"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", this.contract, this.kw * 0.9);
			//使っていない機器分の契約更新をする
		}
		if (this.contract == 4 || this.contract == 5 || this.contract == 6) {
			this.measures["mTOdemand"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", this.contract, this.kw * 0.9);
			//デマンドコントロールを行う
			this.measures["mTOreducetranse"].calcReduceRate(0.01);	//変圧器の負荷を集約し、稼働台数を減らす
			this.measures["mTOpeakgenerator"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", this.contract, this.kw - 3);
			//電力ピーク時間帯の自家発電装置の導入(3kVA)
			this.measures["mTOpeakcut"].costUnique = D6.Unit.consToCost(this.electricity, "electricity", this.contract, this.kw * 0.95);
			//電力ピーク時間帯に、電気利用を抑制する
		}

	}


	priceandcons(consid, priceid, target) {
		var price = -1;
		if (target == "electricity") {
			if (this.input(consid, -1) == -1) {
				price = this.input(priceid, -1);
			} else {
				price = D6.area.calcElePrice(this.input(consid, -1), this.kw, this.contract);
			}
		} else {
			if (this.input(consid, -1) == -1) {
				price = this.input(priceid, -1);
			} else {
				price = this.input(consid, -1) * D6.Unit.price[target] + D6.Unit.priceBase[target];
			}
		}

		return price;
	}

}

