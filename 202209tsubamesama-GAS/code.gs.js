function myFunction() {
  console.log("myFunction!!");  
}

let sentence = 0;

function doSearch(){
  console.log("doSearch!!");

  //Googleドキュメントの情報を読み取る
  // const DOC_URL = '1E9ADJL7qDyzZjgQHyAhwjf73Kwj-3h6KuBCDw3W8ERg'; 
  const DOC_URL = 'https://docs.google.com/document/d/1E9ADJL7qDyzZjgQHyAhwjf73Kwj-3h6KuBCDw3W8ERg/edit'; 
  const doc = DocumentApp.openByUrl(DOC_URL);
  console.log("title =", doc.getName());

  sentence = doc.getBody().getText();
  console.log("sentence =", sentence);

  //指定したワードで検索をかける（ループする必要がありそう。
  let index = sentence.indexOf("テスト", 0);
  // let index = sentence.match("テスト");
  // let index = sentence.match(/テスト/);
  console.log("index true or false =", index);

  while(0 <= index){
    sentence = sentence.replace("テスト", "TEST");
    console.log("sentence replace =", sentence);
    index = sentence.indexOf("テスト", 0);
  }

  //変更した文字の色を変える
  // sentence.editAsText().setForegroundColor('#ff0000');

  //置換したテキストを挿入する
  const body = doc.getBody();
  body.clear() // 全消去
  var paragraphs = body.getParagraphs();
  var p1 = paragraphs[0];

  //段落にテキストを挿入する。
  // p1.insertText( 0, "text" );
  // p1.insertText( 0, "-----");
  p1.insertText( 0, sentence);
  //段落にテキストを追加する。
  // p1.appendText("text");

  //変更した文字の色を変える
  // p1.editAsText().setForegroundColor('#ff0000');

}

function searchWord(){

}