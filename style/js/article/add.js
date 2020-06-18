var loading, form,layedit,textcontent;
layui.use(['form', 'layer', 'layedit'], function () {
    var  $ = layui.jquery, layer = layui.layer;
    var filePaths = [];
    form = layui.form;
    layedit = layui.layedit;
    var id = getSearchString('id');
    bindselect();
    if (id == undefined) {
        id=0;
        checklogin();
    }
    else {
        bindArticle(id);
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
                    filePaths.push(res.data.src);
                }
            }
        },
        // uploadVideo: {
        //     url: '',
        //     accept: 'video',
        //     acceptMime: 'video/*',
        //     exts: 'mp4|flv|avi|rm|rmvb',
        //     size: 1024 * 10 * 2,
        //     done: function (data) {
        //         console.log(data);
        //     }
        // },
        // uploadFiles: {
        //     url: '',
        //     accept: 'file',
        //     acceptMime: 'file/*',
        //     size: '20480',
        //     autoInsert: true, //自动插入编辑器设置
        //     done: function (data) {
        //         console.log(data);
        //     }
        // }
        //右键删除图片/视频时的回调参数，post到后台删除服务器文件等操作，
        //传递参数：
        //图片： imgpath --图片路径
        //视频： filepath --视频路径 imgpath --封面路径
        //附件： filepath --附件路径
        //,
        calldel: {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
            url: url + 'upload/deletefile',
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
            'code', 'strong', 'italic', 'underline', 'del', 'addhr', '|', 'removeformat', 'fontFomatt', 'fontfamily', 'fontSize', 'fontBackColor', 'colorpicker', 'face', '|', 'left', 'center', 'right', '|', 'link', 'unlink', 'image_alt', '|', 'table', 'fullScreen'
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
                offset: 'auto',
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
                if (textsection.length > 170)
                    textsection = textsection.substring(-1, 170);
                loading = layer.load(2);
                var model={
                    'Id':parseInt(id),
                    'ArticleType': articleData.type,
                    'Title': articleData.title,
                    'Content': content,
                    'TextSection': textsection+'...',
                    'IsDraft': 'true',
                    'FilePaths':filePaths
                };
                $.ajax({
                    url:url+ 'article/add',
                    contentType:'application/json; charset=utf-8',
                    type:'post',
                    datatype:'json',
                    data: JSON.stringify(model),
                    success:function(response)
                    {
                        if (response.code == 0) {
                            layer.close(loading);
                            layer.msg("保存成功", { icon: 6 });
                    
                        } else {
                            layer.close(loading);
                            layer.msg("保存失败", {
                                icon: 5
                            });
                        }
                    }                  
                });
                return false;
            })
        },
        publish: function () {
            form.on('submit(publish)', function (data) {
                var articleData = data.field;
                var content = layedit.getContent(textcontent);
                var textsection = layedit.getText(textcontent);
                if (textsection.length > 200)
                    textsection = textsection.substring(-1, 170);
                loading = layer.load(2);
                var model={
                    'Id':parseInt(id),
                    'ArticleType': articleData.type,
                    'Title': articleData.title,
                    'Content': content,
                    'TextSection': textsection+'...',
                    'IsDraft': 'false',
                    'FilePaths':filePaths
                };
                $.ajax({
                    url:url+ 'article/add',
                    contentType:'application/json; charset=utf-8',
                    type:'post',
                    datatype:'json',
                    data: JSON.stringify(model),
                    success:function(response)
                    {
                        if (response.code == 0) {
                            layer.close(loading);
                            layer.msg("保存成功", { icon: 6 });
                    
                        } else {
                            layer.close(loading);
                            layer.msg("保存失败", {
                                icon: 5
                            });
                        }
                    }                    
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
function checklogin() {
    var token=localStorage.getItem('token'); 
    if (token ==null) {
            layer.msg('你还未登录', {
                time: 1500,
            }, function () {
                window.location.href = '../login/login.html'
            });
    }
};
function bindArticle(id){
    loading = layer.load(2,{offset: 'auto'});
    $.ajax({
        url:url+ 'article/' + id,
        type:'get',
        datatype:'json',
        success:function(response)
        {
            if (response.code == 0) {
                form.val("articleInfo", {
                    "type": response.data.articleType,
                    "title": response.data.title,
                    "content": response.data.content
                });
                layedit.setContent(textcontent, response.data.content);
                layer.close(loading);
            }
        },                   
    }); 
}
function bindselect() {
    $.ajax({
        url:url+ 'article/types',
        type:'get',
        datatype:'json',
        success:function(response)
        {
            if (response.code == 0) {
                $('#selecttype').empty();
                $('#selecttype').append('<option>...</option>');
                for(var i=0;i<response.data.length;i++){
                    $('#selecttype').append('<option value=' + response.data[i].key + '>' + response.data[i].value+ '</option>');
                }
                layui.form.render("select");
            }
        },                   
    });
};