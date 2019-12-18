var allCommentList = null;
layui.config({
    base: '/style/js/'
}).use(['element', 'jquery', 'layer', 'menu', 'laytpl', 'form', 'laypage'], function () {
    element = layui.element, $ = layui.$, menu = layui.menu, laytpl = layui.laytpl, layer = layui.layer, laypage = layui.laypage;
    var loading = layer.load(2);
    var form = form = layui.form;
    var commentScript = document.getElementById('buildComment').innerHTML;
    menu.init();
    var id = getSearchString('id');
    var type = getSearchString('t');   
    loadarticle(id, commentScript);
    loadupnext(id, type);
    layer.close(loading);
    form.on('submit(review)', function (data) {
        loading = layer.load(2);
        var commentModel = {
            'Content': data.field.desc,
        }
        $.ajax({
            url: url + 'article/review/' + id,
            contentType: 'application/json; charset=utf-8',
            type: 'post',
            datatype: 'json',
            data: JSON.stringify(commentModel),
            beforeSend: function (xhr) {
                doBeforeSend(xhr);
            },
            success: function (response) {
                if (response.code == 0) {
                    var commentModel = response.data;
                    var newCommentList = new Array(allCommentList.length + 1);
                    newCommentList[0] = commentModel;
                    for (var i = 0; i < allCommentList.length; i++) {
                        newCommentList[i + 1] = allCommentList[i]
                    };
                    $('.volume').html('全部评论（' + newCommentList.length + '）');
                    $('textarea').val('');
                    setPageList(newCommentList, commentScript);
                    var connection = new signalR.HubConnectionBuilder().withUrl('http://127.0.0.1:5000/chatHub').build();
                    connection.start().then(function () {
                        var apiRoute=url+'Singalr/admin';
                        var token=localStorage.getItem('token');
                        fetch(apiRoute,{
                            method:'get',
                            headers:{
                                'Authorization':'Bearer ' + token                               
                            }
                        })
                        event.preventDefault();
                    })
                    layer.close(loading);
                } else {
                    layer.close(loading);
                    layer.msg("评论失败", {
                        icon: 5
                    });
                }
            },
            complete: function (xhr) {
                doComplete(xhr);
            },
        })
        return false;
    });
});
/**
 * 初始化分页
 * @param {*} commentList 
 */
function setPageList(commentList, commentScript) {
    allCommentList = commentList;
    laypage.render({
        elem: 'page'
        , limit: 10
        , count: commentList.length
        , jump: function (obj) {
            var pageData = commentList.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
            loadComment(pageData, commentScript);
        }
    });
}
/**
 * 加载文章内容
 * @param {} id 
 */
function loadarticle(id, commentScript) {
    $.ajax({
        url: url + 'article/detail/' + id,
        type: 'get',
        datatype: 'json',
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'title': response.data.title,
                    'createtime': response.data.createTime,
                    'articletype': response.data.articleType,
                    'content': response.data.content,
                    'author': response.data.author
                };
                $('title').html(data.title);
                var article = document.getElementById('buildview').innerHTML;
                articleview = document.getElementById('detail');
                laytpl(article).render(data, function (html) {
                    articleview.innerHTML = html;
                });
                commentList = response.data.comments;
                $('.volume').html('全部评论（' + commentList.length + '）')
                setPageList(commentList, commentScript);
                if (response.data.isDraft == '是') {
                    $(".comment").hide();
                }
                var c = getSearchString('c');
                if (c=='c') {
                   $('#desc').focus(); 
                } 
            }
            else {
                layer.msg('响应服务器失败', { icon: 7 });
            }
        },
        complete: function (xhr) {
            doComplete(xhr);
        },

    });
}
/**
 * 加载评论
 * @param {*} comments 
 */
function loadComment(commentList, comments) {
    var commentData = {
        'list': commentList
    }
    commentsView = document.getElementById('comment-item');
    laytpl(comments).render(commentData, function (html) {
        commentsView.innerHTML = html;
    });
    $(".comment").show();
    $('.reply').bind('click', function () {
        var username = $(this).parent('div').children('.tit').children('a').eq(0).text();
        var guid = $(this).children('input').eq(1).val();
        layer.open({
            title: '@ ' + username,
            type: 2,
            area: ['800px', '210px'],
            content: '../review/review.html',
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                //var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                body.find('#articleId').val(id)
                body.find('#postReviceUser').val(guid)
            }
        });
    });
};

/**
 * 加载上一下下一页按钮
 * @param {} id 
 * @param {*} type 
 */
function loadupnext(id, type) {
    $.ajax({
        url: url + 'article/nextup/' + id + '/' + type,
        type: 'get',
        datatype: 'json',
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        success: function (response) {
            if (response.code == '0') {
                var type = getSearchString('t');
                $('.btn-box').empty();
                if (response.data.beforeId > 0) {
                    $('.btn-box').append('<a href="detail?id=' + response.data.beforeId + '&t=' + type + '" target="_parent" class="layui-btn layui-btn-primary">上一篇：' + response.data.beforeTitle + '</a>')
                    $('.btn-box').append('</br>');
                }
                if (response.data.nextId > 0) {
                    $('.btn-box').append('<a href="detail?id=' + response.data.nextId + '&t=' + type + '" target="_parent" class="layui-btn layui-btn-primary">下一篇：' + response.data.nextTitle + '</a>')
                }
            }
            else {
                layer.msg('响应服务器失败', { icon: 7 });
            }
        },
        complete: function (xhr) {
            doComplete(xhr);
        },

    });
};