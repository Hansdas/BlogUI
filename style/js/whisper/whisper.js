var loading, laytpl, form;
layui.config({
	base: '/style/js/'
}).use(['flow', 'form', 'laytpl', 'layedit'], function () {
	var layedit = layui.layedit, flow = layui.flow;
	form = layui.form;
	var textcontent = layedit.build('L_content', {
		height: 140 //设置编辑器高度\
		, tool: [
			, 'underline' //下划线
			, 'del' //删除线			
			, '|' //分割线			
			, 'left' //左对齐
			, 'center' //居中对齐
			, 'right' //右对齐
			, 'link' //超链接
			, 'unlink' //清除链接
			, 'face' //表情
		]
	});
	form.verify({
		content: function () {
			var content = layedit.getContent(textcontent);
			if (content == "") {
				return '请填写内容';
			}
		}
	});
	form.on('submit(save)', function (data) {
		$.ajax({
			url: url + 'whisper/publish',
			type: 'post',
			datatype: 'json',
			data: {
				'content': layedit.getContent(textcontent)
			},
			beforeSend: function (xhr) {
				doBeforeSend(xhr);
			},
			success: function (response) {
				if (response.code == "0") {
					layer.msg("保存成功", { icon: 6 });
				}
				else {
					layer.msg("响应服务器失败", { icon: 7 });
				}
			},
			complete: function (xhr) {
				doComplete(xhr);
			},
		});
		return false;
	});
	flow.load({
		elem: '#time-axis' //流加载容器。
		,end:'没有更多了' 
		,isAuto:false
		, done: function (page, next) { //执行下一页的回调
			var lis = [];
			$.ajax({
				url: url + 'whisper/loadWhisper',
				type: 'get',
				datatype: 'json',
				data: {
					'pageIndex': page,
					'pageSize': 3,
				},
				beforeSend: function (xhr) {
					doBeforeSend(xhr);
				},
				success: function (res) {
					layui.each(res.data.lis, function(index, item){
						lis.push('<li class="layui-timeline-item">');
						lis.push('<i class="layui-icon layui-timeline-axis">&#xe63f;</i>');
						lis.push('<div class="layui-timeline-content layui-text">');
						lis.push('<h3 class="layui-timeline-title">'+item.date+'</h3>');
						lis.push('<p>');
						lis.push(item.content);
						lis.push('</p>');
						lis.push('</div>');
						lis.push('</li>');
					  });
					  next(lis.join(''), (page*3) < res.data.count);
				},
				complete: function (xhr) {
					doComplete(xhr);
				},

			});
		}
	});
})
function loadWhisper(pageIndex, pageSize, whisper) {
	$.ajax({
		url: url + 'whisper/loadWhisper',
		type: 'get',
		datatype: 'json',
		data: {
			'pageIndex': pageIndex,
			'pageSize': pageSize,
		},
		beforeSend: function (xhr) {
			doBeforeSend(xhr);
		},
		success: function (response) {
			if (response.code == "0") {
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
			else {
				layer.msg("响应服务器失败", { icon: 7 });
			}
		},
		complete: function (xhr) {
			doComplete(xhr);
		},
	});
}
