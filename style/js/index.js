
/**
 * user
 */
$(".left ul li").click(function () {
    $(".left ul li").each(function () {
        $(this).removeClass("layui-this");
    });
    $(this).addClass("layui-this");
});
