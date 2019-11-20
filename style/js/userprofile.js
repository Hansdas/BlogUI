
$(function () {
    setTab(1);
});
var form, loading
function setTab(cursor) {
    for (var i = 1; i < 5; i++) {
        var con = document.getElementById("tab_" + i);
        if (i == cursor) {
            con.style.display = "block";
        }
        else {
            con.style.display = "none";
        }
    }
    if (cursor == 1) {
        layui.use(['form', 'element', 'laydate', 'upload'], function () {
            var laydate = layui.laydate, upload = layui.upload, table = layui.table;
            form = layui.form,
                laydate.render({
                    elem: '#birthdate'
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
                requestajax({
                    route: 'user/updateuser',
                    type: 'post',
                    data: {
                        'account': userData.account,
                        'username': userData.username,
                        'sex': userData.sex,
                        'birthdate': userData.birthdate,
                        'phone': userData.phone,
                        'email': userData.email,
                        'sign': userData.sign
                    },
                    datatype: 'json',
                    async: true,
                    func: completeResponse
                });
                return false;
            });
            form.on('submit(editPassword)', function (data) {
                loading = layer.load(2)
                var response = requestajax({
                    route: 'user/updatepassword',
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
            requestajax({
                route: 'user/userinfo',
                type: 'get',
                datatype: 'json',
                async: true,
                func: completeBindUser
            });
            upload.render({
                elem: '#upload'
                , headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                , data: {
                    width: 168,
                    height: 168,
                    isAbs: true
                }
                , url: url + 'user/uploadPhoto' //上传接口
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
    if (cursor == 3) {
        layui.use('table', function () {
            var table = layui.table;
            table.render({
                id:'aTable'
                ,elem: '#articleTable'
                , url: url + "article/selectArticle"
                , toolbar: false
                , width: 870
                , title: '用户数据表'
                , loading: true
                , headers: { 'Authorization': localStorage.getItem('token') }
                ,limit:10
                , cols: [[
                    { type: 'checkbox' }
                    , { field: 'id', title: 'ID', hide: true, unresize: true }
                    , { field: 'title', title: '标题' }
                    , { field: 'articleType', title: '专栏',align:'center',width:100 }
                    , { field: 'author', title: '作者' }
                    , { field: 'createTime', title: '提交日期', sort: true }
                    , { align: 'center', toolbar: '#bar',title:'操作' }
                ]]
                , page: true
                ,parseData: function(res){ 
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
                        requestajax({
                            route: 'article/delete/'+data.id,
                            type: 'delete',
                            datatype: 'json',
                            async: false                          
                        });
                        layer.close(index);
                        var route=url + "article/selectArticle";
                        table.reload('aTable',{
                            page: {
                                curr: 1 
                              }
                        });
                        // table.render({
                        //     elem: '#articleTable'
                        //     , url: url + "article/selectArticle"
                        //     , toolbar: false
                        //     , width: 870
                        //     , title: '用户数据表'
                        //     , loading: true
                        //     , headers: { 'Authorization': localStorage.getItem('token') }
                        //     ,limit:10
                        //     , cols: [[
                        //         { type: 'checkbox' }
                        //         , { field: 'id', title: 'ID', hide: true, unresize: true }
                        //         , { field: 'title', title: '标题' }
                        //         , { field: 'articleType', title: '专栏',align:'center',width:100 }
                        //         , { field: 'author', title: '作者' }
                        //         , { field: 'createTime', title: '提交日期', sort: true }
                        //         , { align: 'center', toolbar: '#bar',title:'操作' }
                        //     ]]
                        //     , page: true
                        //     ,parseData: function(res){ 
                        //         return {
                        //           "code": res.code, 
                        //           "msg": res.message,
                        //           "count": res.total, 
                        //           "data": res.data
                        //         };
                        //     }
                        // });
                        layer.close(loading);
                    });
                } else if (obj.event === 'edit') {
                    window.open('../article/addarticle?id='+data.id) 
                }
                else
                {
                  window.open('../article/detail?id='+data.id) 
                }
            });
        });
    }
}
function completeBindUser(response) {
    if (response != undefined) {
        if (response.code == "200") {
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
        }
    } else {
        layer.close(loading);
        layer.msg('响应服务器失败', {
            icon: 7
        });
    }
}

function completeResponse(response) {
    if (response.code == "200") {
        layer.close(loading);
        layer.msg("修改成功", { icon: 6 });
    }
    else {
        layer.close(loading)
        layer.msg(response.message, { icon: 5 });
    }
}
function  completeDelete(params) {
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