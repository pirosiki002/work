const rf = reportfunctions.GetInstance();

/* 起動時処理 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  // 新規メニューの追加
  ui.createMenu('新メニュー')
    .addItem('入力行の追加', 'newInsertRow')
    .addToUi();

}


// 新メニュー(Shoさま対応) start
// 最終行をコピーして行を挿入する関数
function newInsertRow() {
  let ui = SpreadsheetApp.getUi();

  // 起動チェック
  // ui.alert("This is a test message of newInsertRow()")

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow(); // 最終行を取得します
  var numCopies = 10; // 追加する行数を指定します

  // コピーする行のデータを取得
  var rangeToCopy = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());
  var dataToCopy = rangeToCopy.getValues();

  // 追加する行数分のループ
  for (var i = 0; i < numCopies; i++) {
    // 最終行の次の行に新しい行を挿入
    sheet.insertRowAfter(lastRow + i);

    // 挿入した行にコピーしたデータを貼り付け
    var rangeToPaste = sheet.getRange(lastRow + i + 1, 1, 1, sheet.getLastColumn());
    rangeToPaste.setValues(dataToCopy);

  }

  // 追加した分の範囲分、関数の値を拡大する
  applyArrayFormula();
}


// ARRAYFORMULAを最後の行まで適用
function applyArrayFormula() {
  Logger.log('applyArrayFormula called!!!');
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();

  // ARRAYFORMULAを最後の行まで適用
  sheet.getRange('AA15').setFormula('=ARRAYFORMULA(IFERROR(T15:T' + lastRow + ',0))');

  // 空白を設定する
  setRangeToBlank(sheet, "AA46:AA" + lastRow);
}

// 空白を設定する
function setRangeToBlank(sheet, rangeA1Notation) {
  var rangeToPaste = sheet.getRange(rangeA1Notation);
  var rows = rangeToPaste.getNumRows();

  // 空の2次元配列を作成
  var blankValues = new Array(rows).fill([""]);

  rangeToPaste.setValues(blankValues);
}

