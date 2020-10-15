/**
* Home-Eco Diagnosis for JavaScript
* 
* consRM
* 部屋設定
* 
* @author Yasufumi SUZUKI 	2016/06/09
*/

D6.consRM = Object.create( ConsBase );
DC = D6.consRM;

//初期設定値
DC.init = function() {
	//構造設定
	this.consName = "consRM";			//分野コード
	this.consCode = "";						//うちわけ表示のときのアクセス変数
	this.title = "";						//分野名として表示される名前
	this.orgCopyNum = 1;					//初期複製数（consCodeがない場合にコピー作成）
	this.addable = "エリア";		//追加可能
	this.sumConsName = "";					//集約先の分野コード
	this.sumCons2Name = "consTotal";		//関連の分野コード
	this.inputDisp = "consTotal";			//入力欄を表示する分野コード
	this.groupID = "2";						//うちわけ番号
	this.color = "#ff0000";				//表示の色
	this.countCall = "エリア目";			//呼び方
	this.inputGuide = "部屋・エリアの名前について。冷暖房のエリア名としても使われます。";		//入力欄でのガイド

	this.measureName = [
	];
	this.consAddSet = [
		"consHT",
		"consCO"
	];
};
DC.init();


//暖房消費量計算
//
DC.calc = function() {
	this.clear();			//結果の消去

};


//対策計算
DC.calcMeasure = function() {
};




