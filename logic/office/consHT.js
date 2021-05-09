/**
* Home-Eco Diagnosis for JavaScript
* 
* consHT
* 部屋暖房消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 暖房クラスに変換
*								2011/10/21 暖房簡易計算を実装
*/


class ConsHT extends ConsHTsum {
	//初期設定値
	constructor() {
		super();
		//他でも使う変数
		this.heatMcal;
		this.heatACCalcMcal;

		//構造設定
		this.consName = "consHT";			//分野コード
		this.consCode = "";					//うちわけ表示のときのアクセス変数
		this.title = "暖房";				//分野名として表示される名前
		this.orgCopyNum = 1;				//初期複製数（consCodeがない場合にコピー作成）
		this.addable = "冷暖房するエリア";		//追加可能
		this.sumConsName = "consHTsum";		//集約先の分野コード
		this.sumCons2Name = "consAC";		//関連の分野コード
		this.groupID = "2";					//うちわけ番号
		this.color = "#ff0000";				//表示の色
		this.countCall = "エリア目";			//呼び方
		this.inputGuide = "部屋・エリアごとの暖房の使い方について";		//入力欄でのガイド

		this.measureName = [
			"mACreplace",
			"mHTtemplature",
			"mHTnothalogen",
			"mHTwindow",
			"mHTbrind"
		];
	}

	//暖房消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.business = D6.consShow["TO"].business;			//業種
		this.floor = this.input("i092" + this.subID, 50);	//床面積 m2

		this.heatArea = 0.3;								//冷暖房エリア
		this.heatEquip = this.input("i212" + this.subID, -1);		//暖房機器
		this.heatTemp = this.input("i211" + this.subID, 22);		//暖房設定温度
		this.subEquip = this.input("i213" + this.subID, -1);	//補助器具
		this.blind = this.input("i219" + this.subID, -1);	//カーテンを閉める

		//熱量計算
		var heatKcal = this.calcHeatLoad();

		if (this.heatEquip == 3) {
			this.kerosene = heatKcal / D6.Unit.calorie.kerosene * D6.area.seasonMonth.winter * 30 / 12;
		} else if (this.heatEquip == 2) {
			this.gas = heatKcal / D6.Unit.calorie.gas * D6.area.seasonMonth.winter * 30 / 12;
		} else {
			this.electricity = heatKcal / this.apf / D6.Unit.calorie.electricity * D6.area.seasonMonth.winter * 30 / 12;
		}

		this.endEnergy = heatKcal;

	}

	//対策計算
	calcMeasure() {
		if (this.heatTemp >= 21) {
			this.measures["mHTtemplature"].calcReduceRate(0.1 * (this.heatTemp - 20));	//	暖房の設定温度を控えめにする
		}
		if (this.subEquip == 1) {
			this.measures["mHTnothalogen"].calcReduceRate(0.2);	//	ハロゲンヒータなどの暖房を使わない
		}
		this.measures["mHTwindow"].calcReduceRate(0.04);	//	外気を活用して空調を止める
		if (this.blind != 1) {
			this.measures["mHTbrind"].calcReduceRate(0.02);	//	暖房時は夕方以降はブラインドを閉める
		}

	}


	//暖房消費量計算（他の分野計算後の消費量再計算）
	// consP がデータ保持の配列,cons.consShowは他の消費量配列
	//
	calc2nd() {
	}

	//暖房負荷計算 kcal/月
	//
	//		cons.houseType : 建物の形態
	//		cons.houseSize : 延べ床面積(m2) 係数(1)
	//		cons.heatArea : 冷暖房範囲(-)   部屋面積(m2)
	calcHeatLoad() {
		var energyLoad = 0;
		this.houseSize = this.floor;

		var heatLoadUnit;				//暖房負荷原単位　kcal/m2/hr
		if (this.houseType == 1) {
			heatLoadUnit = this.heatLoadUnit_Wood;
		} else {
			heatLoadUnit = this.heatLoadUnit_Steel;
		}

		var heatArea_m2;				//暖房面積 m2
		heatArea_m2 = this.houseSize * this.heatArea;
		if (this.heatArea > 0.05) {
			heatArea_m2 = Math.max(heatArea_m2, 13);		//最低13m2（約8畳）
		}

		var heatTime;					//暖房時間（時間）
		heatTime = this.heatTime;

		//暖房係数
		var heatMonth = D6.area.seasonMonth.winter;
		var heatFactor = D6.area.getHeatFactor(heatMonth, heatTime);

		var coefTemp;					//設定温度による負荷係数
		coefTemp = (this.heatTemp - 20) / 10 + 1;

		energyLoad = heatLoadUnit * heatFactor[1] * heatArea_m2 * heatTime * 30 * coefTemp;

		return energyLoad;
	}


	//暖房負荷についても割戻しをする必要がある
	calcAdjustStrategy(energyAdj) {
		this.calcACkwh *= energyAdj[this.mainSource];
		this.endEnergy *= energyAdj[this.mainSource];
	}

}



