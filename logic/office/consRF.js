/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsRF
* 冷蔵庫消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 冷蔵庫簡易計算を実装
*								2012/08/27 switchに変更
*/


class consRF extends consRFsum {
	//初期設定値
	constructor() {
		super();

		//構造設定
		this.consName = "consRF";			//分野コード
		this.consCode = "";					//うちわけ表示のときのアクセス変数
		this.title = "冷蔵庫";				//分野名として表示される名前
		this.orgCopyNum = 1;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.addable = "冷蔵庫";				//追加可能
		this.sumConsName = "consRFsum";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "3";					//うちわけ番号
		this.color = "#a0ffa0";			//表示の色
		this.countCall = "機種目";			//呼び方
		this.inputGuide = "個別の冷蔵庫・ショーケースについて";		//入力欄でのガイド

		//対策の関連定義
		this.measureName = [
		];

	}

	//冷蔵庫消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.type = this.input("i731" + this.subID, -1);		//冷蔵庫タイプ
		this.year = this.input("i732" + this.subID, -1);		//冷蔵庫使用年数
		this.size = this.input("i734" + this.subID, -1);		//冷蔵庫	内容量
		this.kW = this.input("i735" + this.subID, -1);		//冷蔵庫	消費電力kW

		if (this.subID != 0) {
			this.mesTitlePrefix = this.subID + this.countCall;
		}

		this.reduceRateChange = this.consYearAdvanced / this.consYear;
		//買い替えによる削減率
	}


	//対策計算
	calcMeasure() {
	}

}



