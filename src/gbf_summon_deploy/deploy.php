<?php
// ディレクトリを指定
$gbfDir = realpath("../");
$mainDir = $gbfDir."/summon";
$testDir = $gbfDir."/summon.test";
//$mainDir = $gbfDir."/test_repository";
//$testDir = $gbfDir."/test_repository.test";

// 現在のブランチを取得
function now_branch($targetDir) {
  $H_dir  = $targetDir."/.git/HEAD";
  $HEAD   = file($H_dir, FILE_IGNORE_NEW_LINES);
  $F_dir  = $targetDir."/.git/FETCH_HEAD";
  $F_HEAD = file($F_dir, FILE_IGNORE_NEW_LINES);
  for($i=0;$i<count($F_HEAD);$i++){
    $F_split = preg_split ("/\t/", $F_HEAD[$i]);
    //$F_split[0] e1337e2bfd7ad53ea68878e947ce07ba6af9d7ff
    //$F_split[2] branch 'master' of github.com:micelle/test_repository
    if($F_split[0] == $HEAD[0]){
      preg_match("/'([\s\S]*?)'/", $F_split[2], $F_match);
      return $F_match[1];
    }
  }
}

// 本番環境
function main_deploy($mainDir) {
  $command = "cd ".$mainDir.";~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/master";
  exec($command);
}

// テスト環境
function test_deploy($testDir) {
  $nowBranch = now_branch($testDir);
  $command = "cd ".$testDir.";~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/".$nowBranch;
  exec($command);
}

?>