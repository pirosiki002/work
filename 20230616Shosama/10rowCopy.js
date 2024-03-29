// スプレッドシートが開かれたときに行いたい処理
function onOpen(e) {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('メニュー')
      .addItem('入力行の追加', 'insertRow')
      .addItem('CSV出力', 'exportCsv')
      .addToUi();
}

// 新メニュー(Shoさま対応) start
// 最終行をコピーして行を挿入する関数
function insertRow() {

  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let lastRow = sheet.getLastRow(); // 最終行を取得します
  let numCopies = 10; // 追加する行数を指定します

  // コピーする行のデータを取得
  let rangeToCopy = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());

  // 追加する行数分のループ
  for (let i = 0; i < numCopies; i++) {
    // 最終行の次の行に新しい行を挿入
    sheet.insertRowAfter(lastRow + i);

    // 挿入した行にコピーしたデータを貼り付け
    let rangeToPaste = sheet.getRange(lastRow + i + 1, 1, 1, sheet.getLastColumn());
    rangeToCopy.copyTo(rangeToPaste);
  }

  // 追加した分の範囲分、関数の値を拡大する
  applyArrayFormula();
  // 合計値も拡大する
  updateFormulas();

}


// ARRAYFORMULAを最後の行まで適用する関数
function applyArrayFormula() {
  Logger.log('applyArrayFormula called!!!');
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let lastRow = sheet.getLastRow();

  // 処理対象の列と対応する計算式
  let formulas = {
    'R' : '=ARRAYFORMULA(IFERROR(P15:P' + lastRow + '-(J15:J' + lastRow + '+K15:K' + lastRow + '),0))',
    'P' : '=ARRAYFORMULA(IFERROR(((G15:G' + lastRow + '*I15:I' + lastRow + ')+H15:H' + lastRow + '),0))',
    // 他の列と計算式を追加することが可能です
  };

  for (let column in formulas) {
    // ARRAYFORMULAを最後の行まで適用
    sheet.getRange(column + '15').setFormula(formulas[column]);

    // 空白を設定する
    setRangeToBlank(sheet, column + '46:' + column + lastRow);
  }
}

// 空白を設定する
function setRangeToBlank(sheet, rangeA1Notation) {
  let rangeToPaste = sheet.getRange(rangeA1Notation);
  let rows = rangeToPaste.getNumRows();

  // 空の2次元配列を作成
  let blankValues = new Array(rows).fill([""]);

  rangeToPaste.setValues(blankValues);
}

// 行の追加に合わせて合計値の範囲を拡大（空白行の追加後にCallすること）
function updateFormulas() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let lastRow = sheet.getLastRow();

  // もし最終行が15行以下ならば処理を終了
  if (lastRow < 15) return;

  // H5:K8までに設定する計算式を定義
  let companies = ["Amazon", "楽天", "Yahoo", "その他"];

  let formulas = companies.map((company) => [
    '=ArrayFormula(SUMIF($D$15:$D$'+ lastRow + ', "'  + company + '", $R$15:$R$' + lastRow + '))',
    '=ArrayFormula(SUMIF($D$15:$D$'+ lastRow + ', "'  + company + '", $J$15:$J$' + lastRow + '))',
    '=SUMPRODUCT(($D$15:$D$' + lastRow + ' = "' + company + '") * ($P$15:$P$' + lastRow + ' * $Q$15:$Q$' + lastRow + '))'
  ]);


  // 各セルに対応する計算式を設定
  for (let i = 0; i < formulas.length; i++) {
    ['I','J','K'].forEach((column, j) => {
      sheet.getRange(column + (i + 5)).setFormula(formulas[i][j]);
    });
  }
}