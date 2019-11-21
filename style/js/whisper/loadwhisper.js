var loading ,laytpl,form,menu;
$(function(){
	loading = new SpinLoading('loading');  
	$('.layui-textarea').bind('click',function(){
		window.open('../whisper/addwhisper');
	});   
});
layui.config({
	base: '/style/js/'
}).use(['element', 'laypage', 'form', 'menu', 'laytpl'], function () {
	var element = layui.element, laypage = layui.laypage;
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
	loading.close();
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
    } else {
		layer.msg("响应服务器失败", { icon: 7 });
    }
}
