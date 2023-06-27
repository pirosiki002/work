
// スプレッドシートが開かれたときに行いたい処理
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('メニュー')
      .addItem('入力行の追加', 'insertRow')
      // .addItem('チェック済レコード転記', 'insertRow')
      // .addItem('実績管理シート更新', 'insertRow')
      .addToUi();
}

// 新メニュー(Shoさま対応) start
// 最終行をコピーして行を挿入する関数
function insertRow() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow(); // 最終行を取得します
  var numCopies = 10; // 追加する行数を指定します

  // コピーする行のデータを取得
  var rangeToCopy = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());

  // 追加する行数分のループ
  for (var i = 0; i < numCopies; i++) {
    // 最終行の次の行に新しい行を挿入
    sheet.insertRowAfter(lastRow + i);

    // 挿入した行にコピーしたデータを貼り付け
    var rangeToPaste = sheet.getRange(lastRow + i + 1, 1, 1, sheet.getLastColumn());
    rangeToCopy.copyTo(rangeToPaste);
  }

  // 追加した分の範囲分、関数の値を拡大する
  applyArrayFormula();
}


// ARRAYFORMULAを最後の行まで適用する関数
function applyArrayFormula() {
  Logger.log('applyArrayFormula called!!!');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();

  // 処理対象の列と対応する計算式
  var formulas = {
    'S': '=ARRAYFORMULA(IFERROR(O15:O' + lastRow + ',0))',
    // 'AB': '=ARRAYFORMULA(IFERROR(W15:W' + lastRow + '-T15:T' + lastRow + ',0))',
    // 他の列と計算式を追加することが可能です
  };

  for (var column in formulas) {
    // ARRAYFORMULAを最後の行まで適用
    sheet.getRange(column + '15').setFormula(formulas[column]);

    // 空白を設定する
    setRangeToBlank(sheet, column + '46:' + column + lastRow);
  }
}

// 空白を設定する
function setRangeToBlank(sheet, rangeA1Notation) {
  var rangeToPaste = sheet.getRange(rangeA1Notation);
  var rows = rangeToPaste.getNumRows();

  // 空の2次元配列を作成
  var blankValues = new Array(rows).fill([""]);

  rangeToPaste.setValues(blankValues);
}

// 新メニュー(Shoさま対応) end