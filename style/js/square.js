layui.config({
    base: '/style/js/'
}).use(['element', 'jquery', 'laytpl', 'layer','layedit'], function () {
    element = layui.element,
     $ = layui.$, 
     laytpl = layui.laytpl, 
     layer = layui.layer,
     layedit = layui.layedit;
     var textcontent = layedit.build('L_content', {
        height: 50, //设置编辑器高度\
        tool: [, 'link' //超链接
            , 'face' //表情
        ]
    });
    initLoading("news-ul",50);
    initLoading("article-item",18);
    initLoading("mood",30);
    loadarticle();
})
/**
 * 加载文章
 */
function loadarticle() {
    $.ajax({
        url: url + 'article/SelectArticleByTypeMaxTime',
        type: 'get',
        datatype: 'json',
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                var script = document.getElementById('new-article').innerHTML;
                var listHtml = document.getElementById('article-item');
                laytpl(script).render(data, function (html) {
                    listHtml.innerHTML = html;
                })
            }
            else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }

        },
        complete: function (xhr) {
            doComplete(xhr);
        },
        error: function () {
            layer.msg('响应服务器失败', {
                icon: 7
            });
        }
    })
}
