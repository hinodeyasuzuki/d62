/**
* Home-Eco Diagnosis for JavaScript
* 
* consCRtrip
* 自家用車全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*/

class ConsCRtrip extends ConsCRsum {
	//初期設定値
	constructor() {
		super();
		//構造設定
		this.consName = "consCRtrip";		//分野コード
		this.consCode = "";					//うちわけ表示のときのアクセス変数
		this.title = "移動";				//分野名として表示される名前
		this.orgCopyNum = 1;				//初期複製数（consCodeがない場合にコピー作成）
		this.sumConsName = "consCRsum";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "8";					//うちわけ番号
		this.color = "#ee82ee";			//表示の色
		this.countCall = "ヶ所目";			//呼び方
		this.addable = "移動先";
		this.inputGuide = "移動先ごとの車等の使い方について";		//入力欄でのガイド

		//対策の関連定義
		this.measureName = [
		];

	}

	//移動消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.dist = this.input("i921" + this.subID, this.subID + "ヶ所目");//行き先
		this.frequency = this.input("i922" + this.subID, 250);		//頻度
		this.km = this.input("i923" + this.subID, 0);				//距離
		this.carID = this.input("i924" + this.subID, 1);			//使用する車

		if (this.subID != 0) {
			this.mesTitlePrefix = this.dist;
		}

		//車の燃費
		this.performance = D6.consListByName["consCR"][this.carID].performance;

		//this.car = this.km * 2 * this.frequency / 12 / this.performance;
		//ガソリン量　L/月

		//関連する車を加算する
		D6.consListByName["consCR"][this.carID].car += this.car;

	}

	calc2nd() {
		//残渣の場合の処理
		if (this.subID == 0) {
			this.car = this.sumCons.car;
			var cons = D6.consListByName[this.consName];
			for (var i = 1; i < cons.length; i++) {
				this.car -= cons[i].car;
			}
		}
		this.car = 0; 	//160620 一時的

	}

	//車対策計算
	calcMeasure() {
	}

}
