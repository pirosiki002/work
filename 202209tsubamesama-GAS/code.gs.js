//*********************************
// グローバル変数の宣言
//*********************************
// GoogleスプレッドシートのIDを変数に格納
var spreadsheetId = '13ZNaVVSFikTNFNm0y2sFE2djS0L3cm8PGJBxh3aWlvk';
// スプレッドシートの最大列を設定
const MAX_COL = 2;

let g_org_gas_data_arr;     //オリジナルの（削除前の）グローバル配列
let g_gas_data_arr;         //キーワード一覧格納用のグローバル配列

//*********************************
// スプレッドシートのデータを読み込む
//*********************************
function GetSpreadsheet(){

  console.log("GetSpreadsheet2() called");

  //操作するスプレッドシートIDとシート名を指定して開く
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('キーワード一覧');
  
  //全データを取得するので、最終列と最終行を取得する
  var last_col = sheet.getLastColumn();  //最終列取得
  var last_row = sheet.getLastRow();     //最終行取得
  
  // データを取得する範囲を指定して取得し、2次元配列で返す
  return sheet.getRange(1, 1, last_row, last_col).getValues();
}


//*********************************
// GASのデータを取得しグローバル変数に設定
//*********************************
function getGASdata(spreadsheet_data){
  console.log("js getGASdata() called");
  console.log("spreadsheet_data.length = ", spreadsheet_data.length);

  //代入用の配列をNew
  g_gas_data_arr = new Array(spreadsheet_data.length);
  for (let i = 0; i < g_gas_data_arr.length; i++){
    g_gas_data_arr[i] = new Array(MAX_COL);
  }

  for(let row = 0; row < spreadsheet_data.length; row++){
    //最初のタイトル行を削除する分、サイズを1行分-1しておく
    for(let col = 0; col < spreadsheet_data[row].length; col++){
      //グローバル配列に設定
      g_gas_data_arr[row][col] = spreadsheet_data[row][col];    //1行目（row=0)はタイトル文字が入っている。2行目（row=1)から設定する
      console.log("g_gas_data_arr" + "[" + row + "]" + "[" + col + "]=" + g_gas_data_arr[row][col]);
    }
  }

  //配列をコピーしておく(debug)
  g_org_gas_data_arr = [...g_gas_data_arr];

}

//*********************************
// キーワード検索開始
//*********************************
function doSearch(){

  //スプレッドシートのデータ読み込み
  let gas_data = GetSpreadsheet();
  // Googleスプレッドシートの情報を設定
  getGASdata(gas_data);

  let sentence = 0;
  console.log("doSearch!!");

  // Googleドキュメントの情報を読み取る
  const DOC_URL = 'https://docs.google.com/document/d/1E9ADJL7qDyzZjgQHyAhwjf73Kwj-3h6KuBCDw3W8ERg/edit'; 
  const doc = DocumentApp.openByUrl(DOC_URL);
  console.log("title =", doc.getName());

  sentence = doc.getBody().getText();
  console.log("sentence =", sentence);


  const add_circle  = '●';
  //文字列が一致するかを確認
  let keyword = 'TEST';                         // 検索したいキーワード
  let wordPlaceNum = sentence.indexOf(keyword); // キーワードの場所を文章の中から探す
  console.log('wordPlaceNum =', wordPlaceNum);

  // 関数化できそう。do_add_mark()
  // indexOfの結果で、キーワードが見つかる（wordPlaceNumが-1でない)限り続ける
  while(wordPlaceNum >= 0){
    // 文章全体を一度分解して結合する
    let first_words   = sentence.slice(0, wordPlaceNum);  // 前半部分
    let last_words    = sentence.slice(wordPlaceNum);     // 後半部分

    // 前半部分の最後の文字を確認し、すでに●がついていたら対応しない
    console.log("first_words.charAt(str.length - 1) ==", first_words.charAt(first_words.length - 1));

    // すでに●がついている場合、文字の追加がないため、wordPlaceNum + 1してから次の検索に映ることになる
    let overlappingCheck = first_words.charAt(first_words.length - 1);
    if(add_circle === overlappingCheck){

      // すでに●がついていたときはなにも処理せず結合
      sentence = first_words + last_words;
      // 次の検索に進む（1文字だけずらす)
      wordPlaceNum = sentence.indexOf(keyword, wordPlaceNum + 1);

    }
    else{
      // ●を結合
      sentence = first_words + add_circle + last_words;
      // ●を追加した分、wordPlaceNum+0だと●から検索。+1だとキーワードから検索（同じ処理の無限ループ）
      // +2にすればキーワードから1文字ずれたところから検索となる（正しい処理）
      // 次の検索に進む
      wordPlaceNum = sentence.indexOf(keyword, wordPlaceNum + 2);

    }
    console.log('wordPlaceNum2 =', wordPlaceNum);
  }

  //置換したテキストを挿入する
  const body = doc.getBody();
  body.clear() // 全消去
  var paragraphs = body.getParagraphs();
  var p1 = paragraphs[0];

  //段落にテキストを挿入する。
  p1.insertText( 0, sentence);

}