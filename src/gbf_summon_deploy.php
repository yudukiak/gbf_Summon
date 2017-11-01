<?php
// Noticeエラーだけを非表示に設定
error_reporting(E_ALL & ~E_NOTICE);
// タイムゾーンを設定
date_default_timezone_set("Asia/Tokyo");

// --------------------------------------------------------
// 各種キー
// --------------------------------------------------------
include "gbf_summon.php";

// --------------------------------------------------------
// http://isometriks.com/verify-github-webhooks-with-php
// --------------------------------------------------------
$secret = $Git_Secret;
$headers = getallheaders();
$hubSignature = $headers['X-Hub-Signature'];
// Split signature into algorithm and hash
list($algo, $hash) = explode('=', $hubSignature, 2);
// Get payload
$payload = file_get_contents('php://input');
// Calculate hash based on payload and the secret
$payloadHash = hash_hmac($algo, $payload, $secret);
// Check if hashes are equivalent
if ($hash !== $payloadHash) {
  // Kill the script or do something else here.
  die('Bad secret');
}

// --------------------------------------------------------
// Your code here.
// --------------------------------------------------------
// JSONの処理
$array = json_decode($payload, true);

// メッセージの処理
$message = $array["head_commit"]["message"];
$url     = $array["head_commit"]["url"];
$messPat = "/\n+.+/"; // 対象
$messRep = "";        // 結果
$message = preg_replace ($messPat, $messRep, $message);

// ブランチの判断
$branch  = $array["ref"];
$branPat = "/refs\/heads\//";
$branRep = "";
$branch  = preg_replace ($branPat, $branRep, $branch);
if($branch == "master"){
  $command = "cd summon;~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/master";
  exec($command);
  // ツイートする
  $string  = "#フレ石編成的ななにか_更新ログ\n\n".$message."\n".$url;
  require_once("summon/twitter/library/tmhOAuth.php");
  $tmhOAuth = new tmhOAuth(array(
    'consumer_key'    => $API_Key,
    'consumer_secret' => $API_Secret,
    'user_token'      => $Access_Token,
    'user_secret'     => $Access_Token_Secret,
  ));
  $tweet_update = $tmhOAuth->request(
    'POST',
    'https://api.twitter.com/1.1/statuses/update.json',
    array(
      'status' => $string
    )
  );
} else {
  $command = "cd summon.bac;~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/".$branch;
  exec($command);
}

// ログの保存
$file    = "gbf_summon_deploy.log";
$logStr  = date("Y/m/d H:i:s")." (".$branch.") ".$message."\n";
var_dump(file_put_contents($file, $logStr, FILE_APPEND | LOCK_EX));


?>
