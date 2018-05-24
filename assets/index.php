<?php
  header("Content-Type: application/json");
  function sanitize_output($buffer) {
    $buffer = preg_replace('/\r\n|\n|\r|\s/s', '', $buffer); // 改行＆スペースを削除
    return $buffer;
  }
  ob_start("sanitize_output");
  $json = $_GET["json"];
  include("./{$json}");
?>