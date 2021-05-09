/**
* Home-Eco Diagnosis for ActionScript3
* 
* consLI: consLI Class
* 部屋照明消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 照明簡易計算を実装
*/

class consLI extends consLIsum {
	//初期設定値
	constructor() {
		super();

		//構造設定
		this.consName = "consLI";		//分野コード
		this.consCode = "";				//うちわけ表示のときのアクセス変数
		this.title = "";				//分野名として表示される名前
		this.orgCopyNum = 1;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.addable = "照明機器";		//追加可能
		this.sumConsName = "consLIsum";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "6";					//うちわけ番号
		this.color = "#ffff00";				//表示の色
		this.countCall = "ヶ所目";			//呼び方
		this.inputGuide = "部屋・エリア・機器ごとの照明の使い方について";		//入力欄でのガイド

		this.measureName = [
			"mLIcull", //	蛍光管の間引きをする
			"mLInotbulb", //	シャンデリア照明を使わない
			"mLILED", //	従来型蛍光灯を省エネ型に付け替える
			"mLImercu2LED", //	水銀灯をLEDに取り替える
			"mLIspot2LED", //	スポットライトをLEDタイプに変える
			"mLIbulb2LED", //	電球・ハロゲン照明をLEDに
			"mLItask", //	手元照明を設置して全体照明を控える
			"mLIarea", //	
			"mLIwindowswitch", //	窓側照明の回路をつくり、昼間に消す
			"mLIemargency", //	避難誘導灯を省エネ型に付け替える
			"mLInoperson", //	不在時の消灯を徹底する
			"mLInotuse", //	不要な場所の消灯をする
			"mLInotusearea" //	使用していないエリアの消灯をする

		];
	}

	//照明消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.lightType = this.input("i511" + this.subID, -1);	//照明の種類
		this.watt = this.input("i512" + this.subID, 0);		//照明の消費電力
		this.num = this.input("i513" + this.subID, 1);			//照明器具の数
		this.lightTime = this.input("i514" + this.subID, D6.consShow["LI"].lightTime);		//照明時間

		//月の消費電力量　kWh/月
		this.electricity = this.watt * this.num * this.lightTime * 30 / 1000;
	}


	//対策計算
	calcMeasure() {
		if (this.subID == 0 && this.electriity < this.sumCons.electricity * 0.6) return;

		this.measures['mLIcull'].calcReduceRate(0.13); // 蛍光管の間引きをする
		if (this.type == 4 || this.type == 6) {
			this.measures['mLInotbulb'].calcReduceRate(0.9); // シャンデリア照明を使わない
		}
		if (this.type == 1) {
			this.measures['mLILED'].calcReduceRate(0.5); // 従来型蛍光灯をLEDに付け替える
			this.measures['mLIhf'].calcReduceRate(0.3); // 従来型蛍光灯を省エネ型に付け替える
		}
		if (this.type == 5) {
			this.measures['mLImercu2LED'].calcReduceRate(0.5); // 水銀灯をLEDに取り替える
		}
		if (this.type == 4) {
			this.measures['mLIspot2LED'].calcReduceRate(0.8); // スポットライトをLEDタイプに変える
			this.measures['mLIbulb2LED'].calcReduceRate(0.8); // 電球・ハロゲン照明をLEDに取り替える
		}
		if (this.business == 1) {
			this.measures['mLItask'].calcReduceRate(0.1); // 手元照明を設置して全体照明を控える
			this.measures['mLIarea'].calcReduceRate(0.2); // 日中に明るいエリアの照明を消す
			this.measures['mLIwindowswitch'].calcReduceRate(0.2); // 窓側照明の回路をつくり、昼間に消す
		}
		this.measures['mLIemargency'].calcReduceRate(0.01); // 避難誘導灯を省エネ型に付け替える
		this.measures['mLInoperson'].calcReduceRate(0.1); // 不在時の消灯を徹底する
		this.measures['mLInotuse'].calcReduceRate(0.1); // 不要な場所の消灯をする
		this.measures['mLInotusearea'].calcReduceRate(0.1); // 使用していないエリアの消灯をする

	}

}

