if (location.hash == "#profile") {
  var obj = {};
  obj.info = true;
  $('.prt-fix-support').map(function(i) {
    var img = $(this).find('.btn-fix-image');
    var inf = $(this).find('.prt-fix-info').attr('class');
    var num = (function() {
      if (i < 2) return (i + 7);
      return (i - 1);
    })();
    var target = 'type' + num;
    var id = $(img).attr("data-image-id");
    var rarity = (function() {
      if (id > 2040000000) return "ssr";
      if (id > 2030000000) return "sr";
      if (id > 2020000000) return "r";
      if (id > 2010000000) return "n";
    })();
    var rank = (function() {
      if (/rank1/.test(inf)) return "rank3";
      if (/rank2/.test(inf)) return "rank4";
      return "rank0";
    })();
    var lv = $(this).find('.prt-fix-name').text().match(/Lv(\d+).+/)[1];
    var quality = $(img).attr("data-quality");
    var ary = {"target": target, "type": null, "rarity": rarity, "id": id, "rank": rank, "level": lv, "quality": quality};
    obj[num] = ary;
  });
  var img = $('.img-pc').attr("data-image-name");
  var id = img.replace(/_[01]_01/, '');
  var type = (function() {
    if (/_0_01/.test(img)) return "Gran";
    if (/_1_01/.test(img)) return "Djeeta";
  })();
  var user = $('.prt-user-id').text().match(/(\d+)/)[1];
  var ary = {"target": "type9", "type": type, "rarity": null, "id": id, "rank": "rank0"};
  obj['9'] = ary;
  obj['0'] = {"user": user, "text": "", "summon": true};
  var jsn = JSON.stringify(obj);
  var qry = encodeURIComponent(jsn);
  var url = 'http://localhost/gbf_summon/?' + qry;
  console.info(jsn);
  window.open(url);
}