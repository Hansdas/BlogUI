var loading, form,layedit,textcontent;
layui.use(['form', 'layer', 'layedit'], function () {
    var  $ = layui.jquery, layer = layui.layer;
    var imgUrls = "";
    form = layui.form;
    layedit = layui.layedit;
    var id = getSearchString('id');
    bindselect();
    if (id == undefined) {
        checklogin(layer);
    }
    else {
        loading = layer.load(2);
        requestajax({
            route: 'article/detail/' + id,
            type: 'get',
            datatype: 'json',
            async: true,
            func: onCompeteBindEdit
        });
    }
    layedit.set({
        uploadImage: {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
            url: url + 'upload/uploadImage',
            accept: 'image',
            acceptMime: 'image/*',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: 1024 * 10,
            data: {
                width: 1200,
                height: 1200,
                isAbs: false
            },
            done: function (res) {
                if (res.code == 0) {
                    imgUrls = imgUrls + res.data.virtualPath + ",";
                }
            }
        },
        uploadVideo: {
            url: '',
            accept: 'video',
            acceptMime: 'video/*',
            exts: 'mp4|flv|avi|rm|rmvb',
            size: 1024 * 10 * 2,
            done: function (data) {
                console.log(data);
            }
        },
        uploadFiles: {
            url: '',
            accept: 'file',
            acceptMime: 'file/*',
            size: '20480',
            autoInsert: true, //自动插入编辑器设置
            done: function (data) {
                console.log(data);
            }
        }
        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        //附件： filepath --附件路径
        ,
        calldel: {
            url: '/Upload/DeleteFile',
            datatype: 'json',
            async: 'true',
        }
        //测试参数
        ,
        backDelImg: true
        //开发者模式 --默认为false
        ,
        devmode: false
        //是否自动同步到textarea
        ,
        autoSync: true
        //内容改变监听事件
        ,
        onchange: function (content) {
            console.log(content);
        }
        //插入代码设置 --hide:false 等同于不配置codeConfig
        ,
        codeConfig: {
            hide: true, //是否隐藏编码语言选择框
            default: 'javascript', //hide为true时的默认语言格式
            encode: true //是否转义
            ,
            class: 'layui-code' //默认样式
        },
        tool: [
            'code', 'strong', 'italic', 'underline', 'del', 'addhr', '|', 'removeformat', 'fontFomatt', 'fontfamily', 'fontSize', 'fontBackColor', 'colorpicker', 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink', 'image_alt', 'video', 'attachment', '|', 'table', 'fullScreen'
        ],
        height: '500px'
    });
    textcontent = layedit.build('L_content');
    form.verify({
        articletype: function (value) {
            if (value == '...') {
                return '请选择专栏';
            }
        },
        content:function () {
            var content=layedit.getContent(textcontent);
            if (content=="") {
                return '请填写正文内容';
            }
        }
    });
    var active = {
        content: function () {
            layer.open({
                type: 0,
                title: false, //不显示标题栏                   
                skin: 'demo-class',
                closeBtn: false,
                area: ['1200px', '700px'],
                shade: 0.8,
                id: 'LAY_layuipro', //设定一个id，防止重复弹出
                btn: ['确定'],
                btnAlign: 'c',
                moveType: 1, //拖拽模式，0或者1
                content: layedit.getContent(textcontent)
            });
        },
        save: function () {
            form.on('submit(save)', function (data) {
                var articleData = data.field;
                var content = layedit.getContent(textcontent);
                var textsection = layedit.getText(textcontent);
                if (textsection.length > 30)
                    textsection = textsection.substring(-1, 30);
                loading = layer.load(2);
                requestajax({
                    route: 'article/addArticle',
                    type: 'post',
                    datatype: 'json',
                    data: {
                        'id':id,
                        'articletype': articleData.type,
                        'title': articleData.title,
                        'content': content,
                        'imgSrc': imgUrls,
                        'textsection': textsection,
                        'isDraft': true
                    },
                    async: true,
                    func: onCompleteSave
                });
                return false;
            })
        },
        publish: function () {
            form.on('submit(publish)', function (data) {
                var articleData = data.field;
                var content = layedit.getContent(textcontent);
                var textsection = layedit.getText(textcontent);
                if (textsection.length > 30)
                    textsection = textsection.substring(-1, 30);
                loading = layer.load(2);
                requestajax({
                    route: 'article/addArticle',
                    type: 'post',
                    datatype: 'json',
                    data: {
                        'id':id,
                        'articletype': articleData.type,
                        'title': articleData.title,
                        'content': content,
                        'imgSrc': imgUrls,
                        'textsection': textsection,
                        'isDraft': false
                    },
                    async: true,
                    func: onCompletePublish
                });
                return false;
            })
        }
    };

    $('.layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
});
function onCompleteSave(response) {
    if (response.code == 200) {
        layer.close(loading);
        layer.msg("保存成功", { icon: 6 });

    } else {
        layer.close(loading);
        layer.msg("保存失败", {
            icon: 5
        });
    }
}
function onCompletePublish(response) {
    if (response.code == 200) {
        window.location.href = '../home/index';
    } else {
        layer.close(loading);
        layer.msg("保存失败", {
            icon: 5
        });
    }
}
function checklogin(layer) {
    var response = requestajax({
        route: 'auth/isLogin',
        type: 'post',
        datatype: 'json',
        async: false
    });
    if (response != undefined) {
        if (response != '200') {
            layer.msg('你还未登录', {
                time: 1500,
            }, function () {
                window.location.href = '../login/login'
            });
        }
    }
    else {
        window.location.href = '../login/login'
    }
};
function bindselect() {
    var response = requestajax({
        route: 'upload/initPage',
        type: 'get',
        datatype: 'json',
        async: false
    });
    if (response != undefined) {
        $('#selecttype').empty();
        $('#selecttype').append('<option>...</option>');
        for (var item in response.data) {
            $('#selecttype').append('<option value=' + item + '>' + response.data[item] + '</option>');
        }
    };
    layui.form.render("select");
};
function onCompeteBindEdit(response) {
    if (response.code == 200) {
        form.val("articleInfo", {
            "type": response.data.articleType,
            "title": response.data.title,
            "content": response.data.content
        });
        layedit.setContent(textcontent, response.data.content);
        layer.close(loading);
    }
}