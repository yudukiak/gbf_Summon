<?php
header('Content-Type: application/json');
$varBranch = $_POST['branch'];

if($varBranch !== ""){
  $command  = "";
  $command .= "cd ../;";
  $command .= "~/opt/bin/git checkout {$varBranch};";
  $command .= "~/opt/bin/git pull origin {$varBranch};";
  $command .= "~/opt/bin/git fetch origin;";
  exec($command);
  $data = "{$varBranch}へ切り替えました";
  echo json_encode(compact('data'));
}

?>