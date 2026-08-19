# D6クラス まとめ

CO2排出削減診断ソフト(温暖化対策診断ツール)の中核となるグローバルオブジェクト `D6` の構造と使い方をまとめる。

## 1. 概要

`D6` は特定の"クラス"インスタンスではなく、`var D6 = D6 || {};` というパターンで各ファイルがプロパティ・メソッドを追加していく**グローバル名前空間(疑似シングルトンクラス)**である。

- 定義本体: `logic/base/d6.js` ほか `logic/base/d6_*.js` 群
- 地域・分野別の拡張: `logic/areaset/`, `logic/home/`, `logic/office/`、および `logic_JP/`, `logic_CN/`, `logic_FR/`, `logic_KR/`, `logic_VI/`, `logic_JP_en/` (地域・言語別の上書き/追加)
- 外部からの呼び出し窓口: `logic/d6facade.js`(Web Worker/画面用)、`logic/api.js`(AWS Lambda等サーバーレス用)

家庭・小規模事業者のアンケート回答(エネルギー消費データ)をもとにCO2排出量を計算し、約60項目の削減対策から効果的なものを提案する。

## 2. ソースファイル構成(`logic/base/`)

| ファイル | 役割 |
|---|---|
| `d6.js` | コアプロパティ定義(`consList`, `measureList` など)とエントリポイント `construct()` / `calculateAll()` |
| `d6_construct.js` | シナリオ定義から消費(cons)・対策(measure)オブジェクトグラフを構築 |
| `d6_calccons.js` | 消費量計算のコアロジック(`calcCons`, `calcConsAdjust`) |
| `d6_calcmeasures.js` | 対策の選択・計算ロジック(貪欲アルゴリズムによる自動選定) |
| `d6_calcaverage.js` | 平均値モードでの計算、ランク算出(`rankIn100`) |
| `d6_calcmonthly.js` | 月別消費データの欠損補完 |
| `d6_setvalue.js` | 入力値・対策選択のセッター(`inSet`, `measureAdd`, `measureDelete`) |
| `d6_tools.js` | 汎用ユーティリティ(配列ソート等) |
| `d6_get.js` | 結果表示用データの集約(`getAllResult` など) |
| `d6_getdemand.js` | 電力デマンド(時間帯別消費)グラフ用データ |
| `d6_getevaluateaxis.js` | 省エネ行動の評価軸スコア算出 |
| `d6_getinput.js` | 質問フォームのHTML生成 |
| `d6_getmeasure.js` | 対策詳細データの生成 |
| `consbase.js` | 消費項目の基底クラス `ConsBase extends Energy` |
| `measurebase.js` | 対策の基底クラス `MeasureBase extends Energy` |
| `energy.js` | エネルギー量(電気・ガス・灯油等)の値オブジェクト基底クラス `Energy` |
| `doc.js` | 入力データを保持するシングルトン `D6.doc`(シリアライズ/復元) |
| `objectcreate.js` | `Object.create()` 実装と `D6.patch()` |

## 3. 主要データ構造

| プロパティ | 内容 |
|---|---|
| `D6.consList` | 全消費項目(`ConsBase`派生)のフラットな配列。計算ループの走査対象 |
| `D6.consListByName` | 消費項目名(`consName`)をキーにした配列(部屋・機器の複数台をまとめる) |
| `D6.consShow` | 消費コード(`consCode`)をキーにした主要表示用インスタンス(`"TO"`は全体合計) |
| `D6.measureList` | 全対策(`MeasureBase`派生)の配列 |
| `D6.resMeasure` | `calcMeasures()` 実行後の選択済み対策結果 |
| `D6.average` | 平均モードで算出した `consCode` ごとの平均値(`{consList: {...}}`) |
| `D6.doc` | 入力回答データ(`data[]`)を保持するシングルトン |
| `cons.measures` | 各消費項目に紐づく対策の連想配列 |
| `cons.sumCons` / `sumCons2` | 集計上位(親)へのリンク |
| `cons.partCons` / `partCons2` | 内訳下位(子)へのリンク |

消費項目どうしは「全体合計 ← 分野別 ← 部屋/機器別」という木構造(`sumCons`/`partCons`)で連結されており、対策の削減効果はこの木構造全体に再帰的に伝播する。

## 4. 消費(cons)と対策(measure)の関係

1. 各消費項目(`ConsBase`)は自身に関連する対策(`MeasureBase`)を `cons.measures` に保持し、対策側も `mes.cons` で親を参照する(双方向)。
2. 対策が選択されると `mes.calcSave()` で対策前後のCO2・コスト差分(`co2Change`, `costChange`)と投資回収年数(`payBackYear`)を算出。
3. `mes.addReduction()` が対策前後の差分(`margin`)を計算し、`cons.addReductionMargin()` に渡す。
4. `addReductionMargin()` は自身の消費項目に反映した後、`sumCons`/`partCons` を辿って**木構造全体**(部屋別→分野別→全体合計)に効果を波及させる。

## 5. 主要メソッド一覧

### 構築
- `D6.construct(prohibitQuestions, allowedQuestions, defInput)` — シナリオを読み込み、消費・対策オブジェクトグラフを構築(内部で `setscenario()` を呼ぶ)
- `D6.setscenario(a, b, c)` — 実際の構築処理(初回/`addConsSetting`後の再構築の両方で使用)
- `D6.addMeasureEachCons(cons)` — 消費項目に対策を紐付け
- `D6.addConsSetting(consName)` — 部屋数・機器台数を1つ増やす(要 `setscenario("add", ...)` の再呼び出し)

### 計算
- `D6.calculateAll()` — `setCalcBaseParams()` → `calcAverage()` → `calcMeasures(-1)` を一括実行するトップレベル関数
- `D6.calcCons()` — 消費量計算(優先度順に `precalc/calc/calcCO2/calc2nd`)
- `D6.calcConsAdjust()` — 内訳と集計の整合調整
- `D6.calcMeasures(gid)` — 対策を効果順に貪欲選択して計算(結果は `D6.resMeasure` へ)
- `D6.calcMeasuresLifestyle(gid)` / `calcMeasuresNotLifestyle(gid)` — ライフスタイル系対策のみ/以外でフィルタ
- `D6.calcMeasuresOne(gid)` — 各consの対策候補を計算・ソートして返す
- `D6.calcMaxMeasuresList(gid, count)` — CO2削減最大の対策を `count` 回まで自動選択するシミュレーション
- `D6.calcAverage()` — 平均値モードで計算し `D6.average` に保存
- `D6.rankIn100(ratio)` — 平均比からランク(1〜100)を算出
- `D6.calcMonthly(...)` — 月別消費データの補完

### 入力・選択操作
- `D6.inSet(id, val)` — 質問回答を `D6.doc.data` にセット
- `D6.measureAdd(mesId)` / `D6.measureDelete(mesId)` — 対策の選択フラグをon/off(再計算は呼び出し側の責務)

### 結果取得
- `D6.getAllResult(consName)` — 結果表示用データの統合API(`common`/`consShow`/`monthly`/`average`/`itemize`/`measure`)
- `D6.getAverage()` / `getAverage_graph()` — 平均比較・ランク
- `D6.getItemize()` / `getItemizeGraph()` — 内訳グラフデータ
- `D6.getMonthly()` — 月別グラフデータ
- `D6.getInputPage(...)` — 質問フォームHTML生成
- `D6.getMeasure(consName, maxPrice, notSelected)` — 対策一覧取得
- `D6.getEvaluateAxisPoint()` — 省エネ行動評価軸スコア

### その他
- `D6.getGid(consName)` — 消費項目のグループID取得
- `D6.getCommonParameters()` — 共通パラメータ取得
- `D6.doc.serialize()` / `D6.doc.loadDataSet(str)` — 回答・選択対策状態の保存/復元
- `D6.toHalfWidth()` / `D6.ObjArraySort(ary, key, order)` — 汎用ユーティリティ

## 6. 全体の処理フロー

```
D6.construct(prohibitQuestions, allowedQuestions, defInput)
  └─ D6.setscenario()  … consList/measureList等を構築、対策を紐付け、入力を初期化

ユーザー入力
  └─ D6.inSet(id, val)  … D6.doc.data に回答を蓄積

D6.calculateAll()
  ├─ D6.area.setCalcBaseParams()   … 地域パラメータ設定
  ├─ D6.calcAverage()              … 平均値算出 → D6.average
  └─ D6.calcMeasures(-1)
       ├─ clearSelectedMeasures()  … calcCons()で基準値算出+選択クリア
       └─ 対策を効果順に選択・addReduction() → D6.resMeasure

結果取得
  └─ D6.getAllResult(consName) / getAverage() / getItemize() / getMonthly() / getMeasure()

保存/復元
  └─ D6.doc.serialize() / D6.doc.loadDataSet(str)
```

## 7. 外部からの呼び出し方(ファサード層)

D6の各メソッドを直接呼ぶのではなく、以下のファサード経由で「コマンド文字列 + パラメータ」形式で呼び出すのが標準的な使い方。

### `logic/d6facade.js`(画面・Web Worker用)

`D6.workercalc(command, param)` がコマンドディスパッチャ。主なコマンド:

| command | 処理内容 |
|---|---|
| `"start"` | `D6.construct()` → (保存データがあれば `D6.doc.loadDataSet()`) → `D6.calculateAll()` → `D6.getAllResult()` → `D6.getInputPage()` |
| `"inchange"` | `D6.inSet()` → `D6.calculateAll()` → `D6.getAllResult()`(入力変更時の再計算) |
| `"measureadd"` / `"measuredelete"` | `D6.measureAdd()`/`measureDelete()` → `D6.calcMeasures(-1)` → 結果再取得 |
| `"tabclick"` | タブ切替(表示consの切り替え) |
| `"save"` | `D6.doc.serialize()` による保存データ生成 |
| `"common"` | 汎用結果取得 |

Web Workerとして動かす場合は `onmessage` が `postMessage` 経由で `workercalc` を呼び、結果を `postMessage` で返す。

### `logic/api.js`(サーバーレス/Lambda用)

`cmd.set.*`(add/inp/measureadd)で構造変更・入力・対策選択、`cmd.get.*` フラグ(monthly/average/itemize/measure/measure_detail/input_page等)で必要な結果だけを組み立てて返すコールバックパターン。内部では同じくD6の低レベル関数を直接呼び出す。

### `view/main.js` + `view/view_base/onclick-base.js`(実際の画面連携例)

```
startInit()                       // 初期化パラメータ組み立て
  → startCalc("start", param)     // view/main.js
      → (Workerモード) worker.postMessage({command, param})
      → (非Workerモード) D6.workercalc(command, param) を直接呼ぶ
  → getCalcResult(command, res)   // 結果をDOMに反映(createInputPage/showAverageTable/showItemizeTable/showMeasureTable/graphItemize/graphMonthly)
```

画面操作からの呼び出し例(`onclick-base.js`):
- 入力欄変更 → `inchange(id)` → `startCalc("inchange", param)`
- 対策チェックボックス → `measureadddelete(mid)` → `startCalc("measureadd"/"measuredelete", param)`
- 部屋・機器追加 → `addroom(consName)` → `startCalc("addandstart", param)`
- タブクリック → `tabclick(index, consName)` → `startCalc("tabclick", param)`

## 8. 地域・分野別の拡張の仕組み

`logic/areaset/`(地域係数)、`logic/home/`(家庭用消費分野ロジック、`consHWsum`/`consACheat`/`consRF`等)、`logic/office/`(事業所版)はいずれも独立した名前空間ではなく、`var D6 = D6 || {};` で同じグローバル `D6` にプロパティ・関数を追加する。

`index_develop.html` は `logic/base/*` → `logic/areaset/*` → `logic/home/*` → 同名の `logic_JP/areaset/*` / `logic_JP/home/*` の順にスクリプトを読み込み、**後から読み込まれるファイルが同名の関数・データを上書きする**ことで地域・言語別カスタマイズを実現している。

対策の優先度(`README.md` より):
1. `logic_JP/home/senariofix.js`(Excelで定義、対策名を`#`にすると非表示)
2. `logic_JP/home/cons**.js` の `calcMeasure()` オーバーライド
3. 共通の `logic/home/calc**.js`

## 9. 実行方法

```bash
npm install -g grunt-cli
npm install
# access index_develop.html   … 個別JSファイルを直接読み込む開発用
grunt
# access index.html           … grunt でconcat/圧縮したビルド後版
```

- `index.php` … develop/release切り替えのナビゲーション
- `index_biz.html` … 事業所向け診断
- `parameters.php`, `init_home.php`, `init_office.php` … パラメータ設定
