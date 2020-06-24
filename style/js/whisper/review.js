layui.use(['flow', 'laytpl', 'layer'], function () {
	layedit = layui.layedit,
		flow = layui.flow,
		laytpl = layui.laytpl,
		layer = layui.layer;
	checkLogin();
	loadComment();
})

function loadComment() {
	var id = getSearchString('id');
	$.ajax({
		url: url + 'whisper/' + id + '/comments',
		type: 'get',
		datatype: 'json',
		success: function (response) {
			if (response.code == "0") {
				var data = {
					"list": response.data
				};
				var script = document.getElementById('commentScript').innerHTML;
				var listHtml = document.getElementById('commentHtml');
				laytpl(script).render(data, function (html) {
					listHtml.innerHTML = html;
				});
			} else {
				layer.msg("响应服务器失败", {
					icon: 7
				});
			}
		},
	});
}

function checkLogin() {
	var token = localStorage.getItem('token');
	if (token == null) {
		$(".layui-btn-sm").text('未登录');
		$(".layui-btn-sm").addClass("notclick"); //设为不可点击
	}
}
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
	var revicer=getSearchString('revicer');
    var loading = layer.load(2);
	$.ajax({
		url: url + 'whisper/comment/add',
		type: 'post',
		datatype: 'json',
		data: {
			'content': $('#comment').val(),
			'whisperId': id,
			'revicer': revicer,
			'replyId': '',
			'commentType': 2
		},
		success: function (response) {
			if(response.code==0){
				layer.close(loading);
				layer.msg('留言审核中', {
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
        });
        return false;
    }
    var id = getSearchString('id');
    var loading = layer.load(2);
    $.ajax({
		url: url + 'whisper/comment/add',
		type: 'post',
		datatype: 'json',
		data: {
			'content': content,
			'whisperId': id,
			'revicer': toUser,
			'replyId': commentId,
			'commentType': 3
		},
		success: function (response) {
			if(response.code==0){
				layer.close(loading);
				layer.msg('留言审核中', {
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
