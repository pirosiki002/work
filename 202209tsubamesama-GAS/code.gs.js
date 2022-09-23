function myFunction() {
  console.log("myFunction!!");  
}

let sentence = 0;

function doSearch(){
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

function searchWord(){

}