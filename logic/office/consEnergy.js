/**
* Home-Eco Diagnosis for JavaScript
* 
* consEnergy
* 全体エネルギー概要入力設定
* 
* @author Yasufumi SUZUKI 	2016/06/09
*/

class ConsEnergy extends ConsBase {
	//初期設定値
	constructor() {
		super();

		//構造設定
		this.consName = "consEnergy";			//分野コード
		this.consCode = "";						//うちわけ表示のときのアクセス変数
		this.title = "全般エネルギー設定";				//分野名として表示される名前
		this.orgCopyNum = 0;					//初期複製数（consCodeがない場合にコピー作成）
		this.sumConsName = "";					//集約先の分野コード
		this.sumCons2Name = "";					//関連の分野コード
		this.inputDisp = "consTotal";			//入力欄を表示する分野コード(入力欄としてのみ使用)
		this.groupID = "0";						//うちわけ番号
		this.color = "#ff0000";				//表示の色
		this.countCall = "";					//呼び方
		this.inputGuide = "エネルギーの基本設定の使い方について";		//入力欄でのガイド

		this.measureName = [
		];
		this.partConsName = [		//	このクラスを増加させたときに、あわせて増加するクラス
		];
	}

	//消費量計算
	calc() {
		this.clear();			//結果の消去
	}

	//対策計算
	calcMeasure() {
	}

}

