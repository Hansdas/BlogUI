layui.config({
    base: '/style/js/'
}).use(['element', 'jquery', 'laytpl', 'layer', 'layedit', 'flow', 'form','carousel'], function () {
    element = layui.element,
        $ = layui.$,
        laytpl = layui.laytpl,
        layer = layui.layer,
        layedit = layui.layedit,
        flow = layui.flow,
        carousel = layui.carousel
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
    initLoading("news-ul",0, 59);
    initLoading("article-item",0, 354);
    loadarticle();
    loadWhisper(0, 5);
    loadReadRank();
    loadVideo();
    var connection = new signalR.HubConnectionBuilder().withUrl(httpAddress + 'chatHub').build();
    connection.on('SendAllClientsMessage',function(reviceMessage){
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
            })
        }
    }
})
function loadVideo(){
    var condition= JSON.stringify({
        'pageIndex': 1,
        'pageSize': 3,
    });
    $.ajax({
        url: url + 'video/page',
        type: 'post',
        datatype: 'json',
        contentType:'application/json; charset=utf-8',
        data:condition,
        success: function (res) {
            var data = {
                'list': res.data
            };
            var script = document.getElementById('video-script').innerHTML;
            var listHtml = document.getElementById('video-view');
            laytpl(script).render(data, function (html) {
                listHtml.innerHTML = html;
            })
            carousel.render({
                elem: '#video'
                ,height:'236px'
                ,width:'99%'
                ,arrow: 'always'
              });
        }

    });
}
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
function review(id,account){
    layer.open({
        title: '留言',
        type: 2,
        area: ['1000px', '500px'],
        content: '../whisper/review.html?id='+id+'&revicer='+account,
    });
}
function loadReadRank(){
    initLoading("read-li-item", 0,89);
    $.ajax({
        url: url + 'article/read/rank/5',
        type: 'get',
        datatype: 'json',
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                var hotScript = document.getElementById('read-item-script').innerHTML;
                var liHtmlDom = document.getElementById('read-li-item');
                laytpl(hotScript).render(data, function (html) {
                    liHtmlDom.innerHTML = html;
                })
            }
        },       
    });  
}
