
layui.config({
    base: '/style/js/'
}).use(['element', 'laypage', 'jquery', 'laytpl', 'layer'], function () {
    element = layui.element, laypage = layui.laypage, $ = layui.$, laytpl = layui.laytpl, layer = layui.layer;
    var articletype;
    initHot();  
    inittab();
    laypage.render({
        elem: 'page'
        , limit: 10
        , jump: function (obj) {
            var loading = layer.load(2);
            var pageSize = obj.limit;
            var pageIndex = obj.curr;
            var listHtml = document.getElementById('article-item').innerHTML;
            loadarticle(pageIndex, pageSize, listHtml, articletype, loading);
        },
    });
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
/**
 * 加载
 */
function loadarticle(pageIndex, pageSize, listHtml, articletype, loading) {
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
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                articleview = document.getElementById('article-item-id');
                laytpl(listHtml).render(data, function (html) {
                    articleview.innerHTML = html;
                })
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
            layer.close(loading);
        }
    })
}
function inittab() {
    var articleDom = document.getElementById('article-item').innerHTML;
    $('.title-type a').click(function () {
        var loading = layer.load(2);
        $('.title-type a').each(function () {
            $(this).removeClass('active');
        });
        var thisItem = $(this)[0];
        $(this).addClass('active');
        if (thisItem.innerText == '散文礼记') {
            articletype = '1';
        } else if (thisItem.innerText == '旅游杂记') {
            articletype = '2';
        } else if (thisItem.innerText == '编程世界') {
            articletype = '3';
        } else if (thisItem.innerText == '游戏人生') {
            articletype = '4';
        } else if (thisItem.innerText == '趣味杂记') {
            articletype = '5';
        }else {
            articletype = '';
        }
        loadarticle(1, 10, articleDom, articletype, loading);
    });
}
/**
 * 热门推荐
 */
function initHot(hotScript)
{
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