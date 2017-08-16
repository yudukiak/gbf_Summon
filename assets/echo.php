<?php
// PHPが吐き出すHTMLファイルを『自動的に最小化する』スクリプト
// https://manablog.org/php-html-minify/
function sanitize_output($buffer) {
  $search = array(
    '/\r\n|\n|\r/s', // 改行を削除
    '/\s/s', // スペース全て削除
    '/,{"class":"","rarity":"","type":"","id":"","name":"","rank0":"","rank3":"","rank4":""}/s' // JSONの不要な箇所を削除
  );
  $replace = array(
    '',
    '',
    ''
  );
  $buffer = preg_replace($search, $replace, $buffer);
  return $buffer;
}
ob_start("sanitize_output");
include("./echo");
?>
