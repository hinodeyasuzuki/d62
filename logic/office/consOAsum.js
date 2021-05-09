/**
* Home-Eco Diagnosis for JavaScript
* 
* ConsOAsum
* OA機器全体消費量
* 
* @author Yasufumi SUZUKI 	2011/01/21 diagnosis5
*								2011/05/06 actionscript3
*								2011/08/23 strategyとして整理
*								2011/10/21 テレビ簡易計算を実装
*								2012/08/27 switch形式に変更
*/


class ConsOAsum extends ConsBase {
	//初期設定値
	constructor() {
		super();

		this.wattDesktop = 150;					//W
		this.wattNotebook = 20;					//W
		this.wattPrinter = 200;					//W
		this.wattServerRoom = 5000;					//W

		this.reduceRateRadio = 0.8;			//ラジオにすることによる削減率
		this.reduceRateBright = 0.2;		//明るさを調整することによる削減率

		//構造設定
		this.consName = "consOAsum";		//分野コード
		this.consCode = "OA";				//うちわけ表示のときのアクセス変数
		this.title = "OA機器";				//分野名として表示される名前
		this.orgCopyNum = 0;				//初期複製数（consCodeがない場合にはこの分のコピーが作成）
		this.sumConsName = "consTotal";		//集約先の分野コード
		this.sumCons2Name = "";				//関連の分野コード
		this.groupID = "7";					//うちわけ番号
		this.color = "#00ff00";			//表示の色
		this.inputGuide = "OA機器の使い方について";		//入力欄でのガイド

		this.measureName = [
			"mOAstanby",
			"mOAsavemode",
			"mOAconsent",
			"mOAtoilettemplature",
			"mOAtoiletcover"
		];
	}

	//OA消費量計算
	calc() {

		this.clear();			//結果の消去

		//入力値の読み込み
		this.business = D6.consShow["TO"].business;			//業種
		this.floor = D6.consShow["TO"].floor;				//床面積 m2
		this.workTime = D6.consShow["TO"].workTime;			//業務時間
		this.workDay = D6.consShow["TO"].workDay;			//週日数

		this.desktop = this.input('i601',
			Math.round((this.business == 1 ? 1 : 0.1) * this.floor / 50));
		//'デスクトップパソコン台数',
		this.notebook = this.input('i602',
			Math.round((this.business == 1 ? 5 : 0.5) * this.floor / 50));
		//'ノートパソコン台数',
		this.printer = this.input('i603',
			Math.round((this.business == 1 ? 1 : 0.1) * this.floor / 50));
		//'プリンタ・コピー機台数',
		this.serverRoom = this.input('i604', 2);	//'サーバールーム',
		this.pcStop = this.input('i621', -1);	//'非使用時のパソコンの休止設定の徹底',
		this.printerStop = this.input('i622', -1);	//'プリンタ・コピー機の休止モード活用',

		//月の消費電力量　kWh/月
		var calckwh = this.workTime * this.workDay / 7 * 30 / 1000;
		this.elecDesktop = this.desktop * this.wattDesktop * calckwh;
		this.elecNotebook = this.notebook * this.wattNotebook * calckwh;
		this.elecPrinter = this.printer * this.wattPrinter * calckwh;

		this.electricity = this.elecDesktop + this.elecNotebook + this.elecPrinter
			+ (this.serverRoom == 1 ? this.wattServerRoom * 24 : 0) * 30 / 1000;

	}

	//対策計算
	calcMeasure() {
		this.measures["mOAstanby"].calcReduceRate(0.1 * (this.elecDesktop + this.elecNotebook) / this.electricity);
		//	長時間席を離れるときにはOA機器をスタンバイモードにする
		this.measures["mOAsavemode"].calcReduceRate(0.1 * this.elecPrinter / this.electricity);
		//	コピー機の節電モードを活用するs
		this.measures["mOAconsent"].calcReduceRate(0.02);	//	使っていない機器のコンセントから抜いておく
		this.measures["mOAtoilettemplature"].calcReduceRate(0.01);	//	温水便座の温度設定を控えめにする
		this.measures["mOAtoiletcover"].calcReduceRate(0.01);	//	温水便座の不使用時はふたを閉める
	}

}