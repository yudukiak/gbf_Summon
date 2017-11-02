<?php
require_once "deploy.php";

header('Content-Type: application/json');
$data = "{$_POST['branch']}へ切り替えました";
$varBranch = (string)filter_input(INPUT_POST, 'branch');

if($varBranch !== ""){
  $command = "cd ".$testDir.";~/opt/bin/git fetch origin;~/opt/bin/git reset --hard origin/".$varBranch;
  exec($command);
}

echo json_encode(compact('data'));

?>