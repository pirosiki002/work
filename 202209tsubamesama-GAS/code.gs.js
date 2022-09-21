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


  //文字列が一致するかを確認
  let keyword = 'テスト';
  let wordPlaceNum = sentence.indexOf(keyword);
  console.log('wordPlaceNum =', wordPlaceNum);

  //一致したら先頭に●をくっつける（insertとかを使うことになるかと）
  // sentence = sentence.replace("テスト", "●テスト");

  //●の分、一文字分増えるため、wordPlaceNum + 2を検索すれば良さそう。

  //次の検索に進む(これができるかが問題・・)
  wordPlaceNum = sentence.indexOf(keyword, wordPlaceNum + 1);
  console.log('wordPlaceNum2 =', wordPlaceNum);

  //indexOfの結果＝wordPlaceNumが-1でない限り続ければOKか。

  //置換したテキストを挿入する
  // const body = doc.getBody();
  // body.clear() // 全消去
  // var paragraphs = body.getParagraphs();
  // var p1 = paragraphs[0];

  //段落にテキストを挿入する。
  // p1.insertText( 0, sentence);


}

function searchWord(){

}