javascript: (() => {
    /* クリップボードにコピーする関数 */
    const copyToClipboard = () => {
        const textArea = document.createElement("textarea");
        textArea.textContent = generateText();
        const bodyElement = document.getElementsByTagName("body")[0];
        bodyElement.appendChild(textArea), textArea.select();
        const executed = document.execCommand("copy");
        bodyElement.removeChild(textArea);
    },

    /* 商品情報をテキスト形式で生成する関数 */
    generateText = () => {
        let resultText = "";
        let index = 0;
        let productName, price, source, element;
        let url, iterator;
        let asin = "";
        let doc = document;
        let dt = new Date();
        let year = dt.getFullYear();
        let month = ("00" + (dt.getMonth() + 1)).slice(-2);
        let date = ("00" + dt.getDate()).slice(-2);
        let ymd = year + "/" + month + "/" + date;
        url = window.location.href;
        /* URLがAmazonを含む場合、以下の処理を行う */
        if (url.match(/amazon/)) {
            source = "Amazon";
            asin = url.split("/");
            for (iterator = 0; iterator <= (asin.length - 1); iterator++) {
                if (asin[iterator] == "dp") {
                    asin = asin[iterator + 1];
                    if (asin.indexOf("?") > 0) {
                        asin = asin.substring(0, asin.indexOf("?"));
                    }
                    break;
                }
                if (asin[iterator] == "product") {
                    asin = asin[iterator + 1];
                    if (asin.indexOf("?") > 0) {
                        asin = asin.substring(0, asin.indexOf("?"));
                    }
                    break;
                }
            }
            try {
                price = doc.getElementById("apex_desktop");
                if (price != null) {
                    if (price.getElementsByClassName("a-price-whole")[0] != null) {
                        price = price.getElementsByClassName("a-price-whole")[0].textContent.replace(/[^0-9]/g, "");
                    } else {
                        price = price.getElementsByClassName("a-price a-text-price a-size-medium apexPriceToPay")[0].getElementsByClassName("a-offscreen")[0].textContent.replace(/[^0-9]/g, "");
                    }
                } else {
                    price = doc.getElementsByClassName("a-size-medium a-color-price header-price a-text-normal")[0].textContent.replace(/[^0-9]/g, "");
                }
            } catch (e) {
                console.log(e);
                console.log("カート価格なし");
                price = "";
            }
            productName = doc.getElementById("productTitle").textContent.trim();
            url = `https://www.amazon.co.jp/dp/${asin}`;
            productName = '%27=HYPERLINK("%27' + url + '%27","%27' + productName + '%27")%27';
            resultText = ymd + "\t" + source + "\t" + productName + "\t" + price + "\t\t\t\t\t\t10%\t" + asin;
            console.log(resultText);
        } else {
            if (url.match(/biccamera.rakuten.co.jp/)) {
                /* 楽天ビックのページから情報を抽出 */
                source = "楽天ビック";
                productName = doc.getElementsByClassName("p-productDetailv2__title")[0].textContent;
                price = doc.getElementsByClassName("p-productDetailv2__priceValue")[0].textContent.replace(/[^0-9]/g, "");
            } else if (url.match(/books.rakuten/)) {
                /* 楽天ブックスのページから情報を抽出 */
                source = "楽天ブックス";
                element = doc.title;
                index = element.indexOf("-");
                productName = element.substring(0, index);
                index = element.indexOf(":");
                productName = productName.substring(index + 2);
                price = doc.getElementsByClassName("productPrice")[0].querySelectorAll(".price");
                price = price[price.length - 1].innerHTML;
            } else if (url.match(/store.shopping.yahoo.co.jp/)) {
                /* Yahooショッピングのページから情報を抽出 */
                source = doc.getElementsByClassName("elName")[0].innerHTML;
                productName = doc.getElementsByClassName("mdItemName")[0].getElementsByClassName("elName")[0].textContent.replace(/\n/g, "");
                productName = productName.trim();
                price = doc.getElementsByClassName("elPriceNumber")[doc.getElementsByClassName("elPriceNumber").length - 1].innerHTML;
            } else if (url.match(/lohaco.yahoo.co.jp/)) {
                /* LOHACOのページから情報を抽出 */
                source = "LOHACO by ASKUL";
                productName = doc.getElementsByClassName("text-h3 text-sm-h1")[0].innerHTML;
                price = doc.getElementsByClassName("text-h3 text-sm-h1 font-weight-bold")[0].innerHTML;
            } else if (url.match(/rakuten/)) {
                /* 楽天のページから情報を抽出 */
                element = doc.title;
                index = element.indexOf("：");
                source = element.slice(index + 1);
                productName = element.substring(0, index);
                productName = productName.slice(6);
                element = doc.getElementsByTagName("body")[0].innerHTML;
                const found = element.match(/data-price.+/);
                price = found[0].match(/[0-9]+/)[0];
            } else {
                return;
            }
            price = price.replace(/<("[^"]*"|"[^"]*"|[^"">])*>/g, "").replace(/[^0-9]/g, "");
            productName = '%27=HYPERLINK("%27' + url + '%27","%27' + productName.trim().replace(/\n/g, "").replace(/%E3%80%80/g, "").replace(/[\x20\t]+/g, "") + '%27")%27';
            resultText = ymd + "\t" + source + "\t" + productName + "\t" + price;
            console.log(resultText);
        }
        if (resultText != "") {
            let message = document.createElement('div');
            message.textContent = 'コピーしました!!';
            document.body.appendChild(message);
            setTimeout(function() {
                document.body.removeChild(message);
            }, 3000);
        }
        return resultText;
    };
    copyToClipboard();
})();
