
$(function () {
    var tab = getSearchString('tab');
    setTab(tab);
});
var form, loading
function setTab(cursor) {
    for (var i = 1; i < 5; i++) {
        var nav = document.getElementById("nav_" + i);
        var con = document.getElementById("tab_" + i);
        if (i == cursor) {
            con.style.display = "block";
            nav.className = 'layui-nav-item layui-this'
        }
        else {
            con.style.display = "none";
            nav.className = 'layui-nav-item'
        }
    }
    if (cursor == 1) {
        layui.use(['form', 'element', 'laydate', 'upload'], function () {
            var laydate = layui.laydate, upload = layui.upload, table = layui.table;
            form = layui.form,
                laydate.render({
                    elem: '#birthdate'
                });
            $.ajax({
                url: url + 'user',
                type: 'get',
                datatype: 'json',
                success: function (response) {
                    if (response.code == "0") {
                        layer.close(loading);
                        form.val("userinfo", {
                            "account": response.data.account,
                            "username": response.data.username,
                            "sex": response.data.sex,
                            "birthdate": response.data.birthDate,
                            "phone": response.data.phone,
                            "email": response.data.email,
                            "sign": response.data.sign
                        });
                        $("#touxiang").attr("src", response.data.headPhoto);
                    }
                }
            });
            form.verify({
                phone: function (value) {
                    if (value.length > 0) {
                        if (!(/^1\d{10}$/.test(value))) {
                            return "请输入正确的手机号";
                        }
                    }
                },
                email: function (value) {
                    if (value.length > 0) {
                        if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
                            return "请输入正确的邮箱";
                        }
                    }
                },
                confirmpassword: function (value) {
                    if (value != $("#newpassword").val()) {
                        return "两次输入的密码不一致";
                    }
                }
            });
            form.on('submit(editUser)', function (data) {
                loading = layer.load(2);
                var userData = data.field;
                var userModel={
                    'account': userData.account,
                    'username': userData.username,
                    'sex': userData.sex,
                    'birthdate': userData.birthdate,
                    'phone': userData.phone,
                    'email': userData.email,
                    'sign': userData.sign
                }
                $.ajax({
                    url:url+'user',
                    type:'post',
                    contentType:'application/json; charset=utf-8',
                    datatype:'json',
                    data: JSON.stringify(userModel),
                    success:function(response)
                    {
                        if (response.code=='0') {
                            localStorage.setItem("token",response.data );
                            layer.close(loading);
                            layer.msg("修改成功", { icon: 6 }); 
                        }
                        else
                        {
                            layer.close(loading);
                            layer.msg(response.message, { icon: 5 });
                        }
                    }

                });
                return false;
            });
            form.on('submit(editPassword)', function (data) {
                loading = layer.load(2)
                var response = requestajax({
                    route: 'user/update/password',
                    type: 'post',
                    data: {
                        'password': $("#newpassword").val(),
                        'oldpassword': $("#oldpassword").val()
                    },
                    datatype: 'json',
                    async: true,
                    func: completeResponse
                });
                return false;
            });
            upload.render({
                elem: '#upload'
                , headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                , data: {
                    width: 168,
                    height: 168,
                    isAbs: true
                }
                , url: url + 'user/upload/image' //上传接口
                , before: function () {
                    loading = layer.load(2);
                }
                , done: function (res) {
                    localStorage.setItem("token", res.data.token);
                    $("#touxiang").attr("src", res.data.path);
                    $("#photo").attr('src', res.data.path);
                    location.reload();
                }
            });
        })
    }
    else if(cursor==2){
        loadUser();
    }
    else if (cursor == 3) {
        layui.use('table', function () {
            var table = layui.table;
            table.render({
                id: 'aTable'
                , method:'post'
                , elem: '#articleTable'
                , url: url + "article/page"
                , where:{
                        'account':'admin'
                    }
                ,contentType: 'application/json; charset=utf-8'
                , toolbar: false
                , width: 870
                , title: '用户数据表'
                , loading: true
                , headers: { 'Authorization': localStorage.getItem('token') }
                , limit: 10
                , cols: [[
                    { type: 'checkbox' }
                    , { field: 'id', title: 'ID', hide: true, unresize: true }
                    , { field: 'title', title: '标题' }
                    , { field: 'articleType', title: '专栏', align: 'center', width: 100 }
                    , { field: 'author', title: '作者' }
                    , { field: 'createTime', title: '提交日期', sort: true }
                    , { align: 'center', toolbar: '#bar', title: '操作' }
                ]]
                , page: true
                , parseData: function (res) {
                    return {
                        "code": res.code,
                        "msg": res.message,
                        "count": res.total,
                        "data": res.data
                    };
                }
            });

            //监听行工具事件
            table.on('tool(article)', function (obj) {
                var data = obj.data;
                if (obj.event === 'del') {
                    layer.confirm('确定删除？', function (index) {
                        loading = layer.load(2);
                        $.ajax({
                            url: url + 'article/' + data.id,
                            type: 'delete',
                            datatype: 'json',
                            success: function (response) {
                            },
                        })
                        table.reload('aTable', {
                            page: {
                                curr: 1
                            }
                        });
                        layer.close(loading);
                    });
                } else if (obj.event === 'edit') {
                    window.open('../article/addarticle.html?id=' + data.id)
                }
                else {
                    window.open('../article/detail.html?id=' + data.id)
                }
            });
            var $ = layui.$, active = {
                reload: function () {
                    table.reload('aTable', {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        }
                        ,method:'post'
                        ,contentType: 'application/json; charset=utf-8'
                        , where: {
                            titleContain: $('#title').val(),
                            isDraft:$('#isdraft').val()
                        }
                    });
                }
            };
            $('#table-search .layui-btn').on('click', function () {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
            });
        });
    }
    else if (cursor == 4) {
        layui.use(['laypage', 'element', 'jquery', 'laytpl', 'layer'], function () {
            var laypage = layui.laypage, laytpl = layui.laytpl, layer = layui.layer, element = layui.element;;
            loading = layer.load(2);
            var scriptHtml = document.getElementById('buildScript').innerHTML;
            laypage.render({
                elem: 'page'
                , limit: 5
                , jump: function (obj) {
                    var loading = layer.load(2);
                    var pageSize = obj.limit;
                    var pageIndex = obj.curr;
                    $.ajax({
                        url: url + 'user/tidings',
                        type: 'get',
                        datatype: 'json',
                        data: {
                            'pageIndex': pageIndex,
                            'pageSize': pageSize,
                        },
                        beforeSend: function (xhr) {
                            doBeforeSend(xhr);
                        },
                        success: function (response) {
                            if (response.code == '0') {
                                var data = {
                                    'list': response.data
                                };
                                var itemHtml = document.getElementById('tidings-item');
                                laytpl(scriptHtml).render(data, function (html) {
                                    itemHtml.innerHTML = html;
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
                },
            });
        });
    }
}


function completeDelete(params) {
    if (response.code == "200") {
        localStorage.setItem("token", response.data);
        layer.close(loading);
        layer.msg("修改成功", { icon: 6 });
    }
    else {
        layer.close(loading)
        layer.msg(response.message, { icon: 5 });
    }
}
function selectArticle() {
    $.ajax({
        url: url + 'user/getTidings',
        type: 'post',
        datatype: 'json',
        data: {
            'titleContain': $('#title-search').val(),
            'isDraft': $('#isdraft-search').val(),
        },
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                var itemHtml = document.getElementById('tidings-item');
                laytpl(scriptHtml).render(data, function (html) {
                    itemHtml.innerHTML = html;
                })
            }
            else {
                layer.msg('响应服务器失败', {
                    icon: 7
                });
            }
            layer.close(loading);

        },
    })
}
function loadUser(){
    layui.use(['flow','laytpl'],function(){
        var  flow = layui.flow,laytpl = layui.laytpl;;
        initLoading("user-info", 20);
        initLoading("article-file", 20);
        $.ajax({
            url:url+'user',
            type:'get',
            datatype:'json',
            success:function(res){
                var script = document.getElementById('user-info-script').innerHTML;
                var userInfoHtml = document.getElementById('user-info');
                laytpl(script).render(res.data, function (html) {
                    userInfoHtml.innerHTML = html;
                });
            }
        });
        $.ajax({
            url:url+'article/file',
            type:'post',
            datatype:'json',
            data: {
                "Account": ''
            },
            success:function(res){
                var data = {
                    'list': res.data
                };
                var script = document.getElementById('article-file-script').innerHTML;
                var fileHtml = document.getElementById('article-file');
                laytpl(script).render(data, function (html) {
                    fileHtml.innerHTML = html;
                });
            }
        });
        flow.load({
            elem: '#time-axis' //流加载容器。
            ,end:'没有更多了' 
            ,isAuto:false
            , done: function (page, next) { //执行下一页的回调
                var lis = [];
                $.ajax({
                    url: url + 'whisper/page',
                    type: 'get',
                    datatype: 'json',
                    data: {
                        'pageIndex': page,
                        'pageSize': 3,
                    },
                    success: function (res) {
                        layui.each(res.data, function(index, item){
                            lis.push('<li class="layui-timeline-item">');
                            lis.push('<i class="layui-icon layui-timeline-axis">&#xe63f;</i>');
                            lis.push('<div class="layui-timeline-content layui-text">');
                            lis.push('<h3 class="layui-timeline-title">'+item.createDate+'</h3>');
                            lis.push('<div class="section">');
                            lis.push('<p>');
                            lis.push(item.content);
                            lis.push('</p>');
                            lis.push('</div>');
                            lis.push('</div>');
                            lis.push('</li>');
                          });
                        next(lis.join(''), (page*3) < res.total);
                    }
    
                });
            }
        });
    })
}