/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsCR
* 自家用車消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
* 								2016/04/12 js
*/


class consCR extends consCRsum {
	//初期設定値
	constructor() {
		super();
		//構造設定
		this.consName = "consCR";			//分野コード
		this.consCode = "";					//うちわけ表示のときのアクセス変数
		this.title = "車両";				//分野名として表示される名前
		this.orgCopyNum = 1;				//初期複製数（consCodeがない場合にコピー作成）
		this.addable = "車両";				//追加可能
		this.sumConsName = "";				//集約先の分野コード
		this.sumCons2Name = "consCRsum";	//関連の分野コード
		this.groupID = "8";					//うちわけ番号
		this.color = "#ee82ee";			//表示の色
		this.countCall = "台目";			//呼び方
		this.inputGuide = "保有する車ごとの性能・使い方について";		//入力欄でのガイド

		//対策の関連定義
		this.measureName = [
			"mCRreplace",
			"mCRreplaceElec"
		];
	}

	//車消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.carType = this.input("i911" + this.subID, 1);	//車種類
		this.performance = this.input("i912" + this.subID, 12);//車燃費
		this.user = this.input("i913" + this.subID, this.subID + "台目");	//車利用者
		this.ecoTier = this.input("i914" + this.subID, 3);	//エコタイヤ

		if (this.subID != 0) {
			this.mesTitlePrefix = this.user;
		}

		//移動先からの加算でのみ追加する
	}


	calc2nd() {

		//if ( this.subID == 0 ) return;
		var trsum = 0;
		var carnum = D6.consListByName["consCR"].length;
		var tripnum = D6.consListByName["consCRtrip"].length;
		for (i = 1; i < tripnum; i++) {
			trsum += D6.consListByName["consCRtrip"][i].car;
		}
		if (trsum == 0) {
			if (this.subID == 0) {
				this.car = this.sumCons2.car;
			} else {
				//移動先の割合がない場合には、1台目が半分、次が残りの半分。最後の車が残りを得る
				this.car *= Math.pow(0.5, this.subID);
				if (this.subID == carnum - 1) {
					this.car *= 2;
				}
			}
		} else {
			//移動先の割合で、ガソリン消費量を割り振られているこの比率を拡大する
			this.car *= this.sumCons2.car / trsum;
		}
		this.car = 0; 	//160620 一時的
	}


	//車対策計算
	calcMeasure() {
		//	if ( this.subID == 0 && this.car == this.sumCons.car ) return;

		this.measures["mCRreplace"].calcReduceRate((this.performanceNew - this.performanceNow) / this.performanceNew);
		this.measures["mCRreplaceElec"].calcReduceRate((this.performanceNew - this.performanceNow) / this.performanceNew);

	}
}

