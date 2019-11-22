var loading, laytpl, form, menu;
$(function () {
	loading = new SpinLoading('loading');
});
layui.config({
	base: '/style/js/'
}).use(['element', 'laypage', 'form', 'menu', 'laytpl', 'layedit'], function () {
	var element = layui.element, laypage = layui.laypage, layedit = layui.layedit;
	laytpl = layui.laytpl;
	form = layui.form;
	menu = layui.menu;
    element.init();
	var whisper = document.getElementById("whisper-item").innerHTML;
	var total = loadtotal();
	var textcontent = layedit.build('L_content', {
		height: 70 //设置编辑器高度\
		, tool: ['face', 'link', 'unlink']
	});
	form.verify({
        content:function () {
            var content=layedit.getContent(textcontent);
            if (content=="") {
                return '请填写内容';
            }
        }
    });
	form.on('submit(save)', function (data) {
		var response = requestajax({
			route: 'whisper/publish',
			type: 'post',
			data: {
				'content': layedit.getContent(textcontent)
			},
			datatype: 'json',
			async: false,
		});
		if (response.code == 200) {
			loadWhisper(1, 10, whisper);		
		} 
		else {
			layer.msg(response.message, { icon: 7,time:6000000 });
		}
		return false;
	});
	laypage.render({		
		elem: 'page'
		, count: total
		, layout: ['count', 'prev', 'page', 'next', 'refresh', 'skip']
		, jump: function (obj) {
			var pageSize = obj.limit;
			var pageIndex = obj.curr;
			loadWhisper(pageIndex, pageSize, whisper);

		}
	});
	loading.close();
})
function loadtotal() {
	var total = 0;
	var total = requestajax({
		route: "whisper/loadTotal",
		type: 'get',
		datatype: 'text'
	});
	return total;
}
function loadWhisper(pageIndex, pageSize, whisper) {
	var response = requestajax({
		route: 'whisper/loadWhisper',
		type: 'get',
		datatype: 'json',
		data: {
			'pageIndex': pageIndex,
			'pageSize': pageSize,
		}
	});
	if (response != undefined) {
		if (response.code=="200") {
			var data = { "list": response.data };
			whisperview = document.getElementById("whisper-list-id");
			laytpl(whisper).render(data, function (html) {
				whisperview.innerHTML = html;
			});
			form.render();
			menu.init();
			menu.off();
			menu.submit();	
		}

	} else {
		layer.msg("响应服务器失败", { icon: 7 });
	}
}
