/**
 * 加载文章首页
 */
function loadtotal(articletype) {
    var total =requestajax('article/loadtotal','get','text') ;
    return total;
}
function loadarticle(pageIndex, pageSize, article, articletype) {
    $.ajax({
        url: 'https://127.0.0.1:5001/blogh/article/loadarticle',
        type: 'get',
        data: {
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'articletype': articletype
        },
        datatype: 'json',
        async:false,
        success: function (response) {
            var data = { 'list': response.data };
            articleview = document.getElementById('article-item-id');
            laytpl(article).render(data, function (html) {
                articleview.innerHTML = html;
            });
        },
        error: function () {
            layer.msg('响应服务器失败', { icon: 7 });
        }
    });
}
function inittab()
{
    var articleDom = document.getElementById('article-item').innerHTML;
    $('.title-type a').click(function () {
        $('.title-type a').each(function () {
            $(this).removeClass('active');
        });
        var thisItem = $(this)[0];
        $(this).addClass('active');
        if (thisItem.innerText == '散文礼记') {
            articletype = '1';
        }
        if (thisItem.innerText == '编程世界') {
            articletype = '2';
        }
        if (thisItem.innerText == '旅游杂记') {
            articletype = '3';
        }
        if (thisItem.innerText == '游戏人生') {
            articletype = '4';
        }
        loadarticle(1, 10, articleDom, articletype);
    });
}