$(function(){
  $("#branch_change").on("click", function (){
    var branch_val = $("#branch_list").val();
    var $branch_result = $("#branch_result");
    $branch_result.text(branch_val + "へ切り替えています");
    $.ajax({
      type: "POST",
      url: "deploy/change_deploy.php",
      dataType: "JSON",
      data: {
        branch: branch_val,
      },
    })
    .done(function (response) {
      $branch_result.text(response.data);
    })
    .fail(function () {
      $branch_result.text("切り替えに失敗しました");
    });
  });
});