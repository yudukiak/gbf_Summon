<?php
/* ********************
　https://www.imamura.biz/blog/22873
******************** */
// Content-TypeをJSONに指定する
header('Content-Type: application/json');
// エラーを出さないように文字列として安全に展開する
foreach (['api_key', 'api_secret', 'oauth_token', 'oauth_token_secret', 'imgUrl', 'tweTxt'] as $v) {
	$$v = (string)filter_input(INPUT_POST, $v);
}
echo json_encode(compact('data'));

//thmOAuth.phpを読み込む
require_once("./library/tmhOAuth.php");
//初期設定
$tmhOAuth = new tmhOAuth(array(
	'consumer_key' => $api_key,
	'consumer_secret' => $api_secret,
	'user_token' => $oauth_token,
	'user_secret' => $oauth_token_secret,
));

//画像設定
$image = $imgUrl;
//画像アップロード
$image_upload = $tmhOAuth->request(
	'POST', //リクエストの種類（POST/GETがある）
	'https://upload.twitter.com/1.1/media/upload.json', //画像アップロード用のTwitter REST APIを指定
	array(
		'media_data' => $image //画像データを指定
	)
);
//画像id格納
$decode = json_decode($tmhOAuth->response["response"], true); //JSONデコードして
$media_id = $decode['media_id_string']; //「media_id_string」の値を格納

//ツイートしたい文章
$text = $tweTxt;

//画像付きでツイートする
$tweet_update = $tmhOAuth->request(
	'POST', //リクエストの種類（POST/GETがある）
	'https://api.twitter.com/1.1/statuses/update.json', //ツイート用のTwitter REST APIを指定
	array(
		'media_ids' => $media_id, //格納した画像idを指定
		'status' => $text //ツイートしたい文章を指定
	)
);

?>