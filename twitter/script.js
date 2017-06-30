$(function(){
	var $imgUrl = window.opener.$('#screen_image').attr('src');
	var $imgUrl = $imgUrl.replace('data:image/png;base64,','');
	var $tweTxt = window.opener.$('textarea[name="tweTxt"]').val();
	var $oauth_token = $('#oauth_token').text();
	var $oauth_token_secret = $('#oauth_token_secret').text();

	$('#tweet').on('click', function () {
		$.ajax({
			url: 'tweet.php',
			type: 'post', // getかpostを指定(デフォルトは前者)
			dataType: 'json', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
			data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
				oauth_token: $oauth_token,
				oauth_token_secret: $oauth_token_secret,
				imgUrl: $imgUrl,
				tweTxt: $tweTxt
			}
		})
		// ・ステータスコードは正常で、dataTypeで定義したようにパース出来たとき
		.done(function (response) {
			alert('成功');
		})
		// ・サーバからステータスコード400以上が返ってきたとき
		// ・ステータスコードは正常だが、dataTypeで定義したようにパース出来なかったとき
		// ・通信に失敗したとき
		.fail(function () {
			alert('失敗');
		});
	});
});