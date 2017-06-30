$(function(){
/* ********************
　初期設定
******************** */
// 変数設定
var $summon_screeen=$('#summon_screeen');
var alldata=[]; // すべてのデータを保持しておく配列
var filterdata=[]; // フィルターを掛けたデータを保持する配列
$.getJSON('assets/echo',init); // JSONを取得
function init(data){
	alldata=data; // 全データを保持しておく
	filterdata=alldata; // とりあえず全データを代入しておく
	$('#summon_setting div[class^="type"]').each(function(){
		var $this_parent_class=$(this).attr('class');
		list_display($this_parent_class); // リスト生成
		radio_display($this_parent_class); // 3凸・4凸ボタン
	});
	table_display(); // 一覧表示
}
/* ********************
　リスト生成の関数
******************** */
function list_display($this_parent_class){
	var $this_parent_class=$('#summon_setting .'+$this_parent_class);
	var ntype=$this_parent_class.attr('class');
	var nselect=$this_parent_class.data('select');
	var vtype=$this_parent_class.find('[name=c_type]').val();
	var vrarity=$this_parent_class.find('[name=c_rarity]').val();
	for(var n=0; n<filterdata.length; n++){
		var ftype=filterdata[n].type;
		var frarity=filterdata[n].rarity;
		var fclass=filterdata[n].class;
		var fname=filterdata[n].name;
		var fid=filterdata[n].id;
		var fselected=(function() {
			if(
				fname.match(/マグナ/)&&ntype.match(/[1-7]/) ||
				fname.match(/グランデ/)&&ntype.match(/8/) ||
				fname.match(/ホワイトラビット/)
			) return 'selected';
			return '';
		})();
		if (ftype.match(/type0/) && frarity===vrarity && fclass.match(nselect)){
			$('.type8 .c_summon').append('<option value='+fid+'>'+fname+'</option>');
		} else if (ftype.match(vtype) && frarity===vrarity && fclass.match(nselect)){
			$('.'+ntype+' .c_summon').append('<option value='+fid+' '+fselected+'>'+fname+'</option>');
		}
	}
}
/* ********************
　3凸・4凸ボタンを有効化・無効化の関数
******************** */
function radio_display($this_parent_class){
	var $this_parent_class=$('#summon_setting .'+$this_parent_class);
	var vc_summon=$this_parent_class.find('.c_summon').val();
	for(var n=0; n<filterdata.length; n++){
		if (filterdata[n].id.match(vc_summon)){
			var $label_0=$this_parent_class.find('.radio label:eq(0)'); // 3凸のボタン（ラベル）
			var $label_1=$this_parent_class.find('.radio label:eq(1)'); // 4凸のボタン（ラベル）
			var $input_0=$this_parent_class.find('.radio input:eq(0)'); // 3凸のボタン（チェック）
			var $input_1=$this_parent_class.find('.radio input:eq(1)'); // 4凸のボタン（チェック）
			// 3凸の表示＆選択、4凸の非表示＆選択を外す
			$label_0.css('display', '');
			$label_1.css('display', 'none');
			$input_0.prop('checked', true);
			$input_1.prop('checked', false);
			if (filterdata[n].rank4.length > 1) {
				$label_1.css('display', ''); // 4凸を表示
			} else if (filterdata[n].rank3.length===0) {
				$input_0.prop('checked', false); // 3凸の選択を外す
			}
		}
	}
}
/* ********************
　テーブルへ画像・文字を表示させる関数
******************** */
function table_display(){
	$('.c_summon').each(function() {
		var summon_select=$(this).val(); // 召喚石のID取得
		var summon_rank=$(this).nextAll('.radio').find('input:radio:checked').val(); // Rank取得
		var summon_type=$(this).parent().attr('class'); // 親要素取得
		var job_rarity = $('.type9 [name=c_type]').val(); // ジータかグランか
		var type_icon=$('.setting .type8 .title').hasClass('type_icon');

		// 設定画面に.type_iconがあったら
		if (type_icon) {
			$summon_screeen.find('.type8 .title').addClass('type_icon').html('フリー属性固定召喚石');
			$('.type8 .content').removeClass('breakword');
		// 設定画面に.type_iconがなかったら
		} else if (!type_icon) {
			$summon_screeen.find('.type8 .title').removeClass('type_icon').html('推しキャラ');
			$('.type8 .content').addClass('breakword');
			// エスケープ http://www.webdesignleaves.com/wp/htmlcss/1485/
			var targets = ["&", "<", ">" ,'"', "'"]; // エスケープする文字はこれ！
			var escapes = ["&amp;", "&lt;", "&gt;", "&quot;", "&#39;"]; // 変換先のジョブはこれ！
			var converted = $('textarea[name="comment"]').val(); // 入力された文字取得をするのだ
			for(var i=0; i<targets.length; i++){ // forでフォ～～～っと変換するのだ
				converted = converted.replace(new RegExp(targets[i], 'g'), escapes[i]);
			}
			$('.type8 .spec').html(converted).removeClass('rank0 rank3 rank4'); // 書き込みじゃ
		}

		for(var n=0; n<filterdata.length; n++){
			//var fname=filterdata[n].name;
			//var ftype = filterdata[n].type;
			var fclass=filterdata[n].class;
			var frarity=filterdata[n].rarity;
			var fid=filterdata[n].id;
			if (fid.match(summon_select)){
				// 召喚石・キャラ・JOBの画像
				var _frarity = (function() {
					if(fclass.match(/^summon$/)||fclass.match(/^character$/)) return '_'+frarity;
					return '';
				})();
				var _extension = (function() {
					if (fclass.match(/^character$/)) {
						if(summon_rank===void 0) return '_01.jpg';
						if(summon_rank.match(/^rank3$/)) return '_02.jpg';
						if(summon_rank.match(/^rank4$/)) return '_03.jpg';
					}
					if (fclass.match(/^job$/)) {
					if(job_rarity.match(/^Djeeta$/)) return '_1_01.png';
					if(job_rarity.match(/^Gran$/)) return '_0_01.png';
					}
					return '.jpg';
				})();
				$summon_screeen.find('.'+summon_type+' img').attr('src', 'image/'+fclass+ _frarity +'/'+fid+ _extension); // 画像の書き換え
				// 召喚石の文章
				var _summon_rank = (function() {
					if (summon_rank === void 0) return 'rank0';
					return summon_rank;
				})();
				$summon_screeen.find('.'+summon_type+' .spec').html(filterdata[n][_summon_rank]).removeClass('rank0 rank3 rank4').addClass(_summon_rank); // 文章・Class処理
			}
		}
		// ユーザーID取得＆書き込み
		var job_id = parseInt($('input[name="user_id"]').val());
		$('.type9 .spec').html('<div>'+job_id+'</div>');

	});
}

/* ********************
　変更するボタンをクリックしたら、テーブルを表示
******************** */
$('.change').on('click', function (){
	table_display();
});
/* ********************
　プルダウンが変わったら
　3凸・4凸ボタンを有効化・無効化の関数へ
******************** */
$('div').on('change', '.c_summon', function() {
	var $this_parent_class=$(this).parent().attr('class');
	radio_display($this_parent_class);
});
/* ********************
　属性,レアリティのプルダウンが変わったら
******************** */
$('div').on('change', 'div [name=c_type], div [name=c_rarity]', function() {
	var $parent=$(this).parent();
	var $starget=$parent.find('.c_summon');
	var $vtype=$parent.find('[name=c_type]');
	var vtype=$vtype.val();
	var $this_parent_class=$parent.attr('class');
	$starget.empty(); // とりま召喚石リストを削除
	list_display($this_parent_class); //リスト作成
	radio_display($this_parent_class);//ラジオボタン
	// 属性それぞれ色を変える
	switch(vtype){
		case 'type1':$vtype.css('color', '#FF0000');break;
		case 'type2':$vtype.css('color', '#00FFFF');break;
		case 'type3':$vtype.css('color', '#FF9872');break;
		case 'type4':$vtype.css('color', '#00FF00');break;
		case 'type5':$vtype.css('color', '#FFFF00');break;
		case 'type6':$vtype.css('color', '#FF00FF');break;
		//default:$vtype.css('color', '');break;
	}
});
/* ********************
　フリー・推しチェンジの処理
******************** */
$('.setting .type8 .title').on('click', function () { // フリー2をクリックしたとき
	var $this=$(this);
	var $html=$this.html();
	var $c_type=$this.nextAll('.c_type');
	var $c_rarity=$this.nextAll('.c_rarity');
	var $radio=$this.nextAll('.radio');
	var $nclass=$this.hasClass('type_icon');
	var $this_parent_class=$this.parent().attr('class');
	$c_rarity.find('option').prop('selected', false);
	$('.type8 .c_summon').empty();
	$c_rarity.empty();
	/* ********************
	　.type_iconがあったら「推しキャラ」の設定にする
	******************** */
	if ($nclass) {
		$this.removeClass('type_icon').html($html.replace(/フリー属性2/g,'推しキャラ'));
		$c_type.css('color', '#FF0000').attr("selected", false).val('type1');
		$c_rarity.append(
			'<option value="ssr">SSR</option>'+
			'<option value="sr">SR</option>'+
			'<option value="r">R</option>'+
			'<option value="skin">スキン他</option>'
		);
		$this.parent().attr('data-select','character').data('select','character');
		$radio.find('.r_rank3').text('上限解放');
		$radio.find('.r_rank4').text('最終上限解放').css({'line-height':'16px','height':'16px','font-size':'12px'});
		$this.parent().append('<textarea type="text" name="comment" placeholder="45文字まで入力可能です" maxlength="45">');
		list_display($this_parent_class); //リスト作成
	/* ********************
	　.type_iconがなかったら「召喚石」の設定にする
	******************** */
	} else if (!$nclass) {
		$this.addClass('type_icon').html($html.replace(/推しキャラ/g,'フリー属性2'));
		$c_type.css('color', '#FFFF00').attr("selected", false).val('type5');
		$c_rarity.append(
			'<option value="ssr">SSR</option>'+
			'<option value="sr">SR</option>'
		);
		$this.parent().attr('data-select','summon').data('select','summon');
		$radio.find('.r_rank3').text('3凸');
		$radio.find('.r_rank4').text('4凸').css({'line-height':'','height':'','font-size':''});
		$this.nextAll('textarea').remove();
		list_display($this_parent_class); //リスト作成
	}
});
/* ********************
　3凸・4凸ボタンの動作
　http://hueruwakame.php.xdomain.jp/article/html_css3.php
******************** */
$('div').on('click', '.radio label', function(event){
	// 既定の動作をキャンセル(今回はinputにcheckedが入るのをキャンセル)
	event.preventDefault();
	var vc_summon=$(this).parent().prev().val();
	for(var n=0; n<filterdata.length; n++){
		if(
			filterdata[n].id.match(vc_summon) // 選択中の召喚石
			&&filterdata[n].rank0.length!==0 // 無凸の文字数
			&&filterdata[n].rank3.length!==0 // 3凸の文字数
		){
			var $input=$(this).prev('input');
			if($input.prop('checked')){
				$input.prop('checked', false);
			} else {
				$input.prop('checked', true);
			}
		}
	}
});
/* ********************
　画像化の処理
******************** */
$('#screenshot').on('click', function () {
	// 属性アイコンが正常に描写されないので非表示
	$summon_screeen.find('.title').removeClass('type_icon');
	// サイトのURLを記載させる
	$summon_screeen.append('<p class="add">https://prfac.com/gbf/summon/</p>');
	// 画像生成を開始
	html2canvas($summon_screeen, {
		onrendered: function (canvas) {
		var imgData = canvas.toDataURL();
			$('#screen_image').attr('src', imgData);
			$('#download_screen').attr('download', 'image.png').attr('href', imgData);
		}
	});
	setTimeout(function(){
		// 属性アイコンを0.1秒後に再表示させます
		$summon_screeen.find('.content').each(function(){
			if (!$(this).hasClass('breakword')) {
				$(this).prev().addClass('type_icon');
			}
		});
		// 記載させたURLを削除
		$summon_screeen.find('.add').remove();
	},100);
});
/* ********************
　ツイート
　http://qiita.com/mpyw/items/62e6e415f86eb30a5ff4
******************** */
$('#tweet_open').on('click', function () {
	var
	w=770,
	h=600,
	l=(screen.availWidth-w)/2,
	t=(screen.availHeight-h)/2,
	popPage = '.popup';
	window.open('twitter/index.php',"window","width= "+ w + ",height=" + h + ",left=" + l + ",top=" + t + ", scrollbars = yes, location = no, toolbar = no, menubar = no, status = no");
});
//JSON 終了
});
