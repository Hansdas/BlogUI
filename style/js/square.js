layui.config({
    base: '/style/js/'
}).use(['element', 'jquery', 'laytpl', 'layer', 'layedit', 'flow', 'form'], function () {
    element = layui.element,
        $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer,
        layedit = layui.layedit,
        flow = layui.flow,
        form = layui.form;
    var whisperContent = layedit.build('L_content', {
        height: 50, //设置编辑器高度\
        tool: [, 'link' //超链接
            , 'face' //表情
        ]
    });
    var deptObjs = document.getElementById("LAY_layedit_1").contentWindow.document.getElementsByTagName("body");
    deptObjs[0].style.fontSize = "12px";
    deptObjs[0].style.padding = "4px";
    deptObjs[0].style.background = "white";
    initLoading("news-ul",0, 374);
    initLoading("article-item",0, 374);
    loadarticle();
    loadWhisper(0, 5);
    var connection = new signalR.HubConnectionBuilder().withUrl(httpAddress + 'chatHub').build();
    connection.on('InvokeMessage',function(reviceMessage){
        var data = {
            'list': reviceMessage.data
        };
        bindWhisper(data);
        $('.layui-flow-more').html('<a href="javascript:;" onclick="loadMore()"><cite>加载更多</cite></a>');
    } );
    connection.start();
    $('.layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    var active = {
        addWhisper: function () {
            var text = layedit.getText(whisperContent);
            if (text == '') {
                layer.msg('不能为空', {
                    icon: 7,
                    time: 1500
                });
                return;
            }
            var loading = layer.load(2);
            $.ajax({
                url: url + 'whisper/add',
                type: 'post',
                datatype: 'json',
                data: {
                    'content': layedit.getContent(whisperContent)
                },
                beforeSend: function (xhr) {
                    doBeforeSend(xhr);
                },
                success: function (response) {
                    if (response.code == '401') {
                        layer.msg('你还未登录', {
                            time: 1500,
                        }, function () {
                            parent.location.href = "../login/login.html";
                        });
                    }
                    layer.close(loading);
                },
                complete: function (xhr) {
                    doComplete(xhr);
                }
            })
        }
    }
})
/**
 * 加载文章
 */
function loadarticle() {
    $.ajax({
        url: url + 'article/type/maxtime',
        type: 'get',
        datatype: 'json',
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
            } else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }

        },
    })
}

function loadWhisper(index, top) {
    initLoading("whisper-item", 0,89);
    $.ajax({
        url: url + 'whisper/square',
        type: 'get',
        datatype: 'json',
        data: {
            'pageIndex': index,
            'top': top,
        },
        success: function (res) {
            if (res.code == '0') {
                var data = {
                    'list': res.data
                };
                bindWhisper(data);
                if (top == 11) {
                    $('.layui-flow-more').html('右上角查看更多！');
                }
            }
        },       
    });
}

function loadMore() {
    loadWhisper(0, 11);
}

function bindWhisper(data) {
    var script = document.getElementById('new-whisper').innerHTML;
    var listHtml = document.getElementById('whisper-item');
    laytpl(script).render(data, function (html) {
        listHtml.innerHTML = html;
    });
}
function review(id){
    layer.open({
        title: '留言',
        type: 2,
        area: ['700px', '500px'],
        content: '../whisper/review.html?id='+id,
        success: function (layero, index) {
            var body = layer.getChildFrame('body', index);
            //var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            body.find('#articleId').val(id)
            body.find('#postReviceUser').val(guid)
        }
    });
}
