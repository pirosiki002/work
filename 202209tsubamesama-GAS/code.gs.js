function myFunction() {
  console.log("myFunction!!");  
}

let sentence = 0;

function doSearch(){
  console.log("doSearch!!");

  // Googleドキュメントの情報を読み取る
  // const DOC_URL = '1E9ADJL7qDyzZjgQHyAhwjf73Kwj-3h6KuBCDw3W8ERg'; 
  const DOC_URL = 'https://docs.google.com/document/d/1E9ADJL7qDyzZjgQHyAhwjf73Kwj-3h6KuBCDw3W8ERg/edit'; 
  const doc = DocumentApp.openByUrl(DOC_URL);
  console.log("title =", doc.getName());

  sentence = doc.getBody().getText();
  console.log("sentence =", sentence);


  const add_circle  = '●';
  //文字列が一致するかを確認
  let keyword = 'TEST';
  let wordPlaceNum = sentence.indexOf(keyword);
  console.log('wordPlaceNum =', wordPlaceNum);

  //indexOfの結果＝wordPlaceNumが-1でない限り続ければOK
  while(wordPlaceNum >= 0){
    //一致したら先頭に●をくっつける（insertとかを使うことになるかと）
    //一度分解して結合する
    let first_words   = sentence.slice(0, wordPlaceNum);
    let last_words    = sentence.slice(wordPlaceNum);
    console.log(first_words + add_circle + last_words)

    //first_wordの最後の文字が●なら、すでに対応済のキーワードということ。
    //すでに●がついていたときは結合しない処理が必要
    sentence = first_words + add_circle + last_words;

    //すでに●がついている場合、文字の追加がないため、wordPlaceNum + 1してから次の検索に映ることになる

    //●の分、一文字分増えるため、wordPlaceNum + 2を検索すれば良さそう。
    //(+0だと●から検索。+1だとキーワードから検索。+2にすればキーワードから1文字ずれたところから検索となる)
    //次の検索に進む
    wordPlaceNum = sentence.indexOf(keyword, wordPlaceNum + 2);
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