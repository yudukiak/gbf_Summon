<?php
// PHPが吐き出すHTMLファイルを『自動的に最小化する』スクリプト
// https://manablog.org/php-html-minify/
function sanitize_output($buffer) {
	$search = array(
		'/\>[^\S ]+/s',      // strip whitespaces after tags, except space
		'/[^\S ]+\</s',      // strip whitespaces before tags, except space
		'/(\s)+/s',          // shorten multiple whitespace sequences
		'/<!--[\s\S]*?-->/s', // コメントを削除
		'/\s/s', // スペース全て削除
		'/,{"class":"","rarity":"","type":"","id":"","name":"","rank0":"","rank3":"","rank4":""}/s' // JSONの不要な箇所を削除
	);
	$replace = array(
		'>',
		'<',
		'\\1',
		'',
		'',
		''
	);
	$buffer = preg_replace($search, $replace, $buffer);
	return $buffer;
}
ob_start("sanitize_output");
include("./echo");
?>
