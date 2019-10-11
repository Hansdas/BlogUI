/**
 * 加载文章首页
 */
function loadtotal(articletype) {
    var total = requestajax({
        route: 'article/loadtotal/' + articletype,
        type: 'get',
        datatype: 'text'
    });
    return total;
}

function loadarticle(pageIndex, pageSize, article, articletype) {
    var response = requestajax({
        route: 'article/loadarticle',
        type: 'get',
        datatype: 'json',
        data: {
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'articletype': articletype
        }
    });
    if (response != undefined) {
        var data = {
            'list': response.data
        };
        articleview = document.getElementById('article-item-id');
        laytpl(article).render(data, function (html) {
            articleview.innerHTML = html;
        })
    } else {
        layer.msg('响应服务器失败', {
            icon: 7
        });
    }
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

/**
 * user
 */
$(".left ul li").click(function () {
    $(".left ul li").each(function () {
        $(this).removeClass("layui-this");
    });
    $(this).addClass("layui-this");
});

function verify(form) {
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
        content: function (value) {
            layedit.sync(editIndex);
        }
    });
}

function beforesend(xhr) {
    if (localStorage.getItem("token") !== null) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    }
};

function bindUser(form) {
    var response = requestajax({
        route: 'user/userinfo',
        type: 'get',
        datatype: 'json',
        beforefunc: beforesend,
        async: false
    });
    if (response != undefined) {
        if (response.code == "200") {
            form.val("userinfo", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                "account": response.data.account,
                "username": response.data.username,
                "sex": response.data.sex,
                "date": response.data.birthdate,
                "phone": response.data.phone,
                "email": response.data.email,
                "sign": response.data.sign
            });
        }
    } else {
        layer.msg('响应服务器失败', {
            icon: 7
        });
    }
}

function saveUser(form) {
    form.on('submit(saveUser)', function (data) {
        var userData = data.field;
        var response = requestajax({
            route: 'user/updateuser',
            type: 'post',
            data:{
                'account':userData.account,
                'username':userData.username,
                'sex':userData.sex,
                'birthdate':userData.birthdate,
                'phone':userData.phone,
                'email':userData.email,
                'sign':userData.sign
            },
            datatype: 'json',
        });
        return false;
    });
}