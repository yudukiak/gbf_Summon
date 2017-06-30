$(function(){
	var $imgUrl = window.opener.$('#screen_image').attr('src');
	var $imgUrl = $imgUrl.replace('data:image/png;base64,','');

	$('#tweet').on('click', function () {
		var $api_key = $('#api_key').val();
		var $api_secret = $('#api_secret').val();
		var $oauth_token = $('#oauth_token').val();
		var $oauth_token_secret = $('#oauth_token_secret').val();
		var $tweTxt = $('textarea[name="tweTxt"]').val();
		$.ajax({
			url: 'tweet.php',
			type: 'post', // getかpostを指定(デフォルトは前者)
			dataType: 'json', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
			data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
				api_key: $api_key,
				api_secret: $api_secret,
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
	$('textarea').bind('keydown keyup keypress change',function(){
		var thisValueLength = $(this).val().length;
		$('#140tweet p').text(140-thisValueLength);
	});
});