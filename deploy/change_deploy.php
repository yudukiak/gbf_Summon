<?php
// ディレクトリを指定
$gbfDir = realpath("../../");
$mainDir = $gbfDir."/summon";
$testDir = $gbfDir."/summon.test";

header('Content-Type: application/json');
$data = "{$_POST['branch']}へ切り替えました";
$varBranch = (string)filter_input(INPUT_POST, 'branch');

if($varBranch !== ""){
  $command = "cd ".$testDir.";~/opt/bin/git fetch origin;~/opt/bin/git checkout --force origin/".$varBranch.";~/opt/bin/git reset --hard origin/".$varBranch;
  exec($command);
}

echo json_encode(compact('data'));

?>