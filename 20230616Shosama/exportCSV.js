// CSV出力
function exportCsv() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let sheetName = sheet.getName();
  let csvData = getInitialCsvData();
  let i = 15;

  while(true) {
    let date = sheet.getRange("C" + i).getValue();
    let status = sheet.getRange("A" + i).getValue();

    // 空の日付であり、かつ"未"や"済"のステータスでもない場合はループを抜ける
    if(!date && status != "未" && status != "済") {
      break;
    }

    let isChecked = sheet.getRange("B" + i).getValue();

    if(isChecked) {
      addDataFromSheet(sheet, csvData, i);
      sheet.getRange("A" + i).setValue('済');    // 済とマークする
      sheet.getRange("B" + i).setValue(false);   // チェックボックスをOFFにする
    }
    i++;
  }

  let fileName = getDayTime() + "_" + sheetName + ".csv";
  let file = DriveApp.createFile(fileName, csvData.join("\n"), MimeType.PLAIN_TEXT);
  Logger.log(file.getUrl());
  Browser.msgBox("CSVの出力が完了しました");
}

function addDataFromSheet(sheet, csvData, i) {
  let number  = sheet.getRange("U" + i).getValue();
  let asin    = sheet.getRange("L" + i).getValue();
  let price   = sheet.getRange("V" + i).getValue();
  let pcprice = (sheet.getRange("R" + i).getValue());
  const pPrice = (sheet.getRange("J" + i).getValue());
  const cPrice = (sheet.getRange("K" + i).getValue());

  let cost    = pcprice / number;
  if (number == "" || price == "" ) {
    Browser.msgBox('エラーが発生しました' + i + '行目の必須項目に空白があります');
  }
  else if (cost == ""){
    if(cPrice > 0 || pPrice > 0){
      // Browser.msgBox('現金購入価格は０ですが、ポイントまたはクーポン利用のためCSV出力します。pPrice =' + pPrice + 'cPrice =' + cPrice);
      processRow(csvData, asin, number, price, pcprice, cost, i);
    }
  }
  else{
    processRow(csvData, asin, number, price, pcprice, cost, i);
  }
}


function getInitialCsvData() {
  return [["SKU", "ASIN", "title", "number", "price", "cost", "akaji", "takane", "condition", "conditionNote", "priceTrace", "leadtime", "merchant_shipping_group_name", "delete"]];
}


function processRow(csvData, asin, number, price, pcprice, cost, rowNum) {
    let found = asin ? csvData.find(row => row[1] === asin) : null;

    if (found) {
        if (found[4] === price) {
            updateExistingData(found, number, pcprice);
        } else {
            showErrorForDifferentPrice(rowNum, asin, found[4], price);
            addNewData(csvData, asin, number, price, cost);
        }
    } else {
        addNewData(csvData, asin, number, price, cost);
    }
}

function updateExistingData(row, number, pcprice) {
    const beforeTotalCost = row[3] * row[5];
    row[3] += number; // updｓate number
    row[5] = Math.floor((beforeTotalCost + pcprice) / row[3]); // update cost
}

function showErrorForDifferentPrice(rowNum, asin, oldPrice, newPrice) {
    Browser.msgBox(`エラー: ${rowNum}行目のASIN (${asin}) の販売価格が異なります。元の価格は${oldPrice}円、新しい価格は${newPrice}円です。`);
}

function addNewData(csvData, asin, number, price, cost) {
    csvData.push(["", asin, "", number, price, cost, "", "", "11", "", "1", "", "", ""]);
}

function getDayTime() {
  let now = new Date();
  let year = now.getFullYear().toString().substr(-2); 
  let month = ('0' + (now.getMonth() + 1)).slice(-2);
  let day = ('0' + now.getDate()).slice(-2); 
  let hour = ('0' + now.getHours()).slice(-2); 
  let minute = ('0' + now.getMinutes()).slice(-2); 

  return year + month + day + "_" + hour + minute;
}