<?php
// Noticeエラーだけを非表示に設定
error_reporting(E_ALL & ~E_NOTICE);

// 必要な情報を取ってくる
include '../../gbf_summon.php';

// http://isometriks.com/verify-github-webhooks-with-php
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
//
// Your code here.
//
// --------------------------------------------------------

// GitHubよりプル
exec('cd ../;~/opt/bin/git pull');

// JSONの処理
$json = file_get_contents('php://input');
$array = json_decode($json, true);
// メッセージの処理
//$message = $array["commits"][0]["message"];
$message = $array["head_commit"]["message"];
//$url     = $array["commits"][0]["url"];
$url     = $array["head_commit"]["url"];
$pattern = "/\n+.+/"; // 対象
$replace = "";        // 結果
$message = preg_replace ($pattern, $replace, $message);
$string  = "#フレ石編成的ななにか_更新ログ\n\n".$message."\n".$url;
//thmOAuth.phpを読み込む
require_once("../twitter/library/tmhOAuth.php");
//初期設定
$tmhOAuth = new tmhOAuth(array(
  'consumer_key' => $API_Key,
  'consumer_secret' => $API_Secret,
  'user_token' => $Access_Token,
  'user_secret' => $Access_Token_Secret,
));
//ツイートしたい文章
$text = $string;
//ツイートする
$tweet_update = $tmhOAuth->request(
  'POST', //リクエストの種類（POST/GETがある）
  'https://api.twitter.com/1.1/statuses/update.json', //ツイート用のTwitter REST APIを指定
  array(
    'status' => $text //ツイートしたい文章を指定
  )
);

?>
