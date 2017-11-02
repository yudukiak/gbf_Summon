<?php
// ブランチ取得用PHPを読み込み
require_once "branch.php";

// ディレクトリを指定
$gbfDir = realpath("../");
$mainDir = $gbfDir."/summon";
$testDir = $gbfDir."/summon.test";
//$mainDir = $gbfDir."/test_repository";
//$testDir = $gbfDir."/test_repository.test";

// 現在のブランチを取得
$nowBranch = now_branch($testDir);

// ブランチ切り替え用のHTMLを生成
$branchList = "";
$branchList .= "<p>ブランチの切り替え</p>";
$branchList .= '<select name="branch_list" id="branch_list">';
for($i=1;$i<count($nowBranch);$i++){
  if($nowBranch[$i] == $nowBranch[0]){
    $branchList .= '<option value="'.$nowBranch[$i].'" selected>*'.$nowBranch[$i].'</option>';
  } else {
    $branchList .= '<option value="'.$nowBranch[$i].'">'.$nowBranch[$i].'</option>';
  }
}
$branchList .= '</select>';
$branchList .= '<p id="branch_result">[結果]</p>';
$branchList .= '<button type="button" name="branch_change" id="branch_change">切り替え</button>';
// HTMLを表示
echo($branchList);

?>