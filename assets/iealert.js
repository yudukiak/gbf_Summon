// http://qiita.com/w7tree/items/08334fbfaa24e9a8b0fb
var isMSIE = /*@cc_on!@*/false;
if (isMSIE) {
  if(confirm(
  '本サイトはInternet Explorerに対応しておりません。\n'+
  '閲覧するためには「Google Chrome」「Mozilla Firefox」などのブラウザをご利用ください。'+
  '対応ブラウザのダウンロードページに移動しますか？') == true) {
      location.href = "https://www.google.co.jp/chrome/browser/desktop/index.html";
  } else {
  }
}