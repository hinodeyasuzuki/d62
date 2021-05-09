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


class ConsCRsum extends ConsBase {
	//初期設定値
	constructor() {
		super();
		this.performanceNow = 10;			//保有機種の燃費
		this.performanceNew = 25;			//高性能機種の燃費
		this.publicRate = 0.6;				//公共交通が使える率
		this.walkRate = 0.2;				//徒歩自転車が使える率

		this.reduceRateEcoDrive = 0.15;		//エコドライブの削減率
		this.reduceRatePublic = 0.7;		//公共交通の削減率（バスを想定）
		this.reduceRateHalf = 0.5;			//交通半減による削減率

		//構造設定
		this.consName = "consCRsum";			//分野コード
		this.consCode = "CR";					//うちわけ表示のときのアクセス変数
		this.title = "移動輸送";				//分野名として表示される名前
		this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にコピー作成）
		this.sumConsName = "consTotal";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "8";					//うちわけ番号
		this.color = "#ee82ee";			//表示の色
		this.countCall = "";			//呼び方
		this.inputGuide = "車両の使い方について";		//入力欄でのガイド

		this.measureName = [
			"mCRecodrive"
		];
	}

	//車消費量計算
	calc() {
		this.clear();			//結果の消去

		//入力値の読み込み
		this.car = D6.consShow["TO"].car;
		//移動先からの加算でのみ追加する
	}

	calc2nd() {
	}

	//車対策計算
	calcMeasure() {
		this.measures["mCRecodrive"].calcReduceRate(0.1);	//		エコドライブを実践する
	}

}