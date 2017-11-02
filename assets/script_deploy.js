window.onload = function(){
  $("#branch_change").on("click", function (){
    var branch_val = $("#branch_list").val();
    console.log(branch_val);
    $.ajax({
      type: "POST",
      url: "../test_repository_deploy/branch_change_deploy.php",
      dataType: "JSON",
      data: {
        branch: branch_val,
      },
    })
    .done(function (response) {
      $("#branch_result").text(response.data);
    })
    .fail(function () {
      $("#branch_result").text("失敗しました");
    });
  });
}