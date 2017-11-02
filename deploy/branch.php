<?php
// 現在のブランチを取得（配列）
function now_branch($targetDir) {
  $branchList = array(); // リスト（配列）を準備
  $H_dir  = $targetDir."/.git/HEAD";
  $HEAD   = file($H_dir, FILE_IGNORE_NEW_LINES);
  $F_dir  = $targetDir."/.git/FETCH_HEAD";
  $F_HEAD = file($F_dir, FILE_IGNORE_NEW_LINES);
  for($i=0;$i<count($F_HEAD);$i++){
    $F_split = preg_split ("/\t/", $F_HEAD[$i]);
    //$F_split[0] e1337e2bfd7ad53ea68878e947ce07ba6af9d7ff
    //$F_split[2] branch 'master' of github.com:micelle/test_repository
    preg_match("/'([\s\S]*?)'/", $F_split[2], $branch_list);
    array_unshift($branchList, $branch_list[1]); // 各ブランチ名を配列へ入れる
    if($F_split[0] == $HEAD[0]){
      preg_match("/'([\s\S]*?)'/", $F_split[2], $F_match);
      $nowF_match = $F_match[1];
    }
  }
  array_unshift($branchList, $nowF_match); // 現在のブランチ名を配列へ入れる
  return $branchList;
}

?>