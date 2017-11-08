<?php
// タイムゾーンを設定
date_default_timezone_set("Asia/Tokyo");
// クエリ文字を生成
function getFileUpdateDate($file) {
  $FUDate = "";
  $FUDate = filemtime($file);
  $FUDate = date("YmdHi", $FUDate);
  $FUDate = $file."?date=".$FUDate;
  return $FUDate;
}
// 曜日の設定
function getLastUpdateDate() {
  $weekday = array( "日", "月", "火", "水", "木", "金", "土" );
  chdir("assets");
  $file = exec("ls -tr");
  $LUDate = "";
  $LUDate = filemtime($file);
  chdir("../");
  $LUDate_m = date("m", $LUDate)."月";
  $LUDate_d = date("d", $LUDate)."日";
  $LUDate_w = "(".$weekday[date("w", $LUDate)].")";
  $LUDate = $LUDate_m.$LUDate_d.$LUDate_w;
  return $LUDate;
}
// PHPが吐き出すHTMLファイルを『自動的に最小化する』スクリプト
// https://manablog.org/php-html-minify/
function sanitize_output($buffer) {
  $search = array(
    "/\r\n|\n|\r|<!--[\s\S]*?-->/s", // 改行＆コメントを削除
    "/(\s)+/s",                      // 連続スペースを1つにする
    "/>(\s)/s",                      // タグの次にあるスペースを削除
    "/(\s)</s",                      // タグの前にあるスペースを削除
  );
  $replace = array(
    "",
    "\\1",
    ">",
    "<",
  );
  $buffer = preg_replace($search, $replace, $buffer);
  return $buffer;
}
ob_start("sanitize_output");
?>

<!DOCTYPE html>
<html lang="jp">

<head>
  <meta charset="utf-8">
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@micelle9" />
  <meta name="twitter:title" content="フレ石編成的ななにか" />
  <meta name="twitter:description" content="グラブルのフレ募集とかで使えそうな「フレ石編成的ななにか」です" />
  <meta name="twitter:image" content="https://prfac.com/gbf/summon/image/thumbnail.jpg" />

  <link rel="shortcut icon" href="image/icon.png">
  <script language="javascript"><?php echo file_get_contents("assets/iealert.min.js"); ?></script>
  <style type="text/css" id="stylesheet"><?php echo file_get_contents("assets/style.min.css"); ?></style>
  <style type="text/css" id="sweetsheet"><?php echo file_get_contents("assets/sweetalert2.min.css"); ?></style>
  <title>フレ石編成的ななにか</title>
</head>

