/**
* Home-Eco Diagnosis for ActionScript3
* 
* ConsLIsum: ConsLIsum Class
* 照明全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 照明簡易計算を実装
*/


class consLIsum extends ConsBase {
	//初期設定値
	constructor() {
		super();

		this.lightTime = 6;					//標準照明時間6時間
		this.performanceLED = 100;			//LED  lm/W
		this.performanceHF = 80;			//HF  lm/W
		this.performanceFlueciend = 60;		//蛍光灯  lm/W
		this.preformanceBulb = 15;			//電球 lm/W

		this.outdoorWatt = 150;				//センサー屋外式の消費電力(W)
		this.outdoorTime = 0.5;				//センサー屋外式の時間（時間）
		this.sensorWatt = 2;				//センサーの消費電力（W)

		//構造設定
		this.consName = "consLIsum";		//分野コード
		this.consCode = "LI";				//うちわけ表示のときのアクセス変数
		this.title = "照明";				//分野名として表示される名前
		this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.sumConsName = "consTotal";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "6";					//うちわけ番号
		this.color = "#ffff00";				//表示の色
		this.inputGuide = "全体の照明の使い方について";		//入力欄でのガイド

		this.measureName = [
		];
	}

	//照明消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.business = D6.consShow["TO"].business;			//業種
		this.floor = D6.consShow["TO"].floor;				//床面積 m2
		this.workDay = D6.consShow["TO"].workDay;			//週日数
		this.lightTime = this.input("i002",
			(this.business == 3 ? 24 :
				(this.business == 2 ? 12 : 6)));
		//業務（照明）時間
		this.lightType = this.input("i501", 1);		//照明の種類
		var consUnit = 50;		//照明消費電力W/m2床面積	
		if (this.lightType == 1) {
			consUnit = 50;
		}
		//月の消費電力量　kWh/月
		this.electricity = 50 * this.floor * this.lightTime / 2 * this.workDay / 7 * 30 / 1000;
	}

	//対策計算
	calcMeasure() {
		if (!(this.lightType == 4 || this.lightType == 6)
			|| this.watt < 20
		) {
		} else {
		}

	}

}


