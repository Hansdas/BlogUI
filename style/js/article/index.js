var articletype='';
layui.config({
    base: '/style/js/'
}).use(['element', 'laypage', 'jquery', 'laytpl', 'layer'], function () {
    element = layui.element, laypage = layui.laypage, $ = layui.$, laytpl = layui.laytpl, layer = layui.layer;
    var total=0;
    initHot(); 
    element.on('tab(tab-article)', function(){
        articletype=this.getAttribute('lay-id');
        loadarticle(1, 10,true); 
      });
    loadarticle(1, 10,true); 
})
function praise(id) {
    var loading = layer.load(2);
    var text = $('#' + id).parent().find('span')[0].innerText;
    var regex = /[^0-9]+/g;
    var token=localStorage.getItem('token'); 
    if (token ==null) {
            layer.msg('你还未登录', {
                time: 1500
                ,icon: 7
                ,offset: ['200PX', '450PX']
            });
            layer.close(loading);
            return;
    }
    $.ajax({
        url: url + 'article/praise/' + id,
        type: 'post',
        datatype: 'json',
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        success: function (response) {
            if (response.code == '0') {
                layer.close(loading);
                if (response.message == '0') {
                    layer.msg("点赞成功", { icon: 6 ,offset: ['200PX', '450PX'] });
                    var praiseCount = parseInt(text.replace(regex, '')) + 1;
                    $('#' + id).parent().find('span')[0].innerText = '点赞(' + praiseCount + ')';
                }
                else {
                    layer.open({
                        title: '提示'
                        , content: response.message
                        , btn: ['确定', '取消']
                        ,offset: ['200PX', '450PX']
                        , yes: function () {
                            $.ajax({
                                url: url + 'article/praiseOut/' + id,
                                type: 'post',
                                datatype: 'json',
                                beforeSend: function (xhr) {
                                    doBeforeSend(xhr);
                                },
                                success: function (response) {
                                    if (response.code == '0') {
                                        layer.msg("取消点赞成功", { icon: 6,offset: ['200PX', '450PX']  });
                                        var praiseCount = parseInt(text.replace(regex, '')) - 1;
                                        $('#' + id).parent().find('span')[0].innerText = '点赞(' + praiseCount + ')';
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

                            });
                        }
                        , btn2: function (index) {
                            layer.close(index);
                        }

                    });
                }
            }
            else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }
            layer.close(loading);

        },
        complete: function (xhr) {
            doComplete(xhr);
        },
        error: function () {
            layer.msg('响应服务器失败', {
                icon: 7
            });
        }
    });
}
function loadarticle(pageIndex, pageSize,initPage) {
    initLoading("pageLoading", 50);
    var conditionModel={
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        'articleType': articletype,
        'fullText':$('#fullText').val()
    }
    $.ajax({
        url: url + 'article/page',
        type: 'post',
        datatype: 'json',
        contentType:'application/json; charset=utf-8',
        data: JSON.stringify(conditionModel),
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                var script = document.getElementById('article-item-script').innerHTML;
                var itemhtml = document.getElementById('article-item-id');
                laytpl(script).render(data, function (html) {
                    itemhtml.innerHTML = html;
                });
                if(initPage){
                    laypage.render({
                        elem: 'page'
                        ,limit: 10
                        ,count: response.total
                        ,first: '首页'
                        ,last: '尾页'
                        , jump: function (obj,first) {
                            if(!first){
                                var pageSize = obj.limit;
                                var pageIndex = obj.curr;
                                loadarticle(pageIndex, pageSize,false);
                              }
                        },
                    });
                }

            }
            else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }
            $('#toTop').focus(); 
            closeLoading("pageLoading");
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
/**
 * 热门推荐
 */
function initHot(hotScript)
{
    initLoading("hot-li-item", 50);
    $.ajax({
        url: url + 'article/hotArticle',
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
                var hotScript = document.getElementById('hot-item-script').innerHTML;
                var liHtmlDom = document.getElementById('hot-li-item');
                laytpl(hotScript).render(data, function (html) {
                    liHtmlDom.innerHTML = html;
                })
            }
            else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }
            closeLoading("hot-li-item");
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
function search(){
    loadarticle(1, 10,true);
}