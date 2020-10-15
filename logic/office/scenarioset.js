/**
* Home-Eco Diagnosis for JavaScript
* 
* D6.scenario: シナリオ設定 Class
* 
* 家庭エコ診断　シナリオ設定
* 		別のエクセルシートをもとに、診断シナリオを設定する。
*
*
* @author SUZUKI Yasufumi	2011/06/15
*							2011/10/31 対策40項目設定
*							2013/09/24 デザインパターンの整理
* 								2016/04/12 js
*/


D6.scenario =
{
	//シナリオ記述配列
	defCons : [],
	defMeasures : [],
	defEquipment : [],
	defEquipmentSize : [],
	defInput : [],
	defSelectValue : [],
	defSelectData : [],
	defQuesOrder : [],			//質問順の配列（展開前）

	//消費量計算クラスの実装
	getLogicList : function()
	{
		var logicList = new Array();
		
		//分野設定を追加した場合にはここに記述する
		logicList["consTotal"] = 	D6.consTotal;
		logicList["consEnergy"] = 	D6.consEnergy;
		logicList["consMonth"] = 	D6.consMonth;
		logicList["consSeason"] = 	D6.consSeason;
		logicList["consRM"] = 		D6.consRM;
		logicList["consHWsum"] = 	D6.consHWsum;
		logicList["consCOsum"] = 	D6.consCOsum;
		logicList["consCO"] = 		D6.consCO;
		logicList["consHTsum"] = 	D6.consHTsum;
		logicList["consHT"] = 		D6.consHT;
		logicList["consACsum"] = 	D6.consACsum;
		logicList["consAC"] = 		D6.consAC;
		logicList["consRFsum"] = 	D6.consRFsum;
		logicList["consRF"] = 		D6.consRF;
		logicList["consCKsum"] = 	D6.consCKsum;
		logicList["consLIsum"] = 	D6.consLIsum;
		logicList["consLI"] = 		D6.consLI;
		logicList["consOAsum"] = 	D6.consOAsum;
		logicList["consOTsum"] = 	D6.consOTsum;
		logicList["consOT"] = 		D6.consOT;
		logicList["consCRsum"] = 	D6.consCRsum;
		logicList["consCR"] = 		D6.consCR;
		logicList["consCRtrip"] = 	D6.consCRtrip;

		//今後の展開準備　160619
		// 定格消費電力の設定（最大でどこまでの契約になるのか）、その時点で使っている機器（現状の電力）
		// その他の機器を自由に追加できるようにする。
		//エリアごとの冷暖房等の設定を明確にする
		//冷蔵庫・照明をグループごとに登録できるようにする
		
		return logicList;
	},

	//クラス内容の定義
	setDefs : function()
	{
		var defMeasures = [];
		var defInput = [];
		var defSelectValue = [];
		var defSelectData = [];
		var defQuesOrder = [];
		var defEquipment = [];
		var defEquipmentSize = [];

		//　診断設定（表計算ソフトで設定した別ファイルからコピーする）　
		//-----------------------------

		//【１】Cons構造の定義（なし：各クラスで記述する）

		//【２】Measures構造の定義 配列の分だけ生成する
			// 0 name 		'対策コード'
			// 1 title 		'タイトル　「部屋名の×台目の」に続く文章'
			// 2 equip 		'機器コード'
			// 3 refCons 	'関連消費クラス'
			// 4 titleShort '短いタイトル'
			// 5 titleKids	'子ども向けタイトル'
			// 6 level		'診断レベル(0:常に表示、1:簡易のみ,5:詳細のみ)'
			// 7 figNum		'図番号'
			// 8 lifeTime	'寿命（年）'　数値の最後にhがついた場合は実働時間
			// 9 price		'価格'
			// 10 roanShow	'ローン'
			// 11 standardType'普及型名'
			// 12 hojoGov	'国補助'
			// 13 advice	'アドバイス'
			// 14 lifestyle	'ライフスタイル項目'
			//
			// 計算式については、該当するconsクラスのcalcMeasures関数に記述する

		defMeasures['mTOcontracthigh'] = { mid:'1',  name:'mTOcontracthigh',  title:'低圧契約から高圧契約に変更する',  easyness:'1',  refCons:'consTotal',  titleShort:'高圧契約に変更',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'利用する電気の量が多い場合、低圧契約から高圧契約にするほうが電力単価が安くなります。ただし、受電装置（キュービクル）を設定したり、管理者を設置する必要も出てきます。',   lifestyle:'',   season:'wss' };
		defMeasures['mTOcontracthome'] = { mid:'2',  name:'mTOcontracthome',  title:'低圧契約から従量電灯契約に変更する',  easyness:'1',  refCons:'consTotal',  titleShort:'従量電灯に変更',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'利用する電気が比較的少なく、最も多くの電気を使用する時間帯が短い場合には、従量電灯契約のほうが基本料金が安くなります。低圧電力を想定した三相交流モーター（一部のエアコンや、動力装置）については、単相200Vに対応した機器に置き換える必要があります。',   lifestyle:'',   season:'wss' };
		defMeasures['mTOcontractequip'] = { mid:'3',  name:'mTOcontractequip',  title:'使っていない機器分の契約更新をする',  easyness:'1',  refCons:'consTotal',  titleShort:'機器契約見直し',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'低圧契約では、保有する機器の消費電力の合計値で基本料金が決まる契約方法があります。以前の契約時から、機器を使用しなくなった場合や、省エネ型機器に置き換えた場合には、届け出により基本料金を安くできます。',   lifestyle:'',   season:'wss' };
		defMeasures['mTOcontractbreaker'] = { mid:'4',  name:'mTOcontractbreaker',  title:'負荷設備量ではなく、契約主開閉器（ブレーカー）による契約に変更する',  easyness:'1',  refCons:'consTotal',  titleShort:'ブレーカー契約に変更',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'低圧契約では、保有する機器の消費電力の合計値で基本料金が決まる契約方法があります。複数の機器を同時に使用しない場合には、ブレーカー契約にすることで削減になる場合があります。',   lifestyle:'',   season:'wss' };
		defMeasures['mTOcontractintegrated'] = { mid:'5',  name:'mTOcontractintegrated',  title:'低圧＋従量電灯から、低圧総合電力に変更する',  easyness:'1',  refCons:'consTotal',  titleShort:'低圧総合契約に変更',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'電力会社によっては、低圧電力と従量電灯を合わせた契約形態がある場合があります。別に契約するより、合わせたほうが電気を有効に使えたり、価格を下げたりすることができる場合があります。',   lifestyle:'',   season:'wss' };
		defMeasures['mTOdemand'] = { mid:'6',  name:'mTOdemand',  title:'デマンドコントロールを行う',  easyness:'1',  refCons:'consTotal',  titleShort:'デマンドコントロール',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'500000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mTOreducetranse'] = { mid:'7',  name:'mTOreducetranse',  title:'変圧器の負荷を集約し、稼働台数を減らす',  easyness:'1',  refCons:'consTotal',  titleShort:'変圧器削減',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mTOpeakgenerator'] = { mid:'8',  name:'mTOpeakgenerator',  title:'電力ピーク時間帯の自家発電装置の導入(3kVA)',  easyness:'1',  refCons:'consTotal',  titleShort:'ピーク時の自家発電利用',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'100000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'低圧のブレーカー容量契約の場合、ピーク時の消費電力に応じて12ヶ月の基本料金が決まります。ピーク時の時間が限られている場合、自家発電装置を用意し、ピーク時間帯に発電でまかなうことで、基本料金の削減になります。',   lifestyle:'',   season:'wss' };
		defMeasures['mTOpeakcut'] = { mid:'9',  name:'mTOpeakcut',  title:'電力ピーク時間帯に、電気利用を抑制する',  easyness:'1',  refCons:'consTotal',  titleShort:'ピークカット',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mACfilter'] = { mid:'101',  name:'mACfilter',  title:'フィルターの掃除をする',  easyness:'1',  refCons:'consACsum',  titleShort:'フィルター掃除',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'フィルターがつまっていると、冷暖気の吹き出しが弱くなり、効率が落ちます。定期的にフィルター掃除を行って下さい。',   lifestyle:'1',   season:'wss' };
		defMeasures['mACairinflow'] = { mid:'102',  name:'mACairinflow',  title:'空気取り入れ量を必要最小に押さえる',  easyness:'1',  refCons:'consACsum',  titleShort:'空気取り入れ制御',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'空調をしているときには、換気はなるべく最小限に抑えることで、冷暖気の漏れが少なくなります。ただし、二酸化炭素濃度など、基準を超えないよう、運用には注意を払って下さい。',   lifestyle:'1',   season:'wss' };
		defMeasures['mACarea'] = { mid:'103',  name:'mACarea',  title:'使用していないエリアの空調を停止する',  easyness:'1',  refCons:'consACsum',  titleShort:'空調エリア制限',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'人が入らないエリアや、保管において空調が必要ない場合には、空調を止めることで省エネになります。',   lifestyle:'1',   season:'wss' };
		defMeasures['mACinsulationpipe'] = { mid:'104',  name:'mACinsulationpipe',  title:'室外機のパイプの断熱をしなおす',  easyness:'1',  refCons:'consACsum',  titleShort:'パイプ断熱',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'空調や温冷水の配管が断熱されていないと、熱のロスが発生します。断熱材がはがれていないかをしっかり確認してください。',   lifestyle:'1',   season:'wss' };
		defMeasures['mACreplace'] = { mid:'105',  name:'mACreplace',  title:'省エネ型のエアコンに買い換える',  easyness:'1',  refCons:'consAC',  titleShort:'省エネ型エアコン',  joyfull:'',  level:'',  figNum:'',  lifeTime:'20',  price:'300000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mACheatcool'] = { mid:'106',  name:'mACheatcool',  title:'暖房と冷房を同時に使用しないようにする',  easyness:'1',  refCons:'consACsum',  titleShort:'冷暖房同時使用確認',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'0s0' };
		defMeasures['mACcurtain'] = { mid:'107',  name:'mACcurtain',  title:'店舗の開放された入り口に透明カーテンをとりつける',  easyness:'1',  refCons:'consACsum',  titleShort:'出入口の透明カーテン',  joyfull:'',  level:'',  figNum:'',  lifeTime:'5',  price:'50000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'来客用に入り口を扉で閉めることが難しい場合、のれんのように、透明カーテンを設置することにより、冷気や暖気の漏れを減らすこともできます。透明カーテンなら、店頭から店内を見ることも可能です。',   lifestyle:'1',   season:'wss' };
		defMeasures['mACbackyarddoor'] = { mid:'108',  name:'mACbackyarddoor',  title:'搬入口やバックヤードの扉を閉める',  easyness:'1',  refCons:'consACsum',  titleShort:'バックヤード扉閉じる',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'搬入口やバックヤードも扉が常に開いていると、冷暖気が漏れる原因となります。搬入・搬出が終了するたびに、閉めるようにしてください。',   lifestyle:'1',   season:'wss' };
		defMeasures['mACfrontdoor'] = { mid:'109',  name:'mACfrontdoor',  title:'冷暖房時は店舗の入り口の扉を閉めておく',  easyness:'1',  refCons:'consACsum',  titleShort:'店舗出入口扉閉じる',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'冷暖房をしているときには、入り口の扉は閉めないと、空気の大きな漏れが生じ、消費エネルギーが大きくなります。暑い日や寒い日には、扉を閉めておくことにより、空調が効いていることをアピールすることにもつながります。',   lifestyle:'',   season:'wss' };
		defMeasures['mACclosewindow'] = { mid:'110',  name:'mACclosewindow',  title:'冷暖房機の空調運転開始時に、外気の取り入れをカットする',  easyness:'1',  refCons:'consACsum',  titleShort:'空調時の換気停止',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mACstopcentral'] = { mid:'111',  name:'mACstopcentral',  title:'セントラル空調をやめて、ユニット式のエアコンにする',  easyness:'1',  refCons:'consACsum',  titleShort:'ユニットエアコン利用',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'中央管理のエアコンよりも、部屋ごとにエアコンが設置できる場合には、そのほうが効率がよくなります。',   lifestyle:'',   season:'wss' };
		defMeasures['mHWinverter'] = { mid:'112',  name:'mHWinverter',  title:'循環水ポンプをインバータ式にする',  easyness:'1',  refCons:'consHWsum',  titleShort:'インバータ式ポンプ',  joyfull:'',  level:'',  figNum:'',  lifeTime:'20',  price:'1000000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'チラーなどの循環水を回すときに、インバーター式であれば流量調整をすることができます。温度などを管理しながら、最適な運転を行うことで、省エネにつながります。',   lifestyle:'',   season:'wss' };
		defMeasures['mHWadjust'] = { mid:'113',  name:'mHWadjust',  title:'負荷に応じてボイラーや冷凍機の運転をする',  easyness:'1',  refCons:'consHWsum',  titleShort:'熱源機負荷制御',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'冷凍機は能力に比べて低出力の場合に効率が落ちます。複数台のボイラーや冷凍機がある場合、負荷が小さいときには台数を集約することで効率があがります。',   lifestyle:'1',   season:'wss' };
		defMeasures['mHTtemplature'] = { mid:'114',  name:'mHTtemplature',  title:'暖房の設定温度を控えめにする',  easyness:'1',  refCons:'consHT',  titleShort:'暖房温度設定',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'オフィスなどの暖房の目安温度は20℃とされています。厚着をしたり、足元に毛布をかけるなどして、温かく工夫をしてみてください。ただし、個人で足元用に電熱器を置くと、かえって消費電力を増やしてしまうことにもなりかねませんので、注意してください。',   lifestyle:'1',   season:'w00' };
		defMeasures['mHTnothalogen'] = { mid:'115',  name:'mHTnothalogen',  title:'ハロゲンヒータなどの暖房を使わない',  easyness:'1',  refCons:'consHT',  titleShort:'電熱補助暖房停止',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'暖房時、足元にハロゲンヒータなどを設置すると、暖かさを補うことができますが、こうした暖房器具は消費電力が1000W近くあり、かえって電力消費を増やしてしまいます。暖気が足元へ届くようサーキュレータを回したり、ひざ掛けを使うなど、工夫をしてみてください。',   lifestyle:'',   season:'w00' };
		defMeasures['mHWairratio'] = { mid:'116',  name:'mHWairratio',  title:'ボイラーの空気比を調整する',  easyness:'1',  refCons:'consHWsum',  titleShort:'ボイラー空気比調整',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mHTwindow'] = { mid:'117',  name:'mHTwindow',  title:'外気を活用して空調を止める',  easyness:'1',  refCons:'consHT',  titleShort:'暖房時外気利用',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'冷房時にも外気温が低くなる時間帯などは、空調をとめて外気の取り入れをすることで省エネにつながります。',   lifestyle:'1',   season:'ws0' };
		defMeasures['mHTbrind'] = { mid:'118',  name:'mHTbrind',  title:'暖房時は夕方以降はブラインドを閉める',  easyness:'1',  refCons:'consHT',  titleShort:'暖房時夜ブラインド利用',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'ガラスは熱伝導率が高く、暖気が窓から逃げる割合が大きくなっています。少しでも熱のロスを減らすため、また照明の効率を高めるためにも、夕方以降はブラインドを閉めることが有効です。',   lifestyle:'1',   season:'wss' };
		defMeasures['mHWtenplature'] = { mid:'119',  name:'mHWtenplature',  title:'熱源機の温水出口温度を低めに設定する',  easyness:'1',  refCons:'consHWsum',  titleShort:'熱源機温度設定',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mCOtemplature'] = { mid:'120',  name:'mCOtemplature',  title:'冷房の設定温度を控えめにする',  easyness:'1',  refCons:'consCO',  titleShort:'冷房温度設定',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'冷房の設定温度の目安は28℃です。クールビスや、扇風機の活用などにより、温度設定を低すぎないように調整してください。',   lifestyle:'1',   season:'0ss' };
		defMeasures['mCOroof'] = { mid:'121',  name:'mCOroof',  title:'屋根面に表面反射塗料を塗る',  easyness:'1',  refCons:'consCO',  titleShort:'屋根反射塗料',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'3000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mCOwindow'] = { mid:'122',  name:'mCOwindow',  title:'外気を活用して空調を止める',  easyness:'1',  refCons:'consCO',  titleShort:'冷房時外気利用',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'0ss' };
		defMeasures['mHWwatertemplature'] = { mid:'123',  name:'mHWwatertemplature',  title:'冷凍機の冷水出口温度を高めに設定する',  easyness:'1',  refCons:'consHWsum',  titleShort:'冷水機温度設定',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mCObrind'] = { mid:'124',  name:'mCObrind',  title:'冷房時にブラインドを閉める',  easyness:'1',  refCons:'consCO',  titleShort:'ブラインド',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'日射が入ると、冷房の効率が落ちます。冷房時にはブラインドを閉めて、日射が入らないようにしてください。また、窓から冷気が逃げることがあるため、ブラインドで遮蔽する意味でも有効です。',   lifestyle:'',   season:'0ss' };
		defMeasures['mCOoutunitsolar'] = { mid:'125',  name:'mCOoutunitsolar',  title:'冷房時に室外機が直射日光に当たらないようにする',  easyness:'1',  refCons:'consCO',  titleShort:'室外機日光遮蔽',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'0ss' };
		defMeasures['mCOcurtain'] = { mid:'126',  name:'mCOcurtain',  title:'冷房時に日射を遮る',  easyness:'1',  refCons:'consCO',  titleShort:'日光遮蔽',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'0ss' };
		defMeasures['mLIcull'] = { mid:'501',  name:'mLIcull',  title:'蛍光管の間引きをする',  easyness:'1',  refCons:'consLI',  titleShort:'照明間引き',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'照度が十分にある場所については、蛍光灯の間引きをすることで省エネになります。ただし、2管セットの照明器具の場合には、片方を取り外すと点灯しなかったり、消費電力が結果的に減らない場合もあります。回路を考慮した上で、実施してください。',   lifestyle:'',   season:'wss' };
		defMeasures['mLInotbulb'] = { mid:'502',  name:'mLInotbulb',  title:'シャンデリア照明を使わない',  easyness:'1',  refCons:'consLI',  titleShort:'シャンデリア照明不使用',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mLILED'] = { mid:'503',  name:'mLILED',  title:'従来型蛍光灯をLEDに付け替える',  easyness:'1',  refCons:'consLI',  titleShort:'蛍光灯をLED化',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'30000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'蛍光灯と同じサイズのLEDが販売されています。現在の蛍光管を取り替えるタイプもありましたが、安全のために器具から付け替えるものが望ましいです。',   lifestyle:'1',   season:'wss' };
		defMeasures['mLIhf'] = { mid:'503',  name:'mLIhf',  title:'従来型蛍光灯をHf型に付け替える',  easyness:'1',  refCons:'consLI',  titleShort:'Hf式蛍光灯',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'30000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'蛍光管の太さが細いHf式の蛍光灯は、通常の蛍光灯よりも3割程度省エネとなっています。管だけをつけかることはできず、器具からのつけかえになります。',   lifestyle:'1',   season:'wss' };
		defMeasures['mLImercu2LED'] = { mid:'504',  name:'mLImercu2LED',  title:'水銀灯をLEDに取り替える',  easyness:'1',  refCons:'consLI',  titleShort:'水銀灯をLED化',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'50000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'水銀灯の代替ができるLEDが販売されています。寿命が長く、点灯させてからすぐに明るくなるのも特徴です。',   lifestyle:'1',   season:'wss' };
		defMeasures['mLIspot2LED'] = { mid:'505',  name:'mLIspot2LED',  title:'スポットライトをLEDタイプに変える',  easyness:'1',  refCons:'consLI',  titleShort:'スポット照明をLED化',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'10000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mLIbulb2LED'] = { mid:'508',  name:'mLIbulb2LED',  title:'電球・ハロゲン照明をLEDに取り替える',  easyness:'1',  refCons:'consLI',  titleShort:'電球をLED化',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'5000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mLItask'] = { mid:'507',  name:'mLItask',  title:'手元照明を設置して全体照明を控える',  easyness:'1',  refCons:'consLI',  titleShort:'タスクアンビエント照明',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mLIarea'] = { mid:'509',  name:'mLIarea',  title:'日中に明るいエリアの照明を消す',  easyness:'1',  refCons:'consLI',  titleShort:'昼間照明カット',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mLIwindowswitch'] = { mid:'510',  name:'mLIwindowswitch',  title:'窓側照明の回路をつくり、昼間に消す',  easyness:'1',  refCons:'consLI',  titleShort:'窓際スイッチ回路',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mLIemargency'] = { mid:'511',  name:'mLIemargency',  title:'避難誘導灯を省エネ型に付け替える',  easyness:'1',  refCons:'consLI',  titleShort:'誘導灯LED化',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mLInoperson'] = { mid:'512',  name:'mLInoperson',  title:'不在時の消灯を徹底する',  easyness:'1',  refCons:'consLI',  titleShort:'不在時の消灯徹底',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mLInotuse'] = { mid:'513',  name:'mLInotuse',  title:'不要な場所の消灯をする',  easyness:'1',  refCons:'consLI',  titleShort:'不要場所の消灯',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mLInotusearea'] = { mid:'514',  name:'mLInotusearea',  title:'使用していないエリアの消灯をする',  easyness:'1',  refCons:'consLI',  titleShort:'不使用エリアの消灯',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mHWshowerhead'] = { mid:'201',  name:'mHWshowerhead',  title:'節水型のシャワーヘッドに取り替える',  easyness:'1',  refCons:'consHWsum',  titleShort:'節水シャワーヘッド',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'5000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mHWheatpunp'] = { mid:'202',  name:'mHWheatpunp',  title:'ヒートポンプ式の給湯器に置き換える',  easyness:'1',  refCons:'consHWsum',  titleShort:'ヒートポンプ給湯器',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'800000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mHWcogeneration'] = { mid:'203',  name:'mHWcogeneration',  title:'コジェネに置き換える',  easyness:'1',  refCons:'consHWsum',  titleShort:'コジェネ',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'1000000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mLIcut'] = { mid:'515',  name:'mLIcut',  title:'常時消灯',  easyness:'1',  refCons:'consLIsum',  titleShort:'常時消灯',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mRFnight'] = { mid:'701',  name:'mRFnight',  title:'ナイトカバーの設置',  easyness:'1',  refCons:'consRFsum',  titleShort:'ナイトカバー',  joyfull:'',  level:'',  figNum:'',  lifeTime:'5',  price:'10000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mRFslit'] = { mid:'702',  name:'mRFslit',  title:'スリットカーテン設置',  easyness:'1',  refCons:'consRFsum',  titleShort:'スリットカーテン',  joyfull:'',  level:'',  figNum:'',  lifeTime:'5',  price:'10000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mRFcontroler'] = { mid:'703',  name:'mRFcontroler',  title:'防露ヒーターコントローラー導入',  easyness:'1',  refCons:'consRFsum',  titleShort:'防露コントローラー',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'30000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mRFdoor'] = { mid:'704',  name:'mRFdoor',  title:'スライド扉設置',  easyness:'1',  refCons:'consRFsum',  titleShort:'スライド扉設置',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'30000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mRFflow'] = { mid:'705',  name:'mRFflow',  title:'冷気の吹き出し口、吸い込み口の清掃と吸い込み口の確保',  easyness:'1',  refCons:'consRFsum',  titleShort:'空気口の確保',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'',   season:'wss' };
		defMeasures['mRFicecover'] = { mid:'706',  name:'mRFicecover',  title:'冷凍ナイトカバーの設置',  easyness:'1',  refCons:'consRFsum',  titleShort:'冷凍ナイトカバー',  joyfull:'',  level:'',  figNum:'',  lifeTime:'5',  price:'20000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mRFiceflat'] = { mid:'707',  name:'mRFiceflat',  title:'冷凍ケースを平台型に変更',  easyness:'1',  refCons:'consRFsum',  titleShort:'冷凍平台',  joyfull:'',  level:'',  figNum:'',  lifeTime:'10',  price:'400000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mOAstanby'] = { mid:'601',  name:'mOAstanby',  title:'長時間席を離れるときにはOA機器をスタンバイモードにする',  easyness:'1',  refCons:'consOAsum',  titleShort:'スタンバイモード',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'パソコンを動作状態や、画面ロック状態で動かしていると、多くの電気を消費します。すぐに復帰ができるスタンバイモードが充実してきており、少し離れるときには、スタンバイモードを活用するようにしてください。パソコンにログインした状態で席を離れると、セキュリティ的にも問題があるので、気をつけて下さい。',   lifestyle:'1',   season:'wss' };
		defMeasures['mOAsavemode'] = { mid:'602',  name:'mOAsavemode',  title:'コピー機やプリンタの節電モードを活用する',  easyness:'1',  refCons:'consOAsum',  titleShort:'コピー機節電モード',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'コピー機やプリンタは、待機時にも多くの電気を消費している場合があります。機種により、節電モードが設定できることがあり、活用をしてください。ただし、立ち上がりに多少時間がかかる場合があります。',   lifestyle:'',   season:'wss' };
		defMeasures['mOAconsent'] = { mid:'603',  name:'mOAconsent',  title:'使っていない機器のコンセントから抜いておく',  easyness:'1',  refCons:'consOAsum',  titleShort:'コンセント抜く',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mOAtoilettemplature'] = { mid:'604',  name:'mOAtoilettemplature',  title:'温水便座の温度設定を控えめにする',  easyness:'1',  refCons:'consOAsum',  titleShort:'便座温度設定',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mOAtoiletcover'] = { mid:'605',  name:'mOAtoiletcover',  title:'温水便座の不使用時はふたを閉める',  easyness:'1',  refCons:'consOAsum',  titleShort:'便座ふた',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'',   lifestyle:'1',   season:'wss' };
		defMeasures['mCRecodrive'] = { mid:'801',  name:'mCRecodrive',  title:'エコドライブを実践する',  easyness:'1',  refCons:'consCRsum',  titleShort:'エコドライブ',  joyfull:'',  level:'',  figNum:'',  lifeTime:'',  price:'',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'停車中はなるべくアイドリングストップをしたり、発進時にふんわりスタートする（5秒間かけて時速20km程度まで加速する）ことにより、燃費を1割程度向上させることができます。まわりの車を見ながら、加減速の少ない運転するなどエコドライブをすることで、安全運転にもつながります。',   lifestyle:'',   season:'wss' };
		defMeasures['mCRreplace'] = { mid:'802',  name:'mCRreplace',  title:'エコカーに買い替える',  easyness:'2',  refCons:'consCR',  titleShort:'車買い替え',  joyfull:'エコカーに買いかえる',  level:'',  figNum:'21',  lifeTime:'8',  price:'1800000',  roanShow:'',  standardType:'普及型',  hojoGov:'エコカーの導入にあたっては、「減税」のメリットが得られます。',  advice:'ハイブリッド車や電気自動車以外にも、技術改善により、既存の燃料消費が半分程度で済む低燃費車が開発されて販売されています。購入時には燃費を考慮して選んで下さい。',   lifestyle:'',   season:'wss' };
		defMeasures['mCRreplaceElec'] = { mid:'803',  name:'mCRreplaceElec',  title:'電気自動車を導入する',  easyness:'1',  refCons:'consCR',  titleShort:'電気自動車',  joyfull:'電気自動車にする',  level:'',  figNum:'',  lifeTime:'7',  price:'3000000',  roanShow:'',  standardType:'',  hojoGov:'',  advice:'ガソリンの代わりに充電式電池に電気をため、エンジンの代わりにモーターを回して走ります。エンジンに比べて効率が高く、十分実用的な車として販売がされています。ただし充電スタンドはまだ少なく、充電に時間がかかるため、夜間に充電しておくと便利です。',   lifestyle:'',   season:'wss' };

		

		//【３】入力・変数の設定
			//0	cons 画面・分野
			//1	title 設問
			//2	unit 単位
			//3	text 表示内容
			//4	inputType 入力方法   text / radio定義 / sel定義 / check定義
			//5	right テキスト右詰=1
			//6	postfix 入力処理
			//7	nodata -1のとき表示(-1)
			//8	varType 保存形式
			//9	min
			//10	max
		
		defInput['i012'] = {  cons:'consTotal',  title:'対策として重視する視点',  unit:'',  text:'どんな対策を優先的に表示しますか', inputType:'sel012', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel012']= [ '選んで下さい', 'CO2削減優先', '光熱費削減優先', '取り組みやすさ考慮', '取り組みやすさ優先', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel012']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i001'] = {  cons:'consTotal',  title:'業種',  unit:'',  text:'業種を選んで下さい', inputType:'sel001', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel001']= [ '選んで下さい', '事務所', 'スーパー', 'コンビニエンスストア', 'ほか小売・卸業', '飲食店', '旅館・ホテル', '学校', '病院', '工場', 'その他', '', '', '', '', '' ]; 			defSelectData['sel001']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '', '', '', '', '' ]; 
		defInput['i002'] = {  cons:'consTotal',  title:'営業時間',  unit:'時間/日',  text:'営業日の営業時間を選んで下さい', inputType:'sel002', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel002']= [ '選んで下さい', '6時間', '8時間', '9時間', '10時間', '11時間', '12時間', '13時間', '14時間', '15時間', '16時間', '18時間', '20時間', '24時間', '', '' ]; 			defSelectData['sel002']= [ '-1', '6', '8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '20', '24', '', '' ]; 
		defInput['i003'] = {  cons:'consTotal',  title:'週営業日',  unit:'日/週',  text:'週の営業日を選んで下さい', inputType:'sel003', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel003']= [ '選んで下さい', '3日', '4日', '5日', '6日', '7日', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel003']= [ '-1', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i004'] = {  cons:'consTotal',  title:'建物の構造',  unit:'',  text:'木造ですか鉄骨・鉄筋ですか', inputType:'sel004', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel004']= [ '選んで下さい', '木造', '鉄骨・鉄筋', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel004']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i005'] = {  cons:'consTotal',  title:'延床面積',  unit:'m2',  text:'延床面積をお答え下さい', inputType:'sel005', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel005']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel005']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i007'] = {  cons:'consHTsum',  title:'暖房する期間',  unit:'ヶ月',  text:'よく暖房を使う期間', inputType:'sel007', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel007']= [ '選んで下さい', '暖房をしない', '1ヶ月', '2ヶ月', '3ヶ月', '4ヶ月', '5ヶ月', '6ヶ月', '8ヶ月', '10ヶ月', '', '', '', '', '', '' ]; 			defSelectData['sel007']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '8', '10', '', '', '', '', '', '' ]; 
		defInput['i008'] = {  cons:'consCOsum',  title:'冷房する期間',  unit:'ヶ月',  text:'よく冷房を使う期間', inputType:'sel008', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel008']= [ '選んで下さい', '暖房をしない', '1ヶ月', '2ヶ月', '3ヶ月', '4ヶ月', '5ヶ月', '6ヶ月', '8ヶ月', '10ヶ月', '', '', '', '', '', '' ]; 			defSelectData['sel008']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '8', '10', '', '', '', '', '', '' ]; 
		defInput['i009'] = {  cons:'consTotal',  title:'客席数',  unit:'席',  text:'（飲食店の場合）客席数をお答え下さい', inputType:'sel009', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel009']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel009']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i010'] = {  cons:'consTotal',  title:'客室数',  unit:'室',  text:'（旅館・ホテルの場合）客室数をお答え下さい', inputType:'sel010', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel010']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel010']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i011'] = {  cons:'consTotal',  title:'職住一体ですか',  unit:'',  text:'職住一体ですか', inputType:'sel011', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel011']= [ '選んで下さい', '住居部分を含む', '事業分のみ', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel011']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i021'] = {  cons:'consTotal',  title:'都道府県',  unit:'',  text:'都道府県', inputType:'sel021', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel021']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel021']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i022'] = {  cons:'consTotal',  title:'太陽光の設置',  unit:'',  text:'太陽光発電装置を設置していますか', inputType:'sel022', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel022']= [ '選んで下さい', 'していない', 'している', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel022']= [ '-1', '0', '1', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i023'] = {  cons:'consTotal',  title:'太陽光のサイズ',  unit:'kW',  text:'太陽光発電装置のサイズも選んで下さい。', inputType:'sel023', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel023']= [ '選んで下さい', 'していない', 'している（～3kW）', 'している（4kW)', 'している（5kW)', 'している（6～10kW)', 'している（10kW以上）', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel023']= [ '-1', '0', '3', '4', '5', '8', '11', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i024'] = {  cons:'consTotal',  title:'太陽光発電の設置年',  unit:'',  text:'太陽光発電を設置した年', inputType:'sel024', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel024']= [ '選んで下さい', '2010年度以前', '2011-2012年度', '2013年度', '2014年度', '2015年度以降', '設置していない', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel024']= [ '-1', '2010', '2011', '2013', '2014', '2015', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i025'] = {  cons:'consEnergy',  title:'テナント料金に冷暖房代が含まれるか',  unit:'',  text:'テナント料金に冷暖房代が含まれるか', inputType:'sel025', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel025']= [ '選んで下さい', '空調はすべて共益費から出ている', '共益費による空調に加えて、独自で空調を設置している', '空調はすべて自前で払っている', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel025']= [ '-1', '0', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i026'] = {  cons:'consEnergy',  title:'電力会社',  unit:'',  text:'電力会社を選んでください', inputType:'sel026', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel026']= [ '選んで下さい', '北海道電力', '東北電力', '東京電力', '中部電力', '北陸電力', '関西電力', '中部電力', '四国電力', '九州電力', '沖縄電力', 'そのほか', '', '', '', '' ]; 			defSelectData['sel026']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '', '', '', '' ]; 
		defInput['i034'] = {  cons:'consEnergy',  title:'電気契約の種類',  unit:'',  text:'主な電力契約の種類を選んで下さい', inputType:'sel034', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel034']= [ '選んで下さい', '従量電灯A', '従量電灯BC', '時間帯別', '低圧', '低圧総合', '高圧', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel034']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i027'] = {  cons:'consEnergy',  title:'電気契約容量：従量電灯分',  unit:'kVA',  text:'従量電灯を使っている場合、契約容量を記入してください', inputType:'sel027', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel027']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel027']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i028'] = {  cons:'consEnergy',  title:'電気契約容量：従量時間帯契約',  unit:'kVA',  text:'時間帯契約を使っている場合、契約容量を記入してください', inputType:'sel028', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel028']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel028']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i029'] = {  cons:'consEnergy',  title:'電気契約容量：低圧電力分',  unit:'kW',  text:'低圧電力(200～400V）を使っている場合、契約容量を記入してください', inputType:'sel029', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel029']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel029']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i030'] = {  cons:'consEnergy',  title:'電気契約容量：低圧総合電力分',  unit:'kW',  text:'低圧総合電力(200～400Vで時間帯契約を含むもの）を使っている場合、契約容量を記入してください', inputType:'sel030', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel030']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel030']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i031'] = {  cons:'consEnergy',  title:'電気契約容量：高圧電力分',  unit:'kW',  text:'高圧電力(6600V）を使っている場合、契約容量を記入してください', inputType:'sel031', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel031']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel031']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i032'] = {  cons:'consEnergy',  title:'ガス種類',  unit:'',  text:'ガスの種類を選んでください', inputType:'sel032', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel032']= [ '選んで下さい', '都市ガス', 'LPガス', 'ガスを使わない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel032']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i033'] = {  cons:'consEnergy',  title:'重油の種類',  unit:'',  text:'重油の種類を選んでください', inputType:'sel033', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel033']= [ '選んで下さい', 'A重油', 'B・C重油', '重油は使用しない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel033']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i041'] = {  cons:'consEnergy',  title:'平均の月電気代',  unit:'円/月',  text:'平均の月電気代', inputType:'sel041', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel041']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel041']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i042'] = {  cons:'consEnergy',  title:'平均の月ガス代',  unit:'円/月',  text:'平均の月ガス代', inputType:'sel042', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel042']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel042']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i043'] = {  cons:'consEnergy',  title:'平均の月灯油代',  unit:'円/月',  text:'平均の月灯油代', inputType:'sel043', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel043']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel043']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i044'] = {  cons:'consEnergy',  title:'平均の月ガソリン代',  unit:'円/月',  text:'平均の月ガソリン代', inputType:'sel044', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel044']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel044']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i045'] = {  cons:'consEnergy',  title:'平均の月重油料金',  unit:'円/月',  text:'平均の月重油料金', inputType:'sel045', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel045']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel045']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i051'] = {  cons:'consEnergy',  title:'平均の月電気消費量',  unit:'kWh/月',  text:'平均の月電気消費量', inputType:'sel051', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel051']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel051']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i052'] = {  cons:'consEnergy',  title:'平均の月ガス消費量',  unit:'m3/月',  text:'平均の月ガス消費量', inputType:'sel052', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel052']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel052']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i053'] = {  cons:'consEnergy',  title:'平均の月灯油消費量',  unit:'L/月',  text:'平均の月灯油消費量', inputType:'sel053', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel053']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel053']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i054'] = {  cons:'consEnergy',  title:'平均の月ガソリン消費量',  unit:'L/月',  text:'平均の月ガソリン消費量', inputType:'sel054', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel054']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel054']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i055'] = {  cons:'consEnergy',  title:'平均の月重油消費量',  unit:'L/月',  text:'平均の月重油消費量', inputType:'sel055', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel055']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel055']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i056'] = {  cons:'consElecTime',  title:'時間帯電気消費量',  unit:'kWｈ/時',  text:'時間帯電気消費量', inputType:'sel056', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel056']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel056']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i061'] = {  cons:'consSeason',  title:'月電気代',  unit:'円/月',  text:'月電気代', inputType:'sel061', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel061']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel061']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i062'] = {  cons:'consSeason',  title:'月ガス代',  unit:'円/月',  text:'月ガス代', inputType:'sel062', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel062']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel062']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i063'] = {  cons:'consSeason',  title:'月灯油代',  unit:'円/月',  text:'月灯油代', inputType:'sel063', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel063']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel063']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i064'] = {  cons:'consSeason',  title:'月ガソリン代',  unit:'円/月',  text:'月ガソリン代', inputType:'sel064', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel064']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel064']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i065'] = {  cons:'consSeason',  title:'月重油料金',  unit:'円/月',  text:'月重油料金', inputType:'sel065', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel065']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel065']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i071'] = {  cons:'consMonth',  title:'月電気代',  unit:'円/月',  text:'月電気代', inputType:'sel071', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel071']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel071']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i072'] = {  cons:'consMonth',  title:'月ガス代',  unit:'円/月',  text:'月ガス代', inputType:'sel072', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel072']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel072']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i073'] = {  cons:'consMonth',  title:'月灯油代',  unit:'円/月',  text:'月灯油代', inputType:'sel073', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel073']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel073']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i074'] = {  cons:'consMonth',  title:'月ガソリン代',  unit:'円/月',  text:'月ガソリン代', inputType:'sel074', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel074']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel074']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i075'] = {  cons:'consMonth',  title:'月重油料金',  unit:'円/月',  text:'月重油料金', inputType:'sel075', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel075']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel075']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i081'] = {  cons:'consMonth',  title:'月電気消費量',  unit:'kWh/月',  text:'月電気消費量', inputType:'sel081', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel081']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel081']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i082'] = {  cons:'consMonth',  title:'月ガス消費量',  unit:'m3/月',  text:'月ガス消費量', inputType:'sel082', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel082']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel082']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i083'] = {  cons:'consMonth',  title:'月灯油消費量',  unit:'L/月',  text:'月灯油消費量', inputType:'sel083', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel083']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel083']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i084'] = {  cons:'consMonth',  title:'月ガソリン消費量',  unit:'L/月',  text:'月ガソリン消費量', inputType:'sel084', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel084']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel084']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i085'] = {  cons:'consMonth',  title:'月重油消費量',  unit:'L/月',  text:'月重油消費量', inputType:'sel085', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel085']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel085']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i091'] = {  cons:'consRM',  title:'部屋名',  unit:'',  text:'部屋や用途区分ができるエリアの名前を記入してください', inputType:'sel091', right:'', postfix:'', demand:'', varType:'String', min:'', max:'', defaultValue:''}; 			defSelectValue['sel091']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel091']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i092'] = {  cons:'consRM',  title:'床面積',  unit:'m2',  text:'そのエリアの面積をお答え下さい(m2)', inputType:'sel092', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel092']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel092']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i093'] = {  cons:'consRM',  title:'主な用途',  unit:'',  text:'そのエリア・部屋の主な用途をお答え下さい', inputType:'sel093', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel093']= [ '選んで下さい', '事務所・控室', '来客者用・店舗', '倉庫・バックヤード', '工場', 'その他', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel093']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i101'] = {  cons:'consHWsum',  title:'暖房・温水用熱源機の種類',  unit:'',  text:'温水暖房もしくは給湯用の熱源機の種類を選んで下さい', inputType:'sel101', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel101']= [ '選んで下さい', '電熱', '電気ヒートポンプ', 'ガス', 'ガスコジェネ', '灯油', '重油', '太陽熱', '薪', 'ない', '', '', '', '', '', '' ]; 			defSelectData['sel101']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '', '', '', '', '', '', '' ]; 
		defInput['i102'] = {  cons:'consHWsum',  title:'客室への風呂設置',  unit:'',  text:'客室に浴室が設置されていますか', inputType:'sel102', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:''}; 			defSelectValue['sel102']= [ '選んで下さい', 'すべてある', '半分程度ある', '一部ある', 'ない', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel102']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i103'] = {  cons:'consHWsum',  title:'大浴場',  unit:'',  text:'大浴場はありますか', inputType:'sel103', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel103']= [ '選んで下さい', 'ある', 'ない', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel103']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i104'] = {  cons:'consHWsum',  title:'シャワー利用者数',  unit:'人/日',  text:'シャワーの利用者数', inputType:'sel104', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel104']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel104']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i105'] = {  cons:'consHWsum',  title:'調理の食事提供数',  unit:'食/日',  text:'何食提供をしていますか', inputType:'sel105', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel105']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel105']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i201'] = {  cons:'consCOsum',  title:'空調設定区分',  unit:'',  text:'中央での一括管理ですか、部屋ごとに設定ができますか', inputType:'sel201', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel201']= [ '選んで下さい', '中央管理', '部屋での設定', '併用可能', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel201']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i202'] = {  cons:'consCOsum',  title:'空調設定操作場所',  unit:'',  text:'温度操作は、部屋でできますか', inputType:'sel202', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel202']= [ '選んで下さい', '全館一括', '個別設定', '併用可能', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel202']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i203'] = {  cons:'consHTsum',  title:'全体の暖房熱源',  unit:'',  text:'全体の暖房熱源', inputType:'sel203', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel203']= [ '選んで下さい', 'エアコン', '電気熱暖房', 'ガス', '灯油', '重油', '薪・ペレット', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel203']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i204'] = {  cons:'consCOsum',  title:'全体の冷房の熱源',  unit:'',  text:'全体の冷房の熱源', inputType:'sel204', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel204']= [ '選んで下さい', '電気', 'ガス', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel204']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i205'] = {  cons:'consHTsum',  title:'全体の暖房管理温度',  unit:'℃',  text:'全体の暖房管理温度', inputType:'sel205', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel205']= [ '選んで下さい', '使わない', '18℃', '19℃', '20℃', '21℃', '22℃', '23℃', '24℃', '25℃', '26℃以上', '', '', '', '', '' ]; 			defSelectData['sel205']= [ '-1', '0', '18', '19', '20', '21', '22', '23', '24', '25', '26', '', '', '', '', '' ]; 
		defInput['i206'] = {  cons:'consCOsum',  title:'全体の冷房管理温度',  unit:'℃',  text:'全体の冷房管理温度', inputType:'sel206', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel206']= [ '選んで下さい', '24℃以下', '25℃', '26℃', '27℃', '28℃', '29℃', '30℃', '使わない', '', '', '', '', '', '', '' ]; 			defSelectData['sel206']= [ '-1', '24', '25', '26', '27', '28', '29', '30', '0', '', '', '', '', '', '', '' ]; 
		defInput['i211'] = {  cons:'consHT',  title:'暖房管理温度',  unit:'℃',  text:'暖房管理温度', inputType:'sel211', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel211']= [ '選んで下さい', '使わない', '18℃', '19℃', '20℃', '21℃', '22℃', '23℃', '24℃', '25℃', '26℃以上', '', '', '', '', '' ]; 			defSelectData['sel211']= [ '-1', '0', '18', '19', '20', '21', '22', '23', '24', '25', '26', '', '', '', '', '' ]; 
		defInput['i212'] = {  cons:'consHT',  title:'暖房器具',  unit:'',  text:'暖房器具', inputType:'sel212', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel212']= [ '選んで下さい', 'エアコン', '電気熱暖房', 'ガス', '灯油', '重油', '薪・ペレット', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel212']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i213'] = {  cons:'consHT',  title:'補助暖房の熱源',  unit:'',  text:'補助暖房の熱源', inputType:'sel213', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel213']= [ '選んで下さい', '電気ヒータ', 'ガス', '灯油', '使わない', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel213']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i214'] = {  cons:'consCO',  title:'冷房管理温度',  unit:'℃',  text:'冷房管理温度', inputType:'sel214', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel214']= [ '選んで下さい', '24℃以下', '25℃', '26℃', '27℃', '28℃', '29℃', '30℃', '使わない', '', '', '', '', '', '', '' ]; 			defSelectData['sel214']= [ '-1', '24', '25', '26', '27', '28', '29', '30', '0', '', '', '', '', '', '', '' ]; 
		defInput['i215'] = {  cons:'consCo',  title:'エアコンの定格消費電力（kW)',  unit:'kW',  text:'複数台ある場合には、合計の最大定格消費電力を記入してください。', inputType:'sel215', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel215']= [ '選んで下さい', '持っていない', '1年未満', '3年未満', '5年未満', '7年未満', '10年未満', '15年未満', '20年未満', '20年以上', '', '', '', '', '', '' ]; 			defSelectData['sel215']= [ '-1', '0', '1', '2', '4', '6', '9', '13', '18', '25', '', '', '', '', '', '' ]; 
		defInput['i216'] = {  cons:'consCo',  title:'エアコンの使用年数',  unit:'年',  text:'エアコンの使用年数', inputType:'sel216', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel216']= [ '選んで下さい', '持っていない', '1年未満', '3年未満', '5年未満', '7年未満', '10年未満', '15年未満', '20年未満', '20年以上', '', '', '', '', '', '' ]; 			defSelectData['sel216']= [ '-1', '0', '1', '2', '4', '6', '9', '13', '18', '25', '', '', '', '', '', '' ]; 
		defInput['i217'] = {  cons:'consCO',  title:'夏の西日',  unit:'',  text:'夏に西日が窓にあたりますか', inputType:'sel217', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel217']= [ '選んで下さい', 'よく入る', '少しはいる', 'あまり入らない', '対策済み', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel217']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i218'] = {  cons:'consCO',  title:'部屋の上が屋根',  unit:'',  text:'この部屋の上が屋根面にあたりますか', inputType:'sel218', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel218']= [ '選んで下さい', 'はい', 'いいえ', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel218']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i219'] = {  cons:'consHT',  title:'夜間にはカーテンやブラインドを閉めていますか',  unit:'',  text:'夜間にはカーテンやブラインドを閉めていますか', inputType:'sel219', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel219']= [ '選んで下さい', 'はい', 'いいえ', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel219']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i231'] = {  cons:'consCOsum',  title:'店舗の冷暖房時の入り口の開放対策',  unit:'',  text:'店舗の冷暖房時の入り口の開放対策', inputType:'sel231', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel231']= [ '選んで下さい', '開けっ放し', '自動ドア', 'のれん等を設置', '閉めている', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel231']= [ '-1', '1', '2', '3', '4', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i232'] = {  cons:'consCOsum',  title:'室外機のパイプの断熱が適切にされている',  unit:'',  text:'室外機のパイプの断熱が適切にされている', inputType:'sel232', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel232']= [ '選んで下さい', 'はい', 'いいえ', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel232']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i233'] = {  cons:'consCOsum',  title:'春秋の季節、冷房と暖房の両方を稼働させている時がありますか',  unit:'',  text:'春秋の季節、冷房と暖房の両方を稼働させている時がありますか', inputType:'sel233', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel233']= [ '選んで下さい', 'ある', 'ない', 'わからない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel233']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i234'] = {  cons:'consCOsum',  title:'循環水ポンプはインバータ式ですか',  unit:'',  text:'循環水ポンプはインバータ式ですか', inputType:'sel234', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel234']= [ '選んで下さい', 'はい', 'いいえ', 'わからない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel234']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i235'] = {  cons:'consCOsum',  title:'負荷に応じてボイラーや冷凍機の数の調整いて運転していますか',  unit:'',  text:'負荷に応じてボイラーや冷凍機の数の調整いて運転していますか', inputType:'sel235', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel235']= [ '選んで下さい', 'はい', 'いいえ', 'わからない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel235']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i501'] = {  cons:'consLIsum',  title:'主に使う照明器具',  unit:'',  text:'主に使う照明器具', inputType:'sel501', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel501']= [ '選んで下さい', '蛍光灯（太管）', 'Hf蛍光灯', 'LED', '白熱灯・ハロゲン灯', '水銀灯', 'セラミックメタルハライド', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel501']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i502'] = {  cons:'consLIsum',  title:'補助で使う照明器具',  unit:'',  text:'補助で使う照明器具', inputType:'sel502', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel502']= [ '選んで下さい', '蛍光灯（太管）', 'Hf蛍光灯', 'LED', '白熱灯・ハロゲン灯', '水銀灯', 'セラミックメタルハライド', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel502']= [ '-1', '1', '2', '3', '4', '5', '6', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i503'] = {  cons:'consLIsum',  title:'平均照明時間',  unit:'時間/日',  text:'照明の利用時間を選んで下さい', inputType:'sel503', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel503']= [ '選んで下さい', '使わない', '1時間', '2時間', '3時間', '4時間', '6時間', '8時間', '10時間', '12時間', '16時間', '20時間', '24時間', '', '', '' ]; 			defSelectData['sel503']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '10', '12', '16', '20', '24', '', '', '' ]; 
		defInput['i515'] = {  cons:'consLI',  title:'照明の場所',  unit:'',  text:'照明を設置している部屋・エリアなどを記入してください', inputType:'sel515', right:'', postfix:'', demand:'4', varType:'String', min:'', max:'', defaultValue:''}; 			defSelectValue['sel515']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel515']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i511'] = {  cons:'consLI',  title:'照明器具',  unit:'',  text:'同じ部屋でも照明器具ごとに別に記入します。同じ時期に導入した器具をまとめて記入してください。', inputType:'sel511', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:''}; 			defSelectValue['sel511']= [ '選んで下さい', '蛍光灯（太管）', 'Hf蛍光灯', 'LED', '白熱灯・ハロゲン灯', '水銀灯', 'セラミックメタルハライド', 'センサー付き照明', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel511']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '' ]; 
		defInput['i512'] = {  cons:'consLI',  title:'照明器具の消費電力',  unit:'W',  text:'照明器具の消費電力', inputType:'sel512', right:'', postfix:'', demand:'2', varType:'Number', min:'', max:'', defaultValue:''}; 			defSelectValue['sel512']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel512']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i513'] = {  cons:'consLI',  title:'照明器具の数',  unit:'器',  text:'照明器具の数', inputType:'sel513', right:'', postfix:'', demand:'3', varType:'Number', min:'', max:'', defaultValue:''}; 			defSelectValue['sel513']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel513']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i514'] = {  cons:'consLI',  title:'照明時間',  unit:'時間/日',  text:'照明の利用時間を選んで下さい', inputType:'sel514', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel514']= [ '選んで下さい', '使わない', '1時間', '2時間', '3時間', '4時間', '6時間', '8時間', '10時間', '12時間', '16時間', '20時間', '24時間', '', '', '' ]; 			defSelectData['sel514']= [ '-1', '0', '1', '2', '3', '4', '6', '8', '10', '12', '16', '20', '24', '', '', '' ]; 
		defInput['i516'] = {  cons:'consLI',  title:'使用開始時刻',  unit:'',  text:'使用開始時刻', inputType:'sel516', right:'', postfix:'', demand:'5', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel516']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel516']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i517'] = {  cons:'consLI',  title:'使用終了時刻',  unit:'',  text:'使用終了時刻', inputType:'sel517', right:'', postfix:'', demand:'6', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel517']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel517']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i531'] = {  cons:'consOAsum',  title:'昼休み時間帯の照明中止',  unit:'',  text:'昼休み時間帯の照明中止', inputType:'sel531', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel531']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel531']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i532'] = {  cons:'consOAsum',  title:'窓際など明るい部分の照明停止',  unit:'',  text:'窓際など明るい部分の照明停止', inputType:'sel532', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel532']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel532']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i601'] = {  cons:'consOAsum',  title:'デスクトップパソコン台数',  unit:'台',  text:'常時利用しているデスクトップ型パソコンの台数を記入してください', inputType:'sel601', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel601']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel601']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i602'] = {  cons:'consOAsum',  title:'ノートパソコン台数',  unit:'台',  text:'常時利用しているノート型パソコンの台数を記入してください', inputType:'sel602', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel602']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel602']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i603'] = {  cons:'consOAsum',  title:'プリンタ・コピー機台数',  unit:'台',  text:'常時利用しているプリンタ・コピー機の台数を記入してください', inputType:'sel603', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel603']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel603']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i604'] = {  cons:'consOAsum',  title:'サーバールーム',  unit:'',  text:'サーバールームはありますか', inputType:'sel604', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel604']= [ '選んで下さい', 'ある', 'ない', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel604']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i621'] = {  cons:'consOAsum',  title:'非使用時のパソコンの休止設定の徹底',  unit:'',  text:'非使用時のパソコンの休止設定の徹底', inputType:'sel621', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel621']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel621']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i622'] = {  cons:'consOAsum',  title:'プリンタ・コピー機の休止モード活用',  unit:'',  text:'プリンタ・コピー機の休止モード活用', inputType:'sel622', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel622']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel622']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i699'] = {  cons:'consOAsum',  title:'事務機器の定格消費電力合計(kW)',  unit:'kW',  text:'事務機器の定格消費電力合計(kW)', inputType:'sel699', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel699']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel699']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i701'] = {  cons:'consRFsum',  title:'家庭用冷凍冷蔵庫台数',  unit:'台',  text:'家庭用冷凍冷蔵庫台数', inputType:'sel701', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel701']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel701']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i711'] = {  cons:'consRFsum',  title:'業務用冷蔵庫台数',  unit:'台',  text:'業務用冷蔵庫台数', inputType:'sel711', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel711']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel711']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i712'] = {  cons:'consRFsum',  title:'業務用冷凍庫台数',  unit:'台',  text:'業務用冷凍庫台数', inputType:'sel712', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel712']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel712']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i713'] = {  cons:'consRFsum',  title:'冷蔵ショーケース（扉あり）台数',  unit:'台',  text:'冷蔵ショーケース（扉あり）台数', inputType:'sel713', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel713']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel713']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i714'] = {  cons:'consRFsum',  title:'冷蔵ショーケース（扉なし）台数',  unit:'台',  text:'冷蔵ショーケース（扉なし）台数', inputType:'sel714', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel714']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel714']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i715'] = {  cons:'consRFsum',  title:'冷凍ショーケース（扉あり）台数',  unit:'台',  text:'冷凍ショーケース（扉あり）台数', inputType:'sel715', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel715']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel715']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i716'] = {  cons:'consRFsum',  title:'冷凍ショーケース（扉なし）台数',  unit:'台',  text:'冷凍ショーケース（扉なし）台数', inputType:'sel716', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel716']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel716']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i717'] = {  cons:'consRFsum',  title:'冷凍平台台数',  unit:'台',  text:'冷凍平台台数', inputType:'sel717', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel717']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel717']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i721'] = {  cons:'consRFsum',  title:'夜間のショーケースへの断熱カバーの設置',  unit:'',  text:'夜間のショーケースへの断熱カバーの設置', inputType:'sel721', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel721']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel721']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i722'] = {  cons:'consRFsum',  title:'スリットカーテンの設置',  unit:'',  text:'スリットカーテンの設置', inputType:'sel722', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel722']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel722']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i723'] = {  cons:'consRFsum',  title:'防露ヒーターコントローラー導入',  unit:'',  text:'防露ヒーターコントローラー導入', inputType:'sel723', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel723']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel723']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i724'] = {  cons:'consRFsum',  title:'冷気の吹きし口、吸い込み口の清掃と確保',  unit:'',  text:'冷気の吹きし口、吸い込み口の清掃と確保', inputType:'sel724', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel724']= [ '選んで下さい', 'している', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel724']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i731'] = {  cons:'consRF',  title:'冷蔵庫の種類',  unit:'',  text:'冷蔵庫の種類', inputType:'sel731', right:'', postfix:'', demand:'4', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel731']= [ '選んで下さい', '家庭用冷蔵庫', '業務用冷蔵庫', '業務用冷凍庫', '冷蔵ショーケース', '冷凍ショーケース', '冷蔵平台ショーケース', '冷凍平台ショーケース', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel731']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '' ]; 
		defInput['i736'] = {  cons:'consRF',  title:'扉の有無',  unit:'',  text:'（ショーケースの場合）扉がついていますか', inputType:'sel736', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel736']= [ '選んで下さい', 'ある', 'ない', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel736']= [ '-1', '1', '2', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i732'] = {  cons:'consRF',  title:'使用年数',  unit:'年',  text:'使用年数', inputType:'sel732', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel732']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel732']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i733'] = {  cons:'consRF',  title:'台数',  unit:'台',  text:'同じ規格・購入年のショーケース・冷蔵庫の場合には、まとめて記入できます', inputType:'sel733', right:'', postfix:'', demand:'3', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel733']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel733']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i734'] = {  cons:'consRF',  title:'定格内容量（L)',  unit:'リットル',  text:'定格内容量（L)', inputType:'sel734', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel734']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel734']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i799'] = {  cons:'consRF',  title:'定格消費電力(kW)',  unit:'kW',  text:'定格消費電力(kW)', inputType:'sel799', right:'', postfix:'', demand:'1', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel799']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel799']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i801'] = {  cons:'consOTsum',  title:'その他の機器概要',  unit:'',  text:'その他の機器', inputType:'', right:'', postfix:'', demand:'', varType:'String', min:'', max:'', defaultValue:''}; 			defSelectValue['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i811'] = {  cons:'consOT',  title:'機器の名前',  unit:'',  text:'その他の機器', inputType:'', right:'', postfix:'', demand:'4', varType:'String', min:'', max:'', defaultValue:''}; 			defSelectValue['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i899'] = {  cons:'consOT',  title:'定格消費電力(kW)',  unit:'kW',  text:'定格消費電力(kW)', inputType:'sel899', right:'', postfix:'', demand:'1', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel899']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel899']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i812'] = {  cons:'consOT',  title:'台数',  unit:'台',  text:'台数', inputType:'sel812', right:'', postfix:'', demand:'3', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel812']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel812']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i813'] = {  cons:'consOT',  title:'使用時の1日使用時間',  unit:'時間/日',  text:'使用時の1日使用時間', inputType:'sel813', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel813']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel813']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i814'] = {  cons:'consOT',  title:'使用頻度',  unit:'日/年',  text:'使用頻度', inputType:'sel814', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel814']= [ '選んで下さい', '毎日', '週5日', '2日に1日', '週2日', '週1日', '月2-3日', '月1日', '2ヶ月に1日', '3-4ヶ月に1日', '年2日', '年1日', '', '', '', '' ]; 			defSelectData['sel814']= [ '-1', '365', '270', '180', '100', '50', '30', '12', '6', '4', '2', '1', '', '', '', '' ]; 
		defInput['i815'] = {  cons:'consOT',  title:'使用開始時刻',  unit:'',  text:'使用開始時刻', inputType:'sel815', right:'', postfix:'', demand:'5', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel815']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel815']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i816'] = {  cons:'consOT',  title:'使用終了時刻',  unit:'',  text:'使用終了時刻', inputType:'sel816', right:'', postfix:'', demand:'6', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel816']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel816']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
								
		defInput['i901'] = {  cons:'consCRsum',  title:'乗用車の保有台数',  unit:'台',  text:'乗用車の保有台数', inputType:'sel901', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel901']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel901']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i902'] = {  cons:'consCRsum',  title:'スクータ・バイクの保有台数',  unit:'台',  text:'スクータ・バイクの保有台数', inputType:'sel902', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel902']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel902']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i903'] = {  cons:'consCRsum',  title:'軽トラック・バンの保有台数',  unit:'台',  text:'軽トラック・バンの保有台数', inputType:'sel903', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel903']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel903']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i904'] = {  cons:'consCRsum',  title:'ディーゼルトラックの保有台数',  unit:'台',  text:'ディーゼルトラックの保有台数', inputType:'sel904', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel904']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel904']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i911'] = {  cons:'consCRsum',  title:'低炭素乗用車の保有台数',  unit:'台',  text:'低炭素乗用車の保有台数', inputType:'sel911', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel911']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel911']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i912'] = {  cons:'consCRsum',  title:'低炭素軽トラックの保有台数',  unit:'台',  text:'低炭素軽トラックの保有台数', inputType:'sel912', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel912']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel912']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i913'] = {  cons:'consCRsum',  title:'低炭素トラックの保有台数',  unit:'台',  text:'低炭素トラックの保有台数', inputType:'sel913', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel913']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel913']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i914'] = {  cons:'consCRsum',  title:'エコドライブ講習の定期的実施',  unit:'',  text:'エコドライブ講習の定期的実施', inputType:'sel914', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel914']= [ '選んで下さい', '全員にしている', '一部している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel914']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i911'] = {  cons:'consCR',  title:'車の種類',  unit:'',  text:'車の種類', inputType:'sel911', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel911']= [ '選んで下さい', '乗用車', 'スクータ・バイク', '軽トラック・バン', '2tトラック', '4tトラック', '10tトラック', 'バス', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel911']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '', '', '', '', '', '', '', '' ]; 
		defInput['i912'] = {  cons:'consCR',  title:'車の燃費',  unit:'',  text:'車の燃費', inputType:'sel912', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel912']= [ '選んで下さい', '6km/L以下', '7-9km/L', '10-12km/L', '13-15km/L', '16-20km/L', '21-26km/L', '27-35km/L', '36km/L以上', '', '', '', '', '', '', '' ]; 			defSelectData['sel912']= [ '-1', '6', '8', '11', '14', '18', '23', '30', '40', '', '', '', '', '', '', '' ]; 
		defInput['i913'] = {  cons:'consCR',  title:'この車種の台数',  unit:'台',  text:'この車種の台数', inputType:'sel913', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:''}; 			defSelectValue['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i914'] = {  cons:'consCR',  title:'エコタイヤを使っていますか',  unit:'',  text:'エコタイヤを使っていますか', inputType:'sel914', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel914']= [ '選んで下さい', 'はい', 'いいえ', 'わからない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel914']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i921'] = {  cons:'consCRtrip',  title:'行き先',  unit:'',  text:'よく出かける行き先', inputType:'sel921', right:'', postfix:'', demand:'', varType:'String', min:'', max:'', defaultValue:''}; 			defSelectValue['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['']= [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i922'] = {  cons:'consCRtrip',  title:'頻度',  unit:'',  text:'どの程度車で行きますか', inputType:'sel922', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel922']= [ '選んで下さい', '毎日', '週5回', '週2～3回', '週1回', '月に2回', '月1回', '２ヶ月に1回', '年2-3回', '年1回', '', '', '', '', '', '' ]; 			defSelectData['sel922']= [ '-1', '365', '250', '120', '50', '25', '12', '6', '2', '1', '', '', '', '', '', '' ]; 
		defInput['i923'] = {  cons:'consCRtrip',  title:'片道距離',  unit:'km',  text:'片道距離', inputType:'sel923', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel923']= [ '選んで下さい', '1km', '2km', '3km', '5km', '10km', '20km', '30km', '50km', '100km', '200km', '400km', '600km以上', '', '', '' ]; 			defSelectData['sel923']= [ '-1', '1', '2', '3', '5', '10', '20', '30', '50', '100', '200', '400', '700', '', '', '' ]; 
		defInput['i924'] = {  cons:'consCRtrip',  title:'使用する車',  unit:'',  text:'どの車を主に使いますか', inputType:'sel924', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel924']= [ '選んで下さい', '1台目', '2台目', '3台目', '4台目', '5台目', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel924']= [ '-1', '1', '2', '3', '4', '5', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i931'] = {  cons:'consCRsum',  title:'アイドリングストップ',  unit:'',  text:'長時間の停車でアイドリングストップをしていますか', inputType:'sel931', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel931']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel931']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i932'] = {  cons:'consCRsum',  title:'急加速や急発進',  unit:'',  text:'急加速や急発進をしないようにしていますか', inputType:'sel932', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel932']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel932']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i933'] = {  cons:'consCRsum',  title:'加減速の少ない運転',  unit:'',  text:'加減速の少ない運転', inputType:'sel933', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel933']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel933']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i934'] = {  cons:'consCRsum',  title:'早めのアクセルオフ',  unit:'',  text:'早めのアクセルオフ', inputType:'sel934', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel934']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel934']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i935'] = {  cons:'consCRsum',  title:'道路交通情報の活用',  unit:'',  text:'道路交通情報の活用', inputType:'sel935', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel935']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel935']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i936'] = {  cons:'consCRsum',  title:'不要な荷物',  unit:'',  text:' 不要な荷物は積まずに走行', inputType:'sel936', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel936']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel936']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i937'] = {  cons:'consCRsum',  title:'カーエアコンの温度調節',  unit:'',  text:'カーエアコンの温度・風量をこまめに調節していますか', inputType:'sel937', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel937']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel937']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		defInput['i938'] = {  cons:'consCRsum',  title:'暖機運転',  unit:'',  text:'寒い日に暖機運転をしていますか', inputType:'sel938', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel938']= [ '選んで下さい', '1000円', '2000円', '3000円', '5000円', '7000円', '1万円', '1万2000円', '1万5000円', '2万円', '3万円', 'それ以上', '', '', '', '' ]; 			defSelectData['sel938']= [ '-1', '1000', '2000', '3000', '5000', '7000', '10000', '12000', '15000', '20000', '30000', '40000', '', '', '', '' ]; 
		defInput['i939'] = {  cons:'consCRsum',  title:'タイヤの空気圧',  unit:'',  text:'タイヤの空気圧を適切に保つよう心がけていますか', inputType:'sel939', right:'', postfix:'', demand:'', varType:'Number', min:'', max:'', defaultValue:'-1'}; 			defSelectValue['sel939']= [ '選んで下さい', 'いつもしている', '時々している', 'していない', '', '', '', '', '', '', '', '', '', '', '', '' ]; 			defSelectData['sel939']= [ '-1', '1', '2', '3', '', '', '', '', '', '', '', '', '', '', '', '' ]; 
		
//ここまでの範囲のデータを別ファイルから読み込む　--------------------------

//時刻設定
		defSelectValue['sel815']= [ '選んで下さい', '0時', '1時', '2時', '3時', '4時', '5時', '6時', '7時', '8時', '9時', '10時', '11時', '12時', '13時', '14時', '15時', '16時', '17時', '18時', '19時', '20時', '21時', '22時', '23時', '24時' ]; 
		defSelectData['sel815']= [ '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24' ]; 
		defSelectValue['sel816'] = defSelectValue['sel815'];
		defSelectData['sel816'] = defSelectData['sel815'];
		defSelectValue['sel516'] = defSelectValue['sel815'];
		defSelectData['sel516'] = defSelectData['sel815'];
		defSelectValue['sel517'] = defSelectValue['sel815'];
		defSelectData['sel517'] = defSelectData['sel815'];

//都道府県設定用
		defSelectValue['sel021'] = [ "選んで下さい", "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川", "新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜",  "静岡", "愛知", "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山", "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知", "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄" ];
		defSelectData['sel021']= [ '-1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47' ]; 
		//defSelectValue['sel022'] = [ "選んで下さい", "北部", "南部"];
		//defSelectData['sel022'] = [ "-1", "1", "2"];

//平均算出時に条件として考慮する項目
		this.defCalcAverage = [ "i001", "i005", "i021"];

//対策の提案重み付け方法選択
		this.measuresSortChange = "i012";	//変数名
		this.measuresSortTarget = [ 
			"co2ChangeOriginal",
			"co2ChangeOriginal",
			"costTotalChangeOriginal",
			"co2ChangeW1Original",
			"co2ChangeW2Original"
		];
		
//簡易入力設定
		this.defEasyQues = [
			{	title:"簡易入力",
				cname:"easy01",
				ques: [
'i001',
'i002',
'i003',
'i005',
'i021',
'i034',
'i029',
'i031',
'i041',
'i042',
'i044',
'i203',
'i204',
'i007',
'i008',
'i205',
'i206',
'i601',
'i602',
'i701',
'i713',
'i714',
'i715',
'i716',
'i717'
]
			}
		];
		
//質問の順番の配列（使う場合）
		this.defQuesOrder = [ 
'i001',
'i002',
'i003',
'i005',
'i021',
'i034',
'i029',
'i031',
'i041',
'i042',
'i044',
'i203',
'i204',
'i007',
'i008',
'i205',
'i206',
'i601',
'i602',
'i701',
'i713',
'i714',
'i715',
'i716',
'i717'
		];

		//実装化
		this.defMeasures = defMeasures;
		this.defInput = defInput;
		this.defSelectValue = defSelectValue;
		this.defSelectData = defSelectData;
		this.defEquipment = defEquipment;
		this.defEquipmentSize = defEquipmentSize;

		
	//calcConsの標準値設定に関わる標準呼び出し
	D6.area.setCalcBaseParams = function(){
		//地域の設定
		D6.area.setArea( D6.doc.data.i021 );
	};

	//季節パラメータの標準呼び出し
	D6.area.getSeasonParamCommon = function(){
		//地域の設定
		return D6.area.getSeasonParam(  D6.consShow["TO"].business  );
	};


	//事業所別標準値
	// i001(業種)に対応
	//'事務所', 'スーパー', 'コンビニエンスストア', 'ほか小売・卸業', '飲食店', '旅館・ホテル', '学校', '病院', '工場', 'その他'
	// MJ/m2・年, 季節排出比,　営業時間外消費比率
	//　DECC　　非住宅建築物の環境関連データベース（H22年3月）　より作成
	// floor 		業種平均床面積
	// workTime		業種平均営業時間
	D6.area.businessParams = {
	1: { energy:1724, winter:0.93, spring:0.97, summer:1.14, notservice:0.2, floor:200, workTime:8, workDay:5 },
	2: { energy:4640, winter:0.91, spring:0.99, summer:1.14, notservice:0.2, floor:200, workTime:12, workDay:7},
	3: { energy:14783, winter:0.97, spring:0.99, summer:1.06, notservice:1, floor:60, workTime:24, workDay:7},
	4: { energy:2942, winter:0.89, spring:0.98, summer:1.19, notservice:0.1, floor:200, workTime:8, workDay:6},
	5: { energy:17543, winter:0.86, spring:0.99, summer:1.2, notservice:0.4, floor:60, workTime:8, workDay:6},
	6: { energy:2668, winter:0.9, spring:0.97, summer:1.18, notservice:0.4, floor:1000, workTime:8, workDay:7},
	7: { energy:366, winter:1.08, spring:0.96, summer:0.95, notservice:0.1, floor:1000, workTime:8, workDay:6},
	8: { energy:2422, winter:0.97, spring:0.96, summer:1.11, notservice:0.4, floor:1000, workTime:8, workDay:7},
	9: { energy:17543, winter:0.86, spring:0.99, summer:1.2, notservice:0.4, floor:1000, workTime:8, workDay:5},
	10: { energy:2942, winter:0.89, spring:0.98, summer:1.19, notservice:0.1, floor:200, workTime:8, workDay:5}
		
	};

	//業種から季節別の係数を得る
	D6.area.getSeasonParam = function( business ) {
		ret = Array();
		var p = D6.area.businessParams[business];
		ret["electricity"] = [ p["winter"], p["spring"], p["summer"] ];
		ret["gas"] = [ 1, 1, 1 ];
		ret["kerosene"] = [ 1, 1, 1 ];
		ret["car"] = [ 1, 1, 1 ];
		ret["heavyoil"] = [ 1, 1, 1 ];

		return ret;
	};
	
	//地域ごとの標準値の設定 :(地域設定後に設定する)
	//　areaId：都道府県ID
	D6.area.setArea = function( areaId  )
	{
		if ( areaId < 0 ) {
			areaId = 13;
		}

		D6.area.area = Math.round(areaId ? areaId : 0);	

		//電力会社の設定
		D6.area.electCompany = D6.area.getElectCompany(D6.area.area);

		//電力のCO2排出係数の設定
		D6.Unit.co2.electricity = D6.area.getCo2Unit( D6.area.electCompany );
		D6.Unit.co2.nightelectricity = D6.Unit.co2.electricity;
		D6.Unit.co2.sellelectricity = D6.Unit.co2.electricity;
		
		//エアコンパラメータ設定
		D6.area.airconFactor_mon = D6.accons.getArray( D6.area.area );
		D6.area.heatFactor_mon = D6.acload.getArray( D6.area.area );
		D6.area.plusHeatFactor_mon = D6.acadd.getArray( D6.area.area );

		
		//平均気温設定
		D6.area.averageTemplature = D6.area.getTemplature( D6.area.area );
		
		//太陽光発電量の設定　100622
		D6.area.unitPVElectricity = 1000 * D6.area.getPVElectricity( D6.area.area ) / 3.6;

		//暖房地域の設定
		D6.area.heatingLevel = D6.area.getHeatingLevel( D6.area.area );

		//冷暖房月数の設定
		switch( D6.area.heatingLevel ) {
			case 1:
				D6.area.seasonMonth = { winter:7, spring:2, summer:3 };
				break;
			case 2:
				D6.area.seasonMonth = { winter:6, spring:2, summer:4 };
				break;
			case 3:
				D6.area.seasonMonth = { winter:5, spring:2, summer:5 };
				break;
			case 5:
				D6.area.seasonMonth = { winter:4, spring:2, summer:6 };
				break;
			case 6:
				D6.area.seasonMonth = { winter:3, spring:2, summer:7 };
				break;
			case 4:
			default:
				D6.area.seasonMonth = { winter:4, spring:2, summer:6 };
				break;
		}

		//calculate average cost for business
		this.averageCostEnergy = this.getAverageCostEnergy( 
						D6.consShow["TO"].business ,
						D6.consShow["TO"].floor );
		
		//calculate average CO2
		this.averageCO2Energy = {};
		for( var i in this.averageCostEnergy ) {
			this.averageCO2Energy[i] = 
						D6.Unit.costToCons( this.averageCostEnergy[i] , i )
						* D6.Unit.co2[i];
		}
	};
	
	// get average fee depend on business type,floor
	// 	ret[energy_name]
	//
	//	energy_name: electricity,gas,kerosene,car
	//
	D6.area.getAverageCostEnergy= function( business, floor ) {
		var ret;
		ret = new Array();

		var id;
		for ( i in this.energyCode2id) {
			id = this.energyCode2id[i];
			if ( i=="electricity" ){
				ret[i] = D6.Unit.consToCost(business * floor 
							/ D6.Unit.jules.electricity / 12 
						,"electricity", 1, 0 );			//月電気代
			} else {
				ret[i] = 0;
			}
		}

		return ret;
	};


	}
};




