/**
* Home-Eco Diagnosis for ActionScript3
* 
* consOT: consOT Class
* その他機器消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 照明簡易計算を実装
*/

D6.consOT = Object.create( D6.consOTsum );
DC = D6.consOT;

//初期設定値
DC.init =function() {
	
	//構造設定
	this.consName = "consOT";		//分野コード
	this.consCode = "";				//うちわけ表示のときのアクセス変数
	this.title = "";				//分野名として表示される名前
	this.orgCopyNum = 1;			//初期複製数（consCodeがない場合にはこの分のコピーが作成）
	this.addable = "その他機器";		//追加可能
	this.sumConsName = "consOTsum";		//集約先の分野コード
	this.sumCons2Name = "";				//関連の分野コード
	this.groupID = "6";					//うちわけ番号
	this.color = "#ffff00";				//表示の色
	this.countCall = "機種目";			//呼び方
	this.inputGuide = "機器ごとの使い方について";		//入力欄でのガイド
	
	this.measureName = [ 
	];
};
DC.init();

//照明消費量計算
DC.calc = function( ) {
	this.clear();			//結果の消去

	//入力値の読み込み
	this.kw = this.input('i899'+this.subID,0);	//'定格消費電力(kW)',
	this.num = this.input('i812'+this.subID,1);	//'台数',
	this.time = this.input('i813'+this.subID,0);	//'使用時の1日使用時間',
	this.useinyear = this.input('i814'+this.subID,0);	//'使用頻度',

	//月の消費電力量　kWh/月
	this.electricity = this.kw * this.num * this.time * this.useinyear / 12;
};


//対策計算
DC.calcMeasure = function() {

};


