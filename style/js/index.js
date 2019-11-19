/**
 * 加载文章首页
 */
function loadtotal(articletype) {
    var total = requestajax({
        route: 'article/loadtotal/' + articletype,
        type: 'get',
        datatype: 'text'
    });
    return total;
}

function loadarticle(pageIndex, pageSize, article, articletype) {
    var response = requestajax({
        route: 'article/loadarticle',
        type: 'get',
        datatype: 'json',
        data: {
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'articletype': articletype
        }
    });
    if (response != undefined) {
        var data = {
            'list': response.data
        };
        articleview = document.getElementById('article-item-id');
        laytpl(article).render(data, function (html) {
            articleview.innerHTML = html;
        })
    } else {
        layer.msg('响应服务器失败', {
            icon: 7
        });
    }
}

function inittab() {
    var articleDom = document.getElementById('article-item').innerHTML;
    $('.title-type a').click(function () {
        $('.title-type a').each(function () {
            $(this).removeClass('active');
        });
        var thisItem = $(this)[0];
        $(this).addClass('active');
        if (thisItem.innerText == '散文礼记') {
            articletype = '1';
        } else if (thisItem.innerText == '编程世界') {
            articletype = '2';
        } else if (thisItem.innerText == '旅游杂记') {
            articletype = '3';
        } else if (thisItem.innerText == '游戏人生') {
            articletype = '4';
        } else {
            articletype = '';
        }
        loadarticle(1, 10, articleDom, articletype);
    });
}

/**
 * user
 */
$(".left ul li").click(function () {
    $(".left ul li").each(function () {
        $(this).removeClass("layui-this");
    });
    $(this).addClass("layui-this");
});
