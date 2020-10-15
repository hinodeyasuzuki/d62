/**
* Home-Eco Diagnosis for JavaScript
* 
* consSeason
* シーズン設定
* 
* @author Yasufumi SUZUKI 	2016/06/09
*/

D6.consSeason = Object.create( ConsBase );
DC = D6.consSeason;

//初期設定値
DC.init = function() {
	this.titleList = ["","冬","春秋","夏"];

	//構造設定
	this.consName = "consSeason";			//分野コード
	this.consCode = "";						//うちわけ表示のときのアクセス変数
	this.title = "";						//分野名として表示される名前
	this.orgCopyNum = 3;					//初期複製数（consCodeがない場合にコピー作成）
	this.sumConsName = "";					//集約先の分野コード
	this.sumCons2Name = "consTotal";		//関連の分野コード
	this.inputDisp = "consTotal";			//入力欄を表示する分野コード
	this.groupID = "2";						//うちわけ番号
	this.color = "#ff0000";				//表示の色
	this.countCall = "";					//呼び方
	this.inputGuide = "季節ごとのエネルギーの使い方、1ヶ月あたりの光熱費。";		//入力欄でのガイド

	this.measureName = [
	];
	this.partConsName = [
	];
};
DC.init();


//消費量計算
//
DC.calc = function() {
	this.clear();			//結果の消去
};


//対策計算
DC.calcMeasure = function() {
};




