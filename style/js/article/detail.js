var layertip;
layui.config({
    base: '/style/js/'
}).use(['element', 'jquery', 'layer', 'menu', 'laytpl'], function () {
    element = layui.element, $ = layui.$, menu = layui.menu, laytpl = layui.laytpl, layer = layui.layer;
    layertip = layer.load(2);
    menu.init();
    var id = getSearchString('id');
    var type=getSearchString('t');
    loadarticle(id, layer);
    loadupnext(id,type);
});
function binddetail(response) {
    if (response.code == '200') {
        var data = {
            'title': response.data.title,
            'createtime': response.data.createTime,
            'articletype': response.data.articleType,
            'content': response.data.content,
            'author':response.data.author
        };

        $('title').html(data.title);
        var article = document.getElementById('buildview').innerHTML;
        articleview = document.getElementById('detail');
        laytpl(article).render(data, function (html) {
            articleview.innerHTML = html;
        });
        layer.close(layertip);
        
        if (response.data.isDraft='是') {
            $(".comment").hide();           
        }
        else
        {
            $(".comment").show();      
        }
    }
    else {
        layer.msg('响应服务器失败', { icon: 7 });
    }
};
function bindbtn(response)
{
    if (response.code == '200') {
        var type=getSearchString('t');
        $('.btn-box').empty();
        if(response.data.beforeId>0)
        {
            $('.btn-box').append('<a href="detail?id='+response.data.beforeId+'&t='+type+'" target="_parent" class="layui-btn layui-btn-primary">上一篇：'+response.data.beforeTitle+'</a>')
            $('.btn-box').append('</br>');
        }
        if(response.data.nextId>0)
        {
            $('.btn-box').append('<a href="detail?id='+response.data.nextId+'&t='+type+'" target="_parent" class="layui-btn layui-btn-primary">下一篇：'+response.data.nextTitle+'</a>') 
        }
    }
}
function loadarticle(id,layer) {
    requestajax({
        route:'article/detail/' + id,              
        async:true,
        func:binddetail
    })
};
function loadupnext(id,type){
    requestajax({
        route:'article/nextup/' + id+'/'+type,              
        async:true,
        func:bindbtn
    })
};