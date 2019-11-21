var loading ,laytpl,form,menu;
layui.config({
	base: '/style/js/'
}).use(['element', 'laypage', 'form', 'menu', 'laytpl'], function () {
	var element = layui.element, laypage = layui.laypage;
	loading=layer.load(2);
	laytpl = layui.laytpl;
	form = layui.form;
	menu = layui.menu;
	element.init();
	var whisper = document.getElementById("whisper-item").innerHTML;
	var total = loadtotal();
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
})
function loadtotal() {
	var total = 0;
	var total = requestajax({
        route: "Whisper/LoadTotal",
        type: 'get',
        datatype: 'text'
    });
	return total;
}
function loadWhisper(pageIndex, pageSize, whisper) {
	var response = requestajax({
        route: 'Whisper/LoadWhisper',
        type: 'get',
        datatype: 'json',
        data: {
            'pageIndex': pageIndex,
            'pageSize': pageSize,
        }
    });
    if (response != undefined) {
		var data = { "list": response.data };
		whisperview = document.getElementById("whisper-list-id");
		laytpl(whisper).render(data, function (html) {
			whisperview.innerHTML = html;
		});
		form.render();
		menu.init();
		menu.off();
		menu.submit();
		layer.close(loading)
    } else {
		layer.close(loading)
		layer.msg("响应服务器失败", { icon: 7 });
    }
}
