//*********************************
// グローバル変数の宣言
//*********************************
// GoogleスプレッドシートのIDを変数に格納
var spreadsheetId = '13ZNaVVSFikTNFNm0y2sFE2djS0L3cm8PGJBxh3aWlvk';
// スプレッドシートの最大列を設定
const MAX_COL = 2;

let g_gas_data_arr;         // スプレッドシート情報格納用のグローバル配列
let g_doc_url;              // GoogleドキュメントのURL
let g_keyword_arr;          // キーワード一覧格納用のグローバル配列

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
      g_gas_data_arr[row][col] = spreadsheet_data[row][col];
      console.log("g_gas_data_arr" + "[" + row + "]" + "[" + col + "]=" + g_gas_data_arr[row][col]);
    }
  }

  // 各種設定
  g_doc_url = g_gas_data_arr[1][2]; // GoogleドキュメントのURLを取得

  //配列をコピーしておく(debug)
  // g_org_gas_data_arr = [...g_gas_data_arr];

  // 検索するキーワードだけが入った配列を作っておき、のちほどキーワード検索関数でループする

  console.log("keyword1 =",g_gas_data_arr[1][0]);
  console.log("keyword2 =",g_gas_data_arr[2][0]);

  console.log("g_gas_data_arr.length=", g_gas_data_arr.length);

  g_keyword_arr = new Array((g_gas_data_arr.length));

  for(let i = 0; i < g_gas_data_arr.length; i++){
    g_keyword_arr[i] = g_gas_data_arr[i][0];
  }

  for(let j = 1; j < g_gas_data_arr.length; j++){
    console.log("g_keyword_arr" + "["+ j + "]", g_keyword_arr[j]);
  }
}

//*********************************
// キーワード検索開始(main)
//*********************************
function doSearch(){

  // スプレッドシートのデータ読み込み
  let gas_data = GetSpreadsheet();
  // Googleスプレッドシートの情報を設定
  getGASdata(gas_data);

  let sentence = 0; //文章の初期化
  console.log("doSearch!!");

  // Googleドキュメントの情報を読み取る
  const DOC_URL = g_doc_url; 
  const doc = DocumentApp.openByUrl(DOC_URL);
  console.log("title =", doc.getName());

  // Googleドキュメントの文章を取得
  sentence = doc.getBody().getText();
  console.log("before sentence =", sentence);

  // 文字列が一致するかを確認
  let keyword = 'TEST'; // 検索したいキーワード

  // キーワードの数だけループする。i=0にはタイトルが入っているため、i=1から開始
  for(let i = 1; i < g_gas_data_arr.length; i++){
    keyword = g_keyword_arr[i];
    console.log("keyword"+ keyword + "start*************");
    sentence = do_add_mark(keyword, sentence);
    console.log("keyword"+ keyword + "end*************");
  }

  // マークをつける
  // sentence = do_add_mark(keyword, sentence);

  console.log("after sentence =", sentence);

  // 本対応は新規ドキュメント作成。ただ、Debugが面倒なためにコメントアウト中。
  // Googleドキュメントを別で新規作成する（引数はファイル名）
  // let newDoc = DocumentApp.create('NewDocument');

  // Googleドキュメントを上書き
  // doRewriteDoc(newDoc, sentence);
  doRewriteDoc(doc, sentence);

}

//*********************************
// キーワードを元にマークをつける
//*********************************
function do_add_mark(keyword, sentence){

  const add_circle  = '●';
  let wordPlaceNum = sentence.indexOf(keyword); // キーワードの場所を文章の中から探す

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

  return sentence;
}

//*********************************
// Googleドキュメントを上書き
//*********************************
function doRewriteDoc(doc, sentence){

  // 置換したテキストを挿入する
  const body = doc.getBody();
  body.clear(); // 全消去
  var paragraphs = body.getParagraphs();
  var p1 = paragraphs[0];

  // 段落にテキストを挿入する。
  p1.insertText( 0, sentence);

}