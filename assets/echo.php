<?php
// PHPが吐き出すHTMLファイルを『自動的に最小化する』スクリプト
// https://manablog.org/php-html-minify/
function sanitize_output($buffer) {
  $search = array(
    '/\r\n|\n|\r|\s/s' // 改行＆スペースを削除
  );
  $replace = array(
    ''
  );
  $buffer = preg_replace($search, $replace, $buffer);
  return $buffer;
}
ob_start("sanitize_output");
include("./echo");
?>
