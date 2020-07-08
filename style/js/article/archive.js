layui.use(['flow', 'laytpl', 'laypage'], function () {
    flow = layui.flow, 
    laytpl = layui.laytpl,
    laypage = layui.laypage;
    var account = getSearchString('account');
    var articleType = getSearchString('type');
    loadUser(account);
    $.ajax({
        url: url + 'article/archive/'+account,
        type: 'get',
        datatype: 'json',
        success: function (res) {
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
    changeType(articleType);
    var typeName=getArticleTypeName(articleType)
    $('#tip-type-name').html(typeName);
})
function loadUser(account){
    $.ajax({
        url: url + 'user/'+account,
        type: 'get',
        datatype: 'json',
        success: function (res) {
            $('title').html(res.data.username+'的博客集');
        }
    });
}
function changeType(type){
    articleType=type;
    loadarticle(1, 10,type,true); 
}
function loadarticle(pageIndex, pageSize,type,initPage) {
    initLoading("pageLoading", 50);
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
            if (response.code == '0') {
                var data = {
                    'list': response.data
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
                        ,count: response.total
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