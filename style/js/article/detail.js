var allCommentList = null,loading;
layui.config({
    base: '/style/js/'
}).use(['element', 'jquery', 'layer', 'laytpl', 'form', 'laypage'], function () {
    element = layui.element, $ = layui.$,  laytpl = layui.laytpl, layer = layui.layer, laypage = layui.laypage;
    var form = form = layui.form;
    var commentScript = document.getElementById('buildComment').innerHTML;
    var id = getSearchString('id');  
    loadarticle(id, commentScript);
    loadupnext(id);
    loadAll(id);
    var token=localStorage.getItem('token'); 
    if (token==''||token==null) {
        $('.layui-input-block button').attr('disabled',true);  
        $('.layui-input-block button').text('未登录');
    }
});
/**
 * 初始化分页
 * @param {*} commentList 
 */
function setPageList(commentList, commentScript) {
    allCommentList = commentList;
    laypage.render({
        elem: 'page'
        , limit: 10
        , count: commentList.length
        ,first: false
        ,last: false
        , jump: function (obj) {
            var pageData = commentList.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
            loadComment(pageData, commentScript);
        }
    });
}
/**
 * 加载文章内容
 * @param {} id 
 */
function loadarticle(id, commentScript) {
    initLoading("detailLoading", 50,450);
    $.ajax({
        url: url + 'article/' + id,
        type: 'get',
        datatype: 'json',
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'title': response.data.title,
                    'createtime': response.data.createTime,
                    'articletype': response.data.articleType,
                    'content': response.data.content,
                    'author': response.data.author,
                    'authorAccount':response.data.authorAccount
                };
                revicer=response.data.authorAccount;
                $('title').html(data.title);
                $('#authorName').html(response.data.author);
                var article = document.getElementById('buildview').innerHTML;
                articleview = document.getElementById('detail');
                laytpl(article).render(data, function (html) {
                    articleview.innerHTML = html;
                });
                commentList = response.data.comments;
                $('.volume').html('全部评论（' + commentList.length + '）')
                setPageList(commentList, commentScript);
                if (response.data.isDraft == '是') {
                    $(".comment").hide();
                }
                var c = getSearchString('c');
                if (c=='c') {
                   $('#desc').focus(); 
                } 
                closeLoading("detailLoading");
            }
            else {
                layer.msg('响应服务器失败', { icon: 7 });
            }
        },

    });
}
/**
 * 加载评论
 * @param {*} comments 
 */
function loadComment(commentList, comments) {
    var commentData = {
        'list': commentList
    }
    commentsView = document.getElementById('comment-item');
    laytpl(comments).render(commentData, function (html) {
        commentsView.innerHTML = html;
    });
    $(".comment").show();
};

/**
 * 加载上一下下一页按钮
 * @param {} id 
 * @param {*} type 
 */
function loadupnext(id) {
    $.ajax({
        url: url + 'article/context/' + id,
        type: 'get',
        datatype: 'json',
        success: function (response) {
            if (response.code == '0') {
                var type = getSearchString('t');
                $('.btn-box').empty();
                if (response.data.beforeId > 0) {
                    $('.btn-box').append('<a href="detail?id=' + response.data.beforeId +'" target="_parent" class="layui-btn layui-btn-primary">上一篇：' + response.data.beforeTitle + '</a>')
                    $('.btn-box').append('</br>');
                }
                if (response.data.nextId > 0) {
                    $('.btn-box').append('<a href="detail?id=' + response.data.nextId +'" target="_parent" class="layui-btn layui-btn-primary">下一篇：' + response.data.nextTitle + '</a>')
                }
            }
            else {
                layer.msg('响应服务器失败', { icon: 7 });
            }
        },

    });
};
function loadAll(id) {
    initLoading("liLoading", 50);
    $.ajax({
        url: url + 'article/all/' + id ,
        type: 'get',
        datatype: 'json',
        success: function (response) {
            if (response.code == '0') {
                var data = {
                    'list': response.data
                };
                var script = document.getElementById('li-article-script').innerHTML;
                var itemhtml = document.getElementById('li-article');
                laytpl(script).render(data, function (html) {
                    itemhtml.innerHTML = html;
                });
                closeLoading("liLoading");
            }
            else {
                layer.msg('响应服务器失败', { icon: 7 });
            }
        },

    });
};
var revicer
function review() {
    var comment=$('#comment').val();
    if(comment==''){
        layer.msg("内容为空", {
            icon: 5,
            offset: ['280px', '540px']
        });
        return false;
    }
	var id = getSearchString('id');
    var loading = layer.load(2,{ offset: ['280px', '600px']});
	$.ajax({
		url: url + 'article/comment/add',
		type: 'post',
		datatype: 'json',
		data: {
			'content': $('#comment').val(),
			'articleId': id,
			'revicer': revicer,
			'replyId': "",
			'commentType': 1
		},
		success: function (response) {
			if(response.code==0){
				layer.close(loading);
				layer.msg('留言审核中', {
                    offset: ['280px', '540px'],
					icon: 6
				});
			}
		}
	})
}
function reviewTo(toUser, commentId,index) {
    var content=$('#txt_'+index+'_'+toUser).val();
    if(content==''){
        layer.msg("内容为空", {
            icon: 5,
            offset: ['280px', '540px']
        });
        return false;
    }
    var id = getSearchString('id');
    var loading = layer.load(2,{ offset: ['280px', '600px']});
    $.ajax({
		url: url + 'article/comment/add',
		type: 'post',
		datatype: 'json',
		data: {
			'content': content,
			'articleId': id,
			'revicer': toUser,
			'replyId': commentId,
			'commentType': 3
		},
		success: function (response) {
			if(response.code==0){
				layer.close(loading);
				layer.msg('留言审核中', {
                    offset: ['280px', '540px'],
					icon: 6
				});
			}
		}
	})
}
function openDv(index,toUser) {
    $('#'+index+'_'+toUser).show();
}
function cancle(index,toUser) {
    $('#'+index+'_'+toUser).hide();
}