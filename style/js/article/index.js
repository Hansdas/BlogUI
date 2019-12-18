
layui.config({
    base: '/style/js/'
}).use(['element', 'laypage', 'jquery', 'laytpl','layer'], function () {
    element = layui.element, laypage = layui.laypage, $ = layui.$, laytpl = layui.laytpl, layer = layui.layer;
    var articletype;
    inittab();
    var listHtml = document.getElementById('article-item').innerHTML;
    laypage.render({
        elem: 'page'
        ,limit: 10
        , jump: function (obj) {
            var loading = layer.load(2);
            var pageSize = obj.limit;
            var pageIndex = obj.curr;
            loadarticle(pageIndex, pageSize, listHtml, articletype,loading);
        },
    });      
})
/**
 * 加载
 */
function loadarticle(pageIndex,pageSize,listHtml,articletype,loading) {
    $.ajax({
        url: url + 'article/loadarticle',
        type: 'get',
        datatype: 'json',
        data: {
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'articletype': articletype
        },
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        success: function (response) {
            if (response.code=='0') {
                var data = {
                    'list': response.data
                };
                articleview = document.getElementById('article-item-id');
                laytpl(listHtml).render(data, function (html) {
                    articleview.innerHTML = html;
                })               
            } 
            else
            {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }
            layer.close(loading);  
          
        },
        complete: function (xhr) {
            doComplete(xhr);
        },
    })
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