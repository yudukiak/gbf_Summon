<?php
// Noticeエラーだけを非表示に設定
error_reporting(E_ALL & ~E_NOTICE);
// タイムゾーンを設定
date_default_timezone_set("Asia/Tokyo");

// --------------------------------------------------------
// 各種キー
// --------------------------------------------------------
require_once "../../gbf_summon.php";
//require_once "../test_repository.php";

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
// $payloadが空の時
if ($payload == "") {
  bad_secret();
}
// Calculate hash based on payload and the secret
$payloadHash = hash_hmac($algo, $payload, $secret);
// Check if hashes are equivalent
if ($hash !== $payloadHash) {
  // Kill the script or do something else here.
  //die('Bad secret');
  bad_secret();
}
function bad_secret() {
  http_response_code(301);
  header("Location: https://prfac.com/");
  exit;
}

// --------------------------------------------------------
// Your code here.
// --------------------------------------------------------
// ブランチ取得用PHPを読み込み
require_once "branch.php";
// ディレクトリを指定
$gbfDir = realpath("../../");
$mainDir = $gbfDir."/summon";
$testDir = $gbfDir."/summon.test";
//$mainDir = $gbfDir."/test_repository";
//$testDir = $gbfDir."/test_repository.test";

// JSONの処理
$array = json_decode($payload, true);
// メッセージの処理
$message = $array["head_commit"]["message"];
$url     = $array["head_commit"]["url"];
$message = preg_replace ("/\n+.+/", "", $message);
// コミットされたブランチを取得
$comBranch = preg_replace("/refs\/heads\//", "", $array["ref"]);

// コミットされたブランチによって切り替え
if($comBranch == "master"){
  main_deploy($mainDir); // 本番環境をデプロイ
  test_deploy($testDir); // テスト環境をデプロイ
  // ツイートする
  $string  = "#フレ石編成的ななにか_更新ログ\n\n".$message."\n".$url;
  require_once($gbfDir."../twitter/library/tmhOAuth.php");
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
  test_deploy($testDir); // テスト環境をデプロイ
}

// 本番環境のデプロイ
function main_deploy($mainDir) {
  $command = "cd ".$mainDir.";~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/master";
  exec($command);
}
// テスト環境のデプロイ
function test_deploy($testDir) {
  $nowBranch = now_branch($testDir);
  $command = "cd ".$testDir.";~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/".$nowBranch[0];
  exec($command);
}

// ログの保存
$file   = "deploy.log";
$logStr = date("Y/m/d H:i:s")." (".$comBranch.") ".$message."\n";
var_dump(file_put_contents($file, $logStr, FILE_APPEND | LOCK_EX));

?>
