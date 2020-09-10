layui.use(['flow', 'laytpl', 'laypage'], function () {
    flow = layui.flow, 
    laytpl = layui.laytpl,
    laypage = layui.laypage;
    var account = getSearchString('account');
    var articleType = getSearchString('type');
    $.ajax({
        url: url + 'article/archive/'+account,
        type: 'get',
        datatype: 'json',
        success: function (res) {
            var data = {
                'list': res.data.fileModels
            };
            var script = document.getElementById('article-file-script').innerHTML;
            var fileHtml = document.getElementById('article-file');
            laytpl(script).render(data, function (html) {
                fileHtml.innerHTML = html;
            });
            $('title').html(res.data.userModel.username+'的博客集');
            $("#touxiang").attr("src",res.data.userModel.headPhoto);
        }
    });
    changeType(articleType);
    var typeName=getArticleTypeName(articleType)
    $('#tip-type-name').html(typeName);
})
function changeType(type){
    articleType=type;
    loadarticle(1, 10,type,true); 
}
function loadarticle(pageIndex, pageSize,type,initPage) {
    initLoading("pageLoading", 50,350);
    var conditionModel={
        'pageIndex': pageIndex,
        'pageSize': pageSize,
        'articleType': parseInt(type),
        'fullText':$('#fullText').val()
    }
    $.ajax({
        url: url + 'article/page',
        type: 'post',
        datatype: 'json',
        contentType:'application/json; charset=utf-8',
        data: JSON.stringify(conditionModel),
        success: function (response) {
            if (response.code == '200') {
                var data = {
                    'list': response.data.list
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
                        ,count: response.data.total
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
        }
    })
}