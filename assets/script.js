// 変数設定
var echoData = [];
var foxData = {};
var url = location.href.replace(/\?.*/, '');
var query = location.search.replace(/\?st_key=/g, '');
var path = location.pathname;
history.replaceState(null, null, path); // URLクエリパラメータを除去
// --------------------
// 各種関数
// --------------------
// Cookieの保存・読み込み
// https://qiita.com/tatsuyankmura/items/8e09cbd5ee418d35f169
function setCookie(cookieName, value, expire){
  var cookie = cookieName+'='+value+';path=/;';
  if(Number(expire) > 0){cookie += 'expires='+expire.toGMTString();}
  document.cookie = cookie;
}
function getCookie(cookieName){
  var l = cookieName.length+1;
  var cookieAry = document.cookie.split('; ');
  var str = '';
  for(i=0,j=cookieAry.length; i<j; i++){
    if(cookieAry[i].substr(0,l) === cookieName+'='){
      str = cookieAry[i].substr(l,cookieAry[i].length);
      break;
    }
  }
  return str;
}
// JSONの処理
function init(data){
  echoData = data;
  setCookie('ck_cookie', true);
  var checkCookie = getCookie('ck_cookie');
  if(!checkCookie){
    //alert('Cookieが無効になっています。');
    swal('Cookieが無効になっています', '設定内容が保存できません。<br>ご注意ください。', 'info');
  }
  var st_key = getCookie('st_key');
  // URLクエリパラメータが存在する場合
  if(query.length > 1) {
    try {
      var queryJsn = decodeURIComponent(query);
      var queryAry = JSON.parse(queryJsn);
    } catch (e) {
      //alert('URLに不備があるため、初期設定で表示します。');
      swal({
        title: 'URLに不備があります',
        text: 'デフォルトの設定で表示します。',
        type: 'error',
        timer: 2500
      });
      jsCookie_Noload();
      return;
    }
    swal({
      title: 'URLの設定内容を復元する？',
      //type: 'question',
      imageUrl: 'image/url.svg',
      imageWidth: '88px',
      imageHeight: '88px',
      html:
      'URLに設定された召喚石やIDなどを呼び出せます。<br>'+
      'しないを選択するとデフォルトの設定が表示されます。',
      showCancelButton: true,
      confirmButtonText: 'する',
      cancelButtonText:  'しない'
    }).then(function (res) {
      if (res.value) {
        // ブックマークレットか判断
        (!queryAry.info)
        ?jsAry_load(queryAry)
        :jsBookmark_load(queryAry);
      } else {
        jsCookie_Noload();
      }
    });
  // Cookieが存在する場合
  } else if (st_key) {
    swal({
      title: '前回の設定内容を復元する？',
      //type: 'question',
      imageUrl: 'image/repair.svg',
      imageWidth: '88px',
      imageHeight: '88px',
      html:
      '前回、設定した召喚石やIDなどを呼び出せます。<br>'+
      'しないを選択するとデフォルトの設定が表示されます。',
      showCancelButton: true,
      confirmButtonText: 'する',
      cancelButtonText:  'しない'
    }).then(function (res) {
      if (res.value) {
        jsCookie_load();
      } else {
        jsCookie_Noload();
      }
    });
  // URLクエリパラメータ＆Cookieが存在しない場合
  } else {
    jsCookie_Noload();
  }
}
// レベル用JSONの処理
function init2(data){
  foxData = data;
}
// 初期の呼出
function jsCookie_Noload(){
  $('#summon_setting div[class^=type]').each(function(){
    var $this_parent_class=$(this).attr('class');
    list_display($this_parent_class); // リスト生成
    radio_display($this_parent_class); // 3凸・4凸ボタン
    level_select($this_parent_class);
    table_display(); // 一覧表示
  });
}
// リスト生成の関数
function list_display($this_parent_class){
  var $this_parent_class=$('#summon_setting .'+$this_parent_class);
  var ntype=$this_parent_class.attr('class');
  var nselect=$this_parent_class.data('select');
  var vtype=$this_parent_class.find('[name=c_type]').val();
  var vrarity=$this_parent_class.find('[name=c_rarity]').val();
  $this_parent_class.find('.c_summon').empty();
  if(ntype.match(/[1-8]/)){
    $('.'+ntype+' .c_summon').append('<option value="unselected">【未選択】</option>');
  }
  for(var n=0; n<echoData.length; n++){
    var ftype=echoData[n].type;
    var frarity=echoData[n].rarity;
    var fclass=echoData[n].class;
    var fname=echoData[n].name;
    var fid=echoData[n].id;
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
// 3凸・4凸ボタンを有効化・無効化の関数
function radio_display($this_parent_class){
  var $this_parent_class=$('#summon_setting .'+$this_parent_class);
  var vc_summon=$this_parent_class.find('.c_summon').val();
  for(var n=0; n<echoData.length; n++){
    if (echoData[n].id.match(vc_summon)){
      var $label_0=$this_parent_class.find('.radio label:eq(0)'); // 3凸のボタン（ラベル）
      var $label_1=$this_parent_class.find('.radio label:eq(1)'); // 4凸のボタン（ラベル）
      var $label_2=$this_parent_class.find('.radio label:eq(2)'); // 5凸のボタン（ラベル）
      var $input_0=$this_parent_class.find('.radio input:eq(0)'); // 3凸のボタン（チェック）
      var $input_1=$this_parent_class.find('.radio input:eq(1)'); // 4凸のボタン（チェック）
      var $input_2=$this_parent_class.find('.radio input:eq(2)'); // 5凸のボタン（チェック）
      // 3凸の表示＆選択、4凸の非表示＆選択を外す
      $label_0.css('display', '');
      $label_1.css('display', 'none');
      $label_2.css('display', 'none');
      $input_0.prop('checked', true);
      $input_1.prop('checked', false);
      $input_2.prop('checked', false);
      if (echoData[n].rank4.length > 1) $label_1.css('display', ''); // 4凸を表示
      if (echoData[n].rank5.length > 1) $label_2.css('display', ''); // 5凸を表示
      if (echoData[n].rank3.length===0) $input_0.prop('checked', false); // 3凸の選択を外す
    }
  }
}
// テーブルへ画像・文字を表示させる関数
function table_display(){
  var $summon_screeen = $('#summon_screeen');
  // 設定画面に.type_iconがある・ないの処理
  var type_icon=$('.setting .type8 .title').hasClass('type_icon');
  if (type_icon) {
    $summon_screeen.find('.type8 .title').addClass('type_icon').html('フリー属性固定召喚石');
    $('.type8 .content').removeClass('breakword');
  } else if (!type_icon) {
    $summon_screeen.find('.type8 .title')
      .html('<span>Lv** ****</span><div class="npc-rank"><div class="ico-npc-rank"></div><div class="txt-npc-rank">*</div></div>')
      .removeClass('type_icon').addClass('type-npc');
    $summon_screeen.find('.type8 .content').addClass('breakword'); // 改行CSSを追加
    $summon_screeen.find('.type8 .name').text(''); // 召喚石名を空に
    // エスケープ http://www.webdesignleaves.com/wp/htmlcss/1485/
    var targets = ['&', '<', '>' ,'"', '\'']; // エスケープする文字はこれ！
    var escapes = ['&amp;', '&lt;', '&gt;', '&quot;', '&#39;']; // 変換先のジョブはこれ！
    var converted = $('textarea[name=comment]').val(); // 入力された文字取得をするのだ
    for(var i=0; i<targets.length; i++){ // forでフォ～～～っと変換するのだ
      converted = converted.replace(new RegExp(targets[i], 'g'), escapes[i]);
    }
    $('.type8 .info').html(converted).removeClass('rank0 rank3 rank4 rank5'); // 書き込みじゃ
  }
  // ユーザーID取得＆書き込み
  var job_rarity = $('.type9 [name=c_type]').val(); // ジータかグランか
  var job_id = $('input[name=user_id]').val().replace(/[^0-9]/g, '').slice(0, 10);
  $('.type9 .info').html('<div>'+job_id+'</div>');

  // 設定個々の処理
  $('.c_summon').each(function() {
    var summon_select=$(this).val(); // 召喚石のID取得
    var summon_rank=$(this).parent().next().find('input:radio:checked').val(); // Rank取得
    var summon_type=$(this).parent().parent().parent().attr('class'); // 親要素取得
    var summon_level=$(this).parent().parent().siblings('.c_level').val(); // レベル取得
    var summon_level=(function(){
      if(summon_level>0) return 'Lv'+summon_level+' ';
      return '';
    })();
    var summon_quality=$(this).parent().parent().siblings('.c_quality').val(); // ＋取得
    var summon_quality=(function(){
      if(summon_quality>1) return '+'+summon_quality+' ';
      return '';
    })();
    var summon_bonus=$(this).parent().parent().parent().find('.c_bonus').val(); // リミボ取得
    // 未選択の処理
    if(summon_select=='unselected'){
      $summon_screeen.find('.'+summon_type+' img').attr('src', 'image/thumbnail/empty.jpg'); // 画像の書き換え
      $summon_screeen.find('.'+summon_type+' .quality').text(''); // ＋の書き換え
      var $nclass=$(this).parent().parent().siblings().hasClass('type_icon');
      if ($nclass) { // 召喚石
        $summon_screeen.find('.'+summon_type+' .name').text('召喚石が設定されていません');
        $summon_screeen.find('.'+summon_type+' .info').html('').removeClass('rank0 rank3 rank4 rank5').addClass('rank0');
      } else { // キャラ
        $summon_screeen.find('.'+summon_type+' .name').text('コメントが設定されていません');
        $summon_screeen.find('.'+summon_type+' .title span').text('推しキャラが設定されていません');
        $summon_screeen.find('.'+summon_type+' .npc-rank').addClass('display_none');
        $summon_screeen.find('.'+summon_type+' .info').html('').removeClass('rank0 rank3 rank4 rank5');
      }
    }
    for(var n=0; n<echoData.length; n++){
      var fname=echoData[n].name;
      //var ftype = echoData[n].type;
      var fclass=echoData[n].class;
      var frarity=echoData[n].rarity;
      var fid=echoData[n].id;
      if (fid.match(summon_select)){
        // 召喚石・キャラ・JOBの画像
        var _extension = (function() {
          if (fclass.match(/^character$/) && !/_/.test(summon_select)) {
            if(summon_rank===void 0) return fid + '_01.jpg';
            if(summon_rank.match(/^rank3$/)) return fid + '_02.jpg';
            if(summon_rank.match(/^rank4$/)) return fid + '_03.jpg';
          }
          if (fclass.match(/^character$/) && /_/.test(summon_select)) {
            var summon_select_ary = summon_select.split('_');
            if(summon_rank===void 0) return summon_select_ary[0] + '_01_' + summon_select_ary[1] + '.jpg';
            if(summon_rank.match(/^rank3$/)) return summon_select_ary[0] + '_02_' + summon_select_ary[1] + '.jpg';
            if(summon_rank.match(/^rank4$/)) return summon_select_ary[0] + '_03_' + summon_select_ary[1] + '.jpg';
          }
          if (fclass.match(/^job$/)) {
            if(job_rarity.match(/^Djeeta$/)) return fid + '_1_01.png';
            if(job_rarity.match(/^Gran$/)) return fid + '_0_01.png';
          }
          if (fclass.match(/^summon$/) && fid.match(/^20400(20|27|28|34|46|47)000$/)) {
            if(summon_rank===void 0) return fid + '.jpg';
            if(summon_rank.match(/^rank[45]$/)) return fid + '_02.jpg';
          }
          if (fclass.match(/^summon$/) && fid.match(/^20400(03|56)000$/)) {
            if(summon_rank===void 0) return fid + '.jpg';
            if(summon_rank.match(/^rank5$/)) return fid + '_02.jpg';
          }
          return fid + '.jpg';
        })();
        $summon_screeen.find('.'+summon_type+' img').attr('src', 'image/thumbnail/'+_extension); // 画像の書き換え
        // 召喚石の文章
        var _summon_rank = (function() {
          if (summon_rank === void 0) return 'rank0';
          return summon_rank;
        })();
        // スキン名の括弧を取り除く
        var fname  = (function() {
          if (frarity.match(/^skin$/)) return fname.replace(/\(.+\)/,'');
          return fname;
        })();
        if(/summon/.test(fclass)){
          $summon_screeen.find('.'+summon_type+' .name').text(summon_level+fname); // 召喚石名を記入
          $summon_screeen.find('.'+summon_type+' .info').html(echoData[n][_summon_rank]).removeClass('rank0 rank3 rank4 rank5').addClass(_summon_rank); // 文章・Class処理
        }
        if(/character/.test(fclass)){
          $summon_screeen.find('.type8 .title span').text(summon_level+fname);
          if(summon_bonus===void 0 || summon_bonus==0){
            $summon_screeen.find('.type8 .npc-rank').addClass('display_none');
          }else{
            $summon_screeen.find('.type8 .npc-rank').removeClass('display_none');
            $summon_screeen.find('.type8 .txt-npc-rank').text(summon_bonus);
          }
        }
        if(/summon|character/.test(fclass)){
          $summon_screeen.find('.'+summon_type+' .quality').text(summon_quality); // プラス値を記入
        }
      }
    }
  });
}
// レベル・プラス値のプルダウン
function level_select($this_parent_class){
  var $this_parent_class=$('#summon_setting .'+$this_parent_class);
  var $c_level=$this_parent_class.find('.c_level');
  var $c_quality=$this_parent_class.find('.c_quality');
  var $c_bonus=$this_parent_class.find('.c_bonus');
  var summonVal=$this_parent_class.find('.c_summon').val();
  var classStr = $this_parent_class.attr('data-select');
  var rarity=$this_parent_class.find('.c_rarity').val();
  var rank=$this_parent_class.find('input:radio:checked').val();
  var rankStr=(function(){
    if (rank==void 0) return 'rank0';
    return rank;
  })();
  var levelAry = (function(){
    if (summonVal==null || summonVal.match(/^unselected$/) || classStr=='job') return [0]; // 例外 未選択
    if (String(summonVal).match(/^20300(68|69|70|71|72)000$/)) return [20]; // 例外 巫女SR
    return foxData[classStr][rarity][rankStr];
  })();
  var levelMax = levelAry[levelAry.length - 1];
  var qualityMax = (function(){
    if (classStr.match(/^character$/)) return 300;
    return 99;
  })();
  $c_level.empty();
  $c_quality.empty();
  $c_bonus.empty();
  if(levelMax === 0){
    $c_level.append('<option value=""></option>');
    $c_quality.append('<option value=""></option>');
    $c_bonus.append('<option value=""></option>');
    return;
  }
  var levelStr = levelAry.join('|');
  var levelReg = new RegExp('^('+levelStr+')$');
  var levelMaxOption = '';
  var levelOption = '';
  for(var i=levelMax; i>1; i--) {
    if (levelReg.test(i)) {
      levelMaxOption += '<option value="'+i+'">Lv'+i+'</option>'
    } else {
      levelOption += '<option value="'+i+'">Lv'+i+'</option>';
    }
  }
  $c_level.append('<optgroup label="レベル">'+levelMaxOption+'<option value="1">Lv1</option></optgroup>');
  $c_level.append('<optgroup label="その他">'+levelOption+'</optgroup>');
  var qualityOption = '';
  for(var i=1; i<qualityMax; i++) {qualityOption += '<option value="'+i+'">+'+i+'</option>';}
  $c_quality.append('<optgroup label="ボーナス"><option value="0">+0</option><option value="'+qualityMax+'">+'+qualityMax+'</option></optgroup>');
  $c_quality.append('<optgroup label="その他">'+qualityOption+'</optgroup>');
  var bonusOption = '';
  for(var i=0; i<=999; i++) {bonusOption += '<option value="'+i+'">'+i+'</option>';}
  $c_bonus.append('<optgroup label="リミボ">'+bonusOption+'</optgroup>');
}
// Cookeの処理
function jsCookie_save(){
  // 🍪「js-cookie用のCookieを全て削除するよ」
  var oldCookie = getCookie('setting');
  if(oldCookie){
    var removeCookieName = ['setting','type0','type1','type2','type3','type4','type5','type6','type7','type8','type9','type1_','type2_','type3_','type4_','type5_','type6_'];
    $.each(removeCookieName, function(i, value) {
      setCookie(value, '');
    });
  }
  var aryCookie = [];
  var objCookie = {};
  var _user=$('input[name=user_id]').val();
  var c_user=(function(){
    if(_user===void 0) return '';
    return encodeURIComponent(_user);
  })();
  var _text=$('textarea[name=comment]').val();
  var c_text=(function(){
    if(_text===void 0) return '';
    return encodeURIComponent(_text);
  })();
  var c_summon=$('.setting .type8 .title').hasClass('type_icon'); // フリー2はtrue、推しキャラはfalse
  var c_bonus=$('.c_bonus').val(); // リミボ取得
  objCookie.user   = c_user;
  objCookie.text  = c_text;
  objCookie.summon = c_summon;
  aryCookie.push(objCookie);
  $('.c_summon').each(function() {
    var objCookie = {};
    var $this=$(this);
    var c_target=$this.parent().parent().parent().attr('class'); // 親要素
    var c_type=$this.parent().parent().siblings('.c_type').val(); // 属性
    var c_rarity=$this.parent().parent().siblings('.c_rarity').val(); // レアリティ
    var c_id=$this.val(); // 召喚石
    var _rank=$this.parent().next().find('input:radio:checked').val();
    var c_rank=(function(){
      if(_rank===void 0) return 'rank0';
      if(_rank.match(/rank3/)) return 'rank3';
      if(_rank.match(/rank4/)) return 'rank4';
      if(_rank.match(/rank5/)) return 'rank5';
    })();
    var c_level=$this.parent().parent().siblings('.c_level').val(); // レベル取得
    var c_quality=$this.parent().parent().siblings('.c_quality').val(); // ＋取得
    objCookie.target = c_target;
    objCookie.type   = c_type;
    objCookie.rarity = c_rarity;
    objCookie.id     = c_id;
    objCookie.rank   = c_rank;
    objCookie.level  = c_level;
    objCookie.quality = c_quality;
    if(c_target == 'type8'){objCookie.bonus = c_bonus;}
    aryCookie.push(objCookie);
  });
  // Cookieを保存
  var expire = new Date(Date.now()+1*365*24*60*60*1000); // 365日保持させる
  var jsnCookie = JSON.stringify(aryCookie);
  var jsnCookie_e = encodeURIComponent(jsnCookie);
  setCookie('st_key', jsnCookie_e, expire);
  urlQuery(jsnCookie_e);
}
function jsCookie_load(){
  // cookieを取得し、配列にする
  var cookies = getCookie('st_key');
  var cookies_jsn = decodeURIComponent(cookies)
  var cookies_ary = JSON.parse(cookies_jsn);
  jsAry_load(cookies_ary);
}
function jsBookmark_load(obj){
  // nullを書き換える用の関数
  function echoDatafind(objId, trg){
    for(var n=0; n<echoData.length; n++){
      var echoId = echoData[n].id;
      if (objId == echoId) return echoData[n][trg];
    }
  }
  var ary = [];
  for (var i in obj) {
    var objTarget = obj[i].target
    if (objTarget == null && obj[i] !== true){
      ary.push(obj[i]);
    } else if(/type[1-8]/.test(objTarget)) {
      obj[i].type = echoDatafind(obj[i].id, 'type');
      ary.push(obj[i]);
    } else if(/type9/.test(objTarget)) {
      obj[i].rarity = echoDatafind(obj[i].id, 'rarity');
      ary.push(obj[i]);
    }
  }
  jsAry_load(ary);
}
function jsAry_load(ary){
  $.each(ary, function(i, value) {
    var target = value.target;
    var type = value.type;
    var rarity = value.rarity;
    var id = value.id;
    var rank = value.rank;
    var level = value.level;
    var quality = value.quality;
    var $target = $('#summon_setting .'+target);
    var $c_type = $target.find('.c_type');
    $c_type.val(type); // 属性をセット
    switch(type){ // 色を変更
      case 'type1':$c_type.css('color', '#FF0000');break;
      case 'type2':$c_type.css('color', '#00FFFF');break;
      case 'type3':$c_type.css('color', '#FF9872');break;
      case 'type4':$c_type.css('color', '#00FF00');break;
      case 'type5':$c_type.css('color', '#FFFF00');break;
      case 'type6':$c_type.css('color', '#FF00FF');break;
    }
    $target.find('.c_rarity').val(rarity); // レアリティをセット
    if(target!==void 0){list_display(target);} // リストを生成
    $target.find('.c_summon').val(id); // 保存した召喚石を選択
    if(target!==void 0){radio_display(target);} // 3凸・4凸ボタン
    if (rank==='rank0') {
      $target.find('.radio input:eq(0)').prop('checked', false);
    } else if (rank==='rank3') {
      $target.find('.radio input:eq(0)').prop('checked', true);
    } else if (rank==='rank4') {
      $target.find('.radio input:eq(1)').prop('checked', true);
    } else if (rank==='rank5') {
      $target.find('.radio input:eq(2)').prop('checked', true);
    }
    var user = value.user;
    var summon = value.summon;
    var text = value.text;
    var bonus = value.bonus;
    if(user!==void 0){$('input[name=user_id]').val(user);}
    if(summon === false){
      var $this=$('.setting .type8 .title');
      var $html=$this.html();
      var $c_type=$this.nextAll('.c_type');
      var $c_rarity=$this.nextAll('.c_rarity');
      var $radio=$this.nextAll('.radio');
      var $this_parent_class=$this.parent().attr('class');
      $c_rarity.find('option').prop('selected', false);
      //$('.type8 .c_summon').empty();
      $c_rarity.empty();
      $this.removeClass('type_icon').html($html.replace(/フリー属性2/g,'推しキャラ'));
      $c_type.css('color', '#FF0000').attr('selected', false).val('type1');
      $c_rarity.append(
        '<option value="ssr">SSR</option>'+
        '<option value="sr">SR</option>'+
        '<option value="r">R</option>'+
        '<option value="skin">スキン他</option>'
      );
      $this.parent().attr('data-select','character').data('select','character');
      $radio.find('.r_rank3').text('上限解放');
      $radio.find('.r_rank4').text('最終上限解放').css({'line-height':'16px','height':'16px','font-size':'12px'});
      $this.parent().append('<div class="box select select8"><div><select class="c_bonus" name="c_bonus"></select></div>'+
      '<div><textarea type="text" name="comment" placeholder="45文字まで入力可能です" maxlength="45"></textarea></div></div>');
      //$this.parent().append('<textarea type="text" name="comment" placeholder="45文字まで入力可能です" maxlength="45">');
      list_display($this_parent_class); //リスト作成
    }
    if(target!==void 0){level_select(target);}
    if(level!==void 0){$target.find('.c_level').val(level);} // 保存したレベルを選択
    if(level!==void 0){$target.find('.c_quality').val(quality);} // 保存した＋を選択
    if(bonus!==void 0){$('.c_bonus').val(bonus);}
    if(text!==void 0){
      var textDec = '';
      try {
        textDec = decodeURIComponent(text);
      } catch (e) {}
      $('textarea[name=comment]').val(textDec);
    }
  });
  table_display(); // 一覧表示
  var jsn = JSON.stringify(ary);
  var jsn_e = encodeURIComponent(jsn);
  urlQuery(jsn_e);
}
// URLクエリパラメータの処理
function urlQuery(data){
  var urlData = (function(){
    if (data == null) return url;
    return url + '?st_key=' + data;
  })();
  $('input[name=query]').val(urlData);
}
// クリップボードへコピー
function copyTextToClipboard(textVal){
  var temp = document.createElement('div');
  temp.appendChild(document.createElement('pre')).textContent = textVal;
  var s = temp.style;
  s.position = 'fixed';
  s.left = '-100%';
  document.body.appendChild(temp);
  document.getSelection().selectAllChildren(temp);
  var result = document.execCommand('copy');
  document.body.removeChild(temp);
  return result;
}
// --------------------
// 読み込み時
// --------------------
$(function(){
  var $summon_screeen=$('#summon_screeen');
  // クエリ
  //urlQuery();
  // JSONを取得
  $.getJSON('assets?json=foxtrot',init2);
  $.getJSON('assets?json=echo',init);
  // 変更するボタンをクリックしたら、テーブルを表示
  $('#change').on('click', function (){
    table_display();
    jsCookie_save();
  });
  // プルダウンが変わったら3凸・4凸ボタンを有効化・無効化の関数へ
  $('div').on('change', '.c_summon', function() {
    var $this_parent_class=$(this).parent().parent().parent().attr('class');
    radio_display($this_parent_class);
    level_select($this_parent_class);
  });
  // 属性,レアリティのプルダウンが変わったら
  $('div').on('change', 'div [name=c_type], div [name=c_rarity]', function() {
    var $parent=$(this).parent();
    var $starget=$parent.find('.c_summon');
    var $vtype=$parent.find('[name=c_type]');
    var vtype=$vtype.val();
    var $this_parent_class=$parent.attr('class');
    //$starget.empty(); // とりま召喚石リストを削除
    list_display($this_parent_class); //リスト作成
    radio_display($this_parent_class);//ラジオボタン
    level_select($this_parent_class);
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
  // フリー・推しチェンジの処理
  $('.setting .type8 .title').on('click', function () { // フリー2をクリックしたとき
    var $this=$(this);
    var $html=$this.html();
    var $c_type=$this.nextAll('.c_type');
    var $c_rarity=$this.nextAll('.c_rarity');
    var $radio=$this.nextAll('.radio');
    var $nclass=$this.hasClass('type_icon');
    var $this_parent_class=$this.parent().attr('class');
    $c_rarity.find('option').prop('selected', false);
    //$('.type8 .c_summon').empty();
    $c_rarity.empty();
    $('.select8').remove();
    // .type_iconがあったら「推しキャラ」の設定にする
    if ($nclass) {
      var $this=$('.setting .type8 .title');
      $this.removeClass('type_icon').html($html.replace(/フリー属性2/g,'推しキャラ'));
      $c_type.css('color', '#FF0000').attr('selected', false).val('type1');
      $c_rarity.append(
        '<option value="ssr">SSR</option>'+
        '<option value="sr">SR</option>'+
        '<option value="r">R</option>'+
        '<option value="skin">スキン他</option>'
      );
      $this.parent().attr('data-select','character').data('select','character');
      $radio.find('.r_rank3').text('上限解放');
      $radio.find('.r_rank4').text('最終上限解放').css({'line-height':'16px','height':'16px','font-size':'12px'});
      $this.parent().append('<div class="box select select8"><div><select class="c_bonus" name="c_bonus"></select></div>'+
      '<div><textarea type="text" name="comment" placeholder="45文字まで入力可能です" maxlength="45"></textarea></div></div>');
      //$this.parent().append('<textarea type="text" name="comment" placeholder="45文字まで入力可能です" maxlength="45">');
      list_display($this_parent_class); //リスト作成
    // .type_iconがなかったら「召喚石」の設定にする
    } else if (!$nclass) {
      $this.addClass('type_icon').html($html.replace(/推しキャラ/g,'フリー属性2'));
      $c_type.css('color', '#FFFF00').attr('selected', false).val('type5');
      $c_rarity.append(
        '<option value="ssr">SSR</option>'+
        '<option value="sr">SR</option>'+
        '<option value="r">R</option>'+
        '<option value="n">N</option>'
      );
      $this.parent().attr('data-select','summon').data('select','summon');
      $radio.find('.r_rank3').text('3凸');
      $radio.find('.r_rank4').text('4凸').css({'line-height':'','height':'','font-size':''});
      $radio.find('.r_rank5').text('5凸').css({'line-height':'','height':'','font-size':''});
      $this.nextAll('textarea').remove();
      list_display($this_parent_class); //リスト作成
    }
    // 最後にボタン制御
    radio_display($this_parent_class);
    level_select($this_parent_class);
  });
  // 3凸・4凸ボタンの動作
  // http://hueruwakame.php.xdomain.jp/article/html_css3.php
  $('.radio label span').on('click', function(event){
    var className = $(this).parent().parent().attr('class');
    if(className.match(/resize/)){return;}
    // 既定の動作をキャンセル(今回はinputにcheckedが入るのをキャンセル)
    event.preventDefault();
    var vc_summon=$(this).parent().parent().prev().children().val();
    var $input=$(this).prev('input');
    var inputVal = $input.val();
    $input.prop('checked', !$input.prop('checked'));
    for(var n=0; n<echoData.length; n++){
      if(
        echoData[n].id.match(vc_summon) // 選択中の召喚石
        &&echoData[n].rank0.length===0 // 無凸の文字数
        &&echoData[n].rank3.length!==0 // 3凸の文字数
      ) $input.prop('checked', true);
    }
    var $this_parent_class=$(this).parent().parent().parent().parent().attr('class');
    level_select($this_parent_class);
  });
  // 画像化の処理
  $('#screenshot').on('click', function () {
    // サイトのURLを記載させる
    $summon_screeen.append('<p class="add">'+url+'&nbsp;&nbsp;&nbsp;</p>');
    // Twitter用にサイズ変更
    var resize = $('input[name=resize]:checked').val();
    //if (resize == 'yes') $summon_screeen.addClass('picture');
    if (resize == 'yes') {
      var height = $summon_screeen.height();
      var diffHeight = (702 - height) / 2;
      var width = $summon_screeen.width();
      var diffWidth = (1248 - width) / 2;
      var padding = diffHeight + 'px ' + diffWidth + 'px';
      $summon_screeen.css('padding', padding);
    }
    // 画像生成を開始
    html2canvas($summon_screeen, {
      onrendered: function (canvas) {
        var imgData = canvas.toDataURL();
        $('#screen_image').attr('src', imgData);
      }
    });
    setTimeout(function(){
      $summon_screeen.find('.add').remove(); // 記載させたURLを削除
      //$summon_screeen.removeClass('picture'); // 追加したClassを削除
      $summon_screeen.css('padding', '');
    },100);
  });
  // ツイート
  // http://qiita.com/mpyw/items/62e6e415f86eb30a5ff4
  $('#tweet_open').on('click', function () {
    var src = $('#screen_image').attr('src');
    if (src) {
      localStorage.imageData = src;
      var
      w=770,
      h=600,
      l=(screen.availWidth-w)/2,
      t=(screen.availHeight-h)/2,
      popPage = '.popup';
      window.open(
        'twitter/index.php',
        'window',
        'width= '+ w +
        ',height=' + h +
        ',left=' + l +
        ',top=' + t +
        ', scrollbars = yes, location = no, toolbar = no, menubar = no, status = no'
      );
    } else {
      //alert('画像生成してください。');
      swal({
        title: '画像生成してください。',
        type: 'error',
        timer: 2500
      });
    }
  });
  // ID
  $('input[name=user_id]').bind('keydown keyup keypress mouseup focusout change', function() {
    var val = $(this).val();
    var str = String(val).replace(/\D/g, '').slice(0, 10);
    $(this).val(str);
  });
  // コピー
  $('.svg svg').on('click', function (){
    //var val = $('input[name=query]').val();
    var val = $(this).prev().val();
    var res = copyTextToClipboard(val);
    if (res) {
      swal({
        title: 'コピーに成功しました。',
        type: 'success',
        timer: 2500
      });
    } else {
      swal({
        title: 'コピーに失敗しました。',
        type: 'error',
        timer: 2500
      });
    }
  });
  // ブックマークレット
  var bookmark = 0;
  $(window).keydown(function (e) {
    var trg = $('#bookmarklet');
    if (
      !trg.hasClass('display_none') ||
      $(':focus').is('input[type=number], input[type=text], textarea')
    ) return;
    //if ((e.ctrlKey||e.altKey||e.metaKey) && e.keyCode === 66) {
    if (e.keyCode === 66) {
      if (bookmark < 2) {
        bookmark += 1;
      } else {
        swal({
          title: 'ブックマークレットを表示する？',
          type: 'warning',
          html:
          '<span style="font-size: 10pt;">【注意】<br>本サイトのブックマークレットを利用した事による、'+
          '欠陥およびそれらが原因で発生した損失や損害については一切責任を負いません。</span>',
          showCancelButton: true,
          confirmButtonText: 'する',
          cancelButtonText:  'しない'
        }).then(function (res) {
          if (res.value) trg.removeClass('display_none');
        });
      }
    }
  });
  // デプロイ
  $('#branch_change').on('click', function () {
    var branch_val = $('#branch_list').val();
    var $branch_result = $('#branch_result');
    $branch_result.text(branch_val + 'へ切り替えています');
    $.ajax({
      type: 'POST',
      url: 'deploy/change_deploy.php',
      dataType: 'JSON',
      data: {
        branch: branch_val,
      },
    })
    .done(function (response) {
      $branch_result.text(response.data);
    })
    .fail(function () {
      $branch_result.text('切り替えに失敗しました');
    });
  });
});