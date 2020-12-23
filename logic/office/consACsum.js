/**
* Home-Eco Diagnosis for JavaScript
* 
* consAC
* 部屋の冷暖房消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/09/05 暖房クラスに変換
*								2011/10/21 暖房簡易計算を実装
*/

D6.consACsum = new ConsBase();
DC = D6.consACsum;

//初期設定値
DC.init = function() {
	//構造設定
	this.consName = "consACsum";			//分野コード
	this.consCode = "";						//うちわけ表示のときのアクセス変数
	this.title = "空調";					//分野名として表示される名前
	this.orgCopyNum = 0;					//初期複製数（consCodeがない場合にコピー作成）
	this.sumConsName = "";					//集約先の分野コード
	this.sumCons2Name = "";					//関連の分野コード
	this.groupID = "2";						//うちわけ番号
	this.color = "#ff0000";				//表示の色
	this.countCall = "";					//呼び方
	this.inputGuide = "空調全般について";		//入力欄でのガイド

	this.measureName = [
		"mACfilter",
		"mACairinflow",
		"mACarea",
		"mACheatcool",
		"mACcurtain",
		"mACbackyarddoor",
		"mACfrontdoor",
		"mACclosewindow",
		"mACstopcentral",
		"mACinsulationpipe"
		];
};
DC.init();


//暖房消費量計算
//
DC.calc = function() {
	this.clear();			//結果の消去

	this.floor = D6.consShow["TO"].floor;				//床面積 m2

	//１部屋目の設定を読み込む
	this.acYear  = this.input( "i2151", 6 );	//エアコン使用年数
	this.acPerf  = this.input( "i2161", 2 );	//エアコン省エネ型1　でない2
	this.acFilter  = this.input( "i2171",　-1 );	//フィルター掃除
	this.door  = this.input( "i2311" ,　-1 );	//扉の状態

	this.centralcontrol  = this.input( "i201" ,　-1 );	//全館空調
	this.roomset  = this.input( "i202" ,　-1 );	//部屋設定

	this.coolmonth  = this.input( "i008" ,　6 );	//冷房期間
	this.heatmonth  = this.input( "i007" ,　4 );	//暖房期間

};

DC.calc2nd = function( ) {
	//冷房と暖房の加算
	this.acHeat = D6.consListByName["consHTsum"][0];
	this.acCool = D6.consListByName["consCOsum"][0];
	this.copy( this.acHeat );
	this.add( this.acCool );

	//分割同士の結合の場合には自動化できないのでここで定義する
	this.partCons[0] = this.acHeat;
	this.partCons[1] = this.acCool;
};

//対策計算
DC.calcMeasure = function() {
	this.measures["mACfilter"].calcReduceRateWithParts(0.05,this.partCons);	//	フィルターの掃除をする
	this.measures["mACairinflow"].calcReduceRateWithParts(0.03,this.partCons);	//	空気取り入れ量を必要最小に押さえる
	if ( this.floor > 50 ) {
		this.measures["mACarea"].calcReduceRateWithParts(0.10,this.partCons);	//	使用していないエリアの空調を停止する		
	}
	if ( this.coolmonth + this.heatmonth > 9 ){
		this.measures["mACheatcool"].calcReduceRateWithParts(0.03 * (this.coolmonth + this.heatmonth - 9 ),this.partCons);	//	暖房と冷房を同時に使用しないようにする
	}
	if ( this.door == 1 ) {
		this.measures["mACcurtain"].calcReduceRateWithParts(0.04,this.partCons);	//	店舗の開放された入り口に透明カーテンをとりつける
		this.measures["mACfrontdoor"].calcReduceRateWithParts(0.1,this.partCons);	//	冷暖房時は店舗の入り口の扉を閉めておく
		this.measures["mACbackyarddoor"].calcReduceRateWithParts(0.05,this.partCons);	//	搬入口やバックヤードの扉を閉める
	}
	this.measures["mACclosewindow"].calcReduceRateWithParts(0.02,this.partCons);	//	冷暖房機の空調運転開始時に、外気の取り入れをカットする

	if ( this.centralcontrol != 2 || this.roomset != 2 ){
		this.measures["mACstopcentral"].calcReduceRateWithParts(0.12,this.partCons);	//	セントラル空調をやめて、ユニット式のエアコンにする
	}
	this.measures["mACinsulationpipe"].calcReduceRateWithParts(0.02,this.partCons);	//	室外機のパイプの断熱をしなおす
};




