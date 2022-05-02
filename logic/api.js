/* amazon lambda  set d6home.min.js d6home_XX_min.js */

//  set.add[]  {consCode, count}  consName分野をcount個追加する(初期値1）
//  set.inp[]  {inputCode, value} inputCodeの値をvalueに設定する
//  set.measureadd[] num          対策番号num を選択する

//  get.target          分野consName　文字がなければ　consTotal
//  get.common          1           共通
//  get.monthly         1           月の消費詳細
//  get.average         1           平均値
//  get.average_graph   1           グラフ作成用平均値
//  get.itemize         1           うちわけ
//  get.itemize_graph   1           グラフ作成用うちわけ
//  get.measure         1           分野の対策（最大15項目）
//  get.measure_all     1           分野対策すべて
//  get.measure_detail  measureID   measureIDの詳細を取得

//  get.inputpage       1 or subconsName    入力コンポーネント生成 

//対策の最大数の制限
function maxmeasure(n){
	if ( ret.measure.length <= n ) return;
	for( var i=ret.measure.length-1 ; i>=n ; i-- ){
		delete ret.measure[i];
	}
}

//基本構造構築
D6.construct();

//構造の変更
var key, key2;
if( cmd.set.add ) {
	for( key in cmd.set.add ){
		for( key2 in cmd.set.add[key]){
			D6.addConsSetting(key);
		}
	}
}

//変数の設定
if( cmd.set.inp ) {
	for( key in cmd.set.inp ){
		D6.inSet(key,cmd.set.inp[key]);
	}
}

//計算
D6.calculateAll();

//対策の追加
if( cmd.set.measureadd ) {
	for( key in cmd.set.measureadd ){
		D6.measureAdd( cmd.set.measureadd[key] );
	}
	D6.calcMeasures(-1);
}

//取得データ
var ret = {};
if ( cmd.get.all ){
	ret = D6.getAllResult();
	//maxmeasure(15);
} else {
	//個別の取得
	if ( cmd.get.target.substr(0,4) != "cons" ) cmd.get.target = "consTotal";
	if( cmd.get.common){
		ret.common = D6.getCommonParameters();
	}
	if( cmd.get.monthly){
		ret.monthly = D6.getMonthly();
	}
	if( cmd.get.average ){
		ret.average = this.getAverage(cmd.get.target);
	}
	if( cmd.get.average_graph ){
		ret.average_graph = this.getAverage_graph();
	}
	if( cmd.get.itemize ){
		ret.itemize = this.getItemize(cmd.get.target);
	}
	if( cmd.get.itemize_graph ){
		ret.itemize_graph = this.getItemizeGraph(cmd.get.target);
	}
	if( cmd.get.measure ){
		ret.measure = this.getMeasure(cmd.get.target);
		//maxmeasure(15);
	}
	if( cmd.get.measure_all ){
		ret.measure = this.getMeasure(cmd.get.target);
	}
	if( cmd.get.measure_detail ){
		ret.measure_detail = D6.getMeasureDetail( cmd.get.detail );	
	}
	if( cmd.get.input_page ){
		if ( cmd.get.input_page.substr(0,4) != "cons" ) cmd.get.input_page = cmd.get.target;
		ret.input_page = D6.getInputPage( cmd.get.target, cmd.get.target );	
	}
}

done(null ,ret);

