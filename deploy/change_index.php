<?php
// ブランチのリストを配列で生成
// array(3) {
//   [0]=>string(3) "bar"
//   [1]=>string(3) "foo"
//   [2]=>string(6) "master"
// }
function branchList(){
  $branchList = array();
  $F_HEAD = file(".git/FETCH_HEAD", FILE_IGNORE_NEW_LINES);
  for($i=0;$i<count($F_HEAD);$i++){
    $F_split = preg_split ("/\t/", $F_HEAD[$i]);
    preg_match("/'([\s\S]*?)'/", $F_split[2], $F_branch);
    array_push($branchList, $F_branch[1]);
  }
  //var_dump($branchList);
  return $branchList;
}
// 現在のブランチを生成
// master
function branchNow(){
  $HEAD = file(".git/HEAD", FILE_IGNORE_NEW_LINES);
  $branchNow = preg_replace("/ref: refs\/heads\//", "", $HEAD[0]);
  //echo($branchNow);
  return $branchNow;
}

// 現在のブランチリスト・ブランチを取得
$branchAry = branchList();
$branchNow = branchNow();

// ブランチ切り替え用のHTMLを生成
$branchList = "";
$branchList .= '<div id="branch_table" class="table setting">';
$branchList .= '<p>ブランチの切り替え</p>';
$branchList .= '<select name="branch_list" id="branch_list">';
for($i=0;$i<count($branchAry);$i++){
  if($branchAry[$i] == $branchNow){
    $branchList .= '<option value="'.$branchAry[$i].'" selected>*'.$branchAry[$i].'</option>';
  } else {
    $branchList .= '<option value="'.$branchAry[$i].'">'.$branchAry[$i].'</option>';
  }
}
$branchList .= '</select>';
$branchList .= '<p id="branch_result">[結果]</p>';
$branchList .= '<button type="button" name="branch_change" id="branch_change">切り替え</button>';
$branchList .= '</div>';
// HTMLを表示
echo($branchList);

?>