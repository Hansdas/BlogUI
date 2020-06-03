﻿var loading, laytpl, form;
layui.config({
	base: '/style/js/'
}).use(['flow', 'form', 'laytpl', 'layedit','laydate'], function () {
	var layedit = layui.layedit, flow = layui.flow,laydate = layui.laydate;;
	form = layui.form;
    var ins1=laydate.render({
		elem: '#calendar'
		,position: 'static'
		  ,btns: ['now']
		  ,calendar: true
	  });
	flow.load({
		elem: '#time-axis' //流加载容器。
		,end:'没有更多了' 
		,isAuto:false
		, done: function (page, next) { //执行下一页的回调
			var lis = [];
			$.ajax({
				url: url + 'whisper/page',
				type: 'get',
				datatype: 'json',
				data: {
					'pageIndex': page,
					'pageSize': 3,
				},
				success: function (res) {
					layui.each(res.data, function(index, item){
						lis.push('<li class="layui-timeline-item">');
						lis.push('<i class="layui-icon layui-timeline-axis">&#xe63f;</i>');
						lis.push('<div class="layui-timeline-content layui-text">');
						lis.push('<h3 class="layui-timeline-title">'+item.createDate+'</h3>');
						lis.push('<div class="section">');
						lis.push('<p>');
						lis.push(item.content);
						lis.push('</p>');
						lis.push('<div class="author">');
						lis.push('<a target="_blank" href=""><i class="layui-icon layui-icon-username"></i>'+item.accountName+'</a>');
						lis.push('</div>');
						lis.push('</div>');
						lis.push('</div>');
						lis.push('</li>');
					  });
					next(lis.join(''), (page*3) < res.total);
				}

			});
		}
	});
})
function loadWhisper(pageIndex, pageSize, whisper) {
	$.ajax({
		url: url + 'whisper/page',
		type: 'get',
		datatype: 'json',
		data: {
			'pageIndex': pageIndex,
			'pageSize': pageSize,
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
	});
}
