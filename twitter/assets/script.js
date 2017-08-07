$(function(){
  var $imgUrl = window.opener.$('#screen_image').attr('src');
  var $imgUrl = $imgUrl.replace('data:image/png;base64,','');
  // http://qiita.com/mpyw/items/62e6e415f86eb30a5ff4
  $('#tweet').on('click', function () {
    var num = $('#140tweet').text();
    if (num >= 0) {
      // キーボード操作などにより、オーバーレイが多重起動するのを防止する
      $(this).blur(); // ボタンからフォーカスを外す
      if($('#overlay')[0]) return false; // 新しくモーダルウィンドウを起動しない
      // オーバーレイを出現させる
      $('body').append('<div id="overlay"><div class="loader"></div></div>');
      $('#overlay').fadeIn('slow');

      // 投稿処理
      //var $api_key = $('#api_key').val();
      //var $api_secret = $('#api_secret').val();
      var $oauth_token = $('#oauth_token').val();
      var $oauth_token_secret = $('#oauth_token_secret').val();
      var radioValue = $('.radio').find('input:radio:checked').val(); // yes|no
      var tweTxt = $('textarea[name="tweTxt"]').val();
      var $tweTxt = (function() {
        if(radioValue=='yes') return tweTxt+' #フレ石編成的ななにか';
        if(radioValue=='no') return tweTxt;
      })();
      $.ajax({
        url: 'tweet.php',
        type: 'post', // getかpostを指定(デフォルトは前者)
        dataType: 'json', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
        data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
          //api_key: $api_key,
          //api_secret: $api_secret,
          oauth_token: $oauth_token,
          oauth_token_secret: $oauth_token_secret,
          imgUrl: $imgUrl,
          tweTxt: $tweTxt
        }
      })
      // ・ステータスコードは正常で、dataTypeで定義したようにパース出来たとき
      .done(function (response) {
        //alert('成功');
        // overlayをフェードアウトした後に
        $('#overlay').fadeOut('slow', function(){
          // overlayrを削除する
          $('#overlay').remove();
            // 結果
          $('#tweet').after('<p>ツイートに成功しました。</p>');
        });
      })
      // ・サーバからステータスコード400以上が返ってきたとき
      // ・ステータスコードは正常だが、dataTypeで定義したようにパース出来なかったとき
      // ・通信に失敗したとき
      .fail(function () {
        $('#overlay').fadeOut('slow', function(){
          $('#overlay').remove();
          $('#tweet').after('<p>ツイートに失敗しました。<br>このウィンドウを閉じ、改めてお試し下さい。</p>');
        });
      });
    } else {
      alert('文字数がオーバーしてます。');
    }
  });

  $('.radio').on('click', function(event){
    var radioValue=$(this).find('input:radio:checked').val(); // yes|no
    var radioValueYN=(function() {
      if(radioValue=='yes') return '128';
      if(radioValue=='no') return '140';
    })();
    console.log(radioValueYN);
    $('textarea').attr('maxlength', radioValueYN);
    textareaLengh();
  });
  $('textarea').bind('keydown keyup keypress change',function(){
    textareaLengh();
  });
  function textareaLengh(){
    var textMax = $('textarea').attr('maxlength');
    var thisValueLength = $('textarea').val().length;
    $('#140tweet').text(textMax-thisValueLength);
  }
});
