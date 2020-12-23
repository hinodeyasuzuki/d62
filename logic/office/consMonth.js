/**
* Home-Eco Diagnosis for JavaScript
* 
* consMonth
* 月・シーズン設定
* 
* @author Yasufumi SUZUKI 	2016/06/09
*/

D6.consMonth = new ConsBase();
DC = D6.consMonth;

//初期設定値
DC.init = function() {
	//構造設定
	this.consName = "consMonth";			//分野コード
	this.consCode = "";						//うちわけ表示のときのアクセス変数
	this.title = "";						//分野名として表示される名前
	this.orgCopyNum = 12;					//初期複製数（consCodeがない場合にコピー作成）
		//1-12月
	this.sumConsName = "";					//集約先の分野コード
	this.sumCons2Name = "consTotal";		//関連の分野コード
	this.inputDisp = "consTotal";			//入力欄を表示する分野コード
	this.groupID = "2";						//うちわけ番号
	this.color = "#ff0000";				//表示の色
	this.countCall = "月";					//呼び方
	this.inputGuide = "月ごとのエネルギー消費量と光熱費";		//入力欄でのガイド

	this.measureName = [
	];
	this.partConsName = [
	];
};
DC.init();


//暖房消費量計算
//
DC.calc = function() {
	this.clear();			//結果の消去
	this.title = this.subID + "月";
};


//対策計算
DC.calcMeasure = function() {
};




