/**
* Home-Eco Diagnosis for ActionScript3
* 
* ConsOTsum: ConsOTsum Class
* その他機器消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 照明簡易計算を実装
*/

class consOTsum extends ConsBase {
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
		this.consName = "consOTsum";		//分野コード
		this.consCode = "OT";				//うちわけ表示のときのアクセス変数
		this.title = "機器";				//分野名として表示される名前
		this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.sumConsName = "consTotal";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "6";					//うちわけ番号
		this.color = "#ffff00";				//表示の色
		this.residueCalc = "no";			//残余の計算
		this.inputGuide = "その他機器の使い方について";		//入力欄でのガイド

		this.measureName = [
		];
	}

	//機器消費量計算
	calc() {
		this.clear();			//結果の消去
	}

	//対策計算
	calcMeasure() {
	}

}