<body>
  <div id="menu">
    <ul>
    <li><a href="/">ブログ</a></li>
    <li><a href="/gbf-summon-usage/">使い方</a></li>
    <li><a href="//github.com/micelle/gbf_summon/commits/master">更新履歴</a></li>
    <li><a href="//twitter.com/micelle9">お問い合わせ</a></li>
    </ul>
  </div>

  <div class="table setting">
    <p>最終更新：<?php
      $LUDate = getLastUpdateDate();
      print $LUDate;
    ?><br>情報が更新されない場合はキャッシュの削除をして下さい。</p>
  </div>

  <!-- AdSense  -->
  <div class="adsense">
    <ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-3052144799289425" data-ad-slot="1704901599"></ins>
    <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
  </div>

  <div class="table" id="summon_screeen">
    <h2>フレ石編成的ななにか</h2>
    <div class="box">
      <div class="type1">
        <div class="title type_icon">火属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type2">
        <div class="title type_icon">水属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type3">
        <div class="title type_icon">土属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type4">
        <div class="title type_icon">風属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type5">
        <div class="title type_icon">光属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type6">
        <div class="title type_icon">闇属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type7">
        <div class="title type_icon">フリー属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type8">
        <div class="title type_icon">フリー属性固定召喚石</div>
        <div class="content"><div class="image"><img></div><div class="spec"></div></div>
      </div>
      <div class="type9">
        <div class="title type_icon">ユーザーID</div>
        <div class="content"><div class="image"><img></div><div class="spec job"></div></div>
      </div>
    </div>
  </div>

  <div class="table setting" id="summon_setting" onselectstart="return false;" unselectable="on">
    <div class="box">
      <div class="type1" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">火属性</div>
        <select class="c_type" name="c_type" style="color:#FF0000;">
          <option value="type1" selected>火</option>
          <option value="type2">水</option>
          <option value="type3">土</option>
          <option value="type4">風</option>
          <option value="type5">光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type1"></select>
        <div class="radio">
          <input type="radio" name="type1" id="radio13" value="rank3" checked="">
          <label for="radio13" class="r_rank3">3凸</label>
          <input type="radio" name="type1" id="radio14" value="rank4">
          <label for="radio14" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>

      <div class="type2" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">水属性</div>
        <select class="c_type" name="c_type" style="color:#00FFFF;">
          <option value="type1">火</option>
          <option value="type2" selected>水</option>
          <option value="type3">土</option>
          <option value="type4">風</option>
          <option value="type5">光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type2"></select>
        <div class="radio">
          <input type="radio" name="type2" id="radio23" value="rank3" checked="">
          <label for="radio23" class="r_rank3">3凸</label>
          <input type="radio" name="type2" id="radio24" value="rank4">
          <label for="radio24" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>

      <div class="type3" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">土属性</div>
        <select class="c_type" name="c_type" style="color:#FF9872;">
          <option value="type1">火</option>
          <option value="type2">水</option>
          <option value="type3" selected>土</option>
          <option value="type4">風</option>
          <option value="type5">光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type3"></select>
        <div class="radio">
          <input type="radio" name="type3" id="radio33" value="rank3" checked="">
          <label for="radio33" class="r_rank3">3凸</label>
          <input type="radio" name="type3" id="radio34" value="rank4">
          <label for="radio34" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>

      <div class="type4" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">風属性</div>
        <select class="c_type" name="c_type" style="color:#00FF00;">
          <option value="type1">火</option>
          <option value="type2">水</option>
          <option value="type3">土</option>
          <option value="type4" selected>風</option>
          <option value="type5">光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type4"></select>
        <div class="radio">
          <input type="radio" name="type4" id="radio43" value="rank3" checked="">
          <label for="radio43" class="r_rank3">3凸</label>
          <input type="radio" name="type4" id="radio44" value="rank4">
          <label for="radio44" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>
      <div class="type5" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">光属性</div>
        <select class="c_type" name="c_type" style="color:#FFFF00;">
          <option value="type1">火</option>
          <option value="type2">水</option>
          <option value="type3">土</option>
          <option value="type4">風</option>
          <option value="type5" selected>光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type5"></select>
        <div class="radio">
          <input type="radio" name="type5" id="radio53" value="rank3" checked="">
          <label for="radio53" class="r_rank3">3凸</label>
          <input type="radio" name="type5" id="radio54" value="rank4">
          <label for="radio54" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>
      <div class="type6" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">闇属性</div>
        <select class="c_type" name="c_type" style="color:#FF00FF;">
          <option value="type1">火</option>
          <option value="type2">水</option>
          <option value="type3">土</option>
          <option value="type4">風</option>
          <option value="type5">光</option>
          <option value="type6" selected>闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type6"></select>
        <div class="radio">
          <input type="radio" name="type6" id="radio63" value="rank3" checked="">
          <label for="radio63" class="r_rank3">3凸</label>
          <input type="radio" name="type6" id="radio64" value="rank4">
          <label for="radio64" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>
      <div class="type7" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">フリー属性1</div>
        <select class="c_type" name="c_type" style="color:#FFFF00;">
          <option value="type1">火</option>
          <option value="type2">水</option>
          <option value="type3">土</option>
          <option value="type4">風</option>
          <option value="type5" selected>光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr" selected>SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type7"></select>
        <div class="radio">
          <input type="radio" name="type7" id="radio73" value="rank3" checked="">
          <label for="radio73" class="r_rank3">3凸</label>
          <input type="radio" name="type7" id="radio74" value="rank4">
          <label for="radio74" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>
      <div class="type8" data-select="summon">
        <div class="title type_icon" style="border-bottom:none;">フリー属性2
          <div class="float">
            💬<span>クリックすることで<br>[フリー⇔推し]<br>を切り替えることができます</span>
          </div>
        </div>
        <select class="c_type" name="c_type" style="color:#FFFF00;">
          <option value="type1">火</option>
          <option value="type2">水</option>
          <option value="type3">土</option>
          <option value="type4">風</option>
          <option value="type5" selected>光</option>
          <option value="type6">闇</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="ssr">SSR</option>
          <option value="sr">SR</option>
          <!-- <option value="r">R</option> -->
          <!-- <option value="n">N</option> -->
        </select>
        <select class="c_summon" name="type8"></select>
        <div class="radio">
          <input type="radio" name="type8" id="radio83" value="rank3" checked="">
          <label for="radio83" class="r_rank3">3凸</label>
          <input type="radio" name="type8" id="radio84" value="rank4">
          <label for="radio84" class="r_rank4" style="display: none;">4凸</label>
        </div>
      </div>
      <div class="type9" data-select="job">
        <div class="title type_icon" style="border-bottom:none;">ユーザーID</div>
        <select class="c_type" name="c_type">
          <option value="Djeeta">ジータ</option>
          <option value="Gran">グラン</option>
        </select>
        <select class="c_rarity" name="c_rarity">
          <option value="c4">Class IV</option>
          <option value="c3">Class III</option>
          <option value="c2">Class II</option>
          <option value="c1" selected>Class I</option>
          <option value="ex">Class Ex</option>
          <option value="skin">Skin</option>
        </select>
        <select class="c_summon" name="type9"></select>
        <input type="number" name="user_id" value="12345678">
      </div>
      <a class="change button">変更する</a>
    </div>
  </div>

  <!-- AdSense  -->
  <div class="adsense">
    <ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-3052144799289425" data-ad-slot="1704901599"></ins>
    <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
  </div>

  <div class="table setting" onselectstart="return false;" unselectable="on">
    <div class="box">
      <div><div id="screenshot" class="button">画像生成</div></div>
      <div><span class="arrow"></span></div>
      <!-- <div><a href="#"><div id="download_screen" class="button" >ダウンロード</div></a></div> -->
      <div><div id="tweet_open" class="button">ツイート</div></div>
    </div>
    <p>画像生成を行わないと、ツイートできません</p>
  </div>
  <div id="output_screen">
    <p>以下のプレビューからも保存できます</p>
    <img id="screen_image">
  </div>

  <div class="table setting">
    <hr>
    <p>なにかありましたら<a href="https://twitter.com/micelle9" target="_blank" style="color:#59b1eb;">Twitter</a>までご報告ください（´・ω・｀）</p>
    <p>あと<a href="http://amzn.asia/5euNPQp" target="_blank" style="color:#59b1eb;">コレ</a>欲しいの（´・ω・｀）</p>
  </div>

  <div class="table setting">
    <p style="font-size:12px;">&copy; 2017 micelle</p>
  </div>

  <?php
    if(strpos($_SERVER['REQUEST_URI'],'test') !== false){
      require_once "deploy/change_index.php";
    }
  ?>

  <!-- 各種Script -->
  <script defer src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script defer src="//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-alpha1/html2canvas.min.js"></script>
  <script defer src="//cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js"></script>
  <script defer src="//cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.6.6/sweetalert2.min.js"></script>
  <script defer src="//cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.min.js"></script>
  <script defer src="<?php
    $file = "assets/script.min.js";
    $FUDate = getFileUpdateDate($file);
    print $FUDate;
  ?>"></script>
  <?php
    if(strpos($_SERVER['REQUEST_URI'],'test') !== false){
      $file = "assets/script_deploy.min.js";
      $FUDate = getFileUpdateDate($file);
      print "<script defer src=".$FUDate."></script>";
    }
  ?>
  <?php
  ?>
  <script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-56839189-1', 'auto');ga('send', 'pageview');</script>
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <script>(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"ca-pub-3052144799289425",enable_page_level_ads:true});</script>

</body>

</html>
