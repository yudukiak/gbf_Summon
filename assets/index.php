<?php
  header("Content-Type: application/json");
  function sanitize_output($buffer) {
    $buffer = preg_replace("/\r\n|\n|\r|\s/s", "", $buffer); // 改行＆スペースを削除
    return $buffer;
  }
  ob_start("sanitize_output");
  if ( isset($_GET["json"]) && preg_match("/^(echo|foxtrot)$/i", $_GET["json"]) ) {
    $data = file_get_contents("./{$_GET["json"]}");
  } else {
    $data = json_encode(["res" => "negative"]);
  }
  echo $data;
?>