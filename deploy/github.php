<?php
http_response_code(200);
// Noticeエラーだけを非表示に設定
error_reporting(E_ALL & ~E_NOTICE);
// タイムゾーンを設定
date_default_timezone_set("Asia/Tokyo");
// --------------------------------------------------------
// http://isometriks.com/verify-github-webhooks-with-php
// --------------------------------------------------------
function bad_secret(){
  header("Location: https://prfac.com/");
  exit;
}
$headers = getallheaders();
$hubSignature = $headers["X-Hub-Signature"];
// Split signature into algorithm and hash
list($algo, $hash) = explode("=", $hubSignature, 2);
// Get payload
$payload = file_get_contents("php://input");
// $payloadが空の時
if($payload == ""){
  bad_secret();
}
// JSONの処理
$array = json_decode($payload, true);
// キーの読み込み
$repositoryName = $array["repository"]["name"];
$repositoryFileName = "{$repositoryName}.php";
if(file_exists($repositoryFileName)){
  require_once $repositoryFileName;
} else {
  bad_secret();
}
// Calculate hash based on payload and the secret
$payloadHash = hash_hmac($algo, $payload, $Git_Secret);
// Check if hashes are equivalent
if($hash !== $payloadHash){
  bad_secret();
}

// --------------------------------------------------------
// Your code here.
// --------------------------------------------------------
// メッセージの処理
$message = $array["head_commit"]["message"];
$url     = $array["head_commit"]["url"];
$message = preg_replace ("/\n+.+/", "", $message);
// コミットされたブランチを取得
$comBranch = preg_replace("/refs\/heads\//", "", $array["ref"]);

// デプロイ用の関数
function deploy($GitDir, $GitBranch) {
  $command  = "";
  $command .= "cd {$GitDir};";
  $command .= "~/opt/bin/git checkout -b {$GitBranch} origin/{$GitBranch};";
  $command .= "~/opt/bin/git checkout {$GitBranch};";
  $command .= "~/opt/bin/git pull origin {$GitBranch};";
  $command .= "~/opt/bin/git fetch origin;";
  exec($command);
}

// コミットされたブランチによって切り替え
if($comBranch == "master"){
  deploy($GitDir_live, "master"); // 本番環境をデプロイ
  //deploy($GitDir_test, $varBranch); // テスト環境をデプロイ
  deploy($GitDir_test, "master"); // テスト環境をデプロイ
  // ツイートする
  require_once("{$GitDir_live}/twitter/library/tmhOAuth.php");
  $tmhOAuth = new tmhOAuth(array(
    "consumer_key"    => $API_Key,
    "consumer_secret" => $API_Secret,
    "user_token"      => $Access_Token,
    "user_secret"     => $Access_Token_Secret,
  ));
  $Tweet_string = "{$Tweet_string}\n\n{$message}\n{$url}";
  $tweet_update = $tmhOAuth->request(
    "POST",
    "https://api.twitter.com/1.1/statuses/update.json",
    array(
      "status" => $Tweet_string
    )
  );
} else {
  //deploy($GitDir_test, $varBranch); // テスト環境をデプロイ
  deploy($GitDir_test, $comBranch); // テスト環境をデプロイ
}

// ログの保存
$logFile = "deploy_{$repositoryName}.log";
$logTime = date("Y/m/d H:i:s");
$logStr = "{$logTime} ({$comBranch}) {$message}\n";
print $logStr;
var_dump(file_put_contents($logFile, $logStr, FILE_APPEND | LOCK_EX));

?>
