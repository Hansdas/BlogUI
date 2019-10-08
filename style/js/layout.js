$(function () {
	requestajax({
		route: 'auth',
		type: 'get',
		datatype: 'json',
		async: true,
		func: load,
		beforefunc:beforesend
	});
	//导航栏点击变色
	$(".nav a").click(function () {
		$(".nav a").each(function () {
			$(this).removeClass("active");
		});
		var thisItem = $(this)[0];
		if (thisItem.innerText == "微语") {
			$("#console").attr("src", "../whisper/index");
		}
		if (thisItem.innerText == "文章") {
			$("#console").attr("src", "../article/index");
		}
		$(this).addClass("active");
		$(".header .btn").empty();
	});
	//iframe自适应内容高度
	$("#console").each(function (index) {
		var that = $(this);
		(function () {
			setInterval(function () {
				setIframeHeight(that[0]);
			}, 300);
		})(that);
	});
	showPage();
	//$(".layui-nav-item a").mouseover(function () {
	//	$(this).attr("style", "color:black !important");
	//});
});
function beforesend(xhr)
{
	if (localStorage.getItem("token") !== null) {
		alert( localStorage.getItem("token"));
		xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
	}
};
function setIframeHeight(iframe) {
	if (iframe) {
		var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
		if (iframeWin.document.body) {
			iframe.height = iframeWin.document.body.scrollHeight;
		}
	}
};

function showPage() {
	var urlParamater = window.location.search;
	if (urlParamater == "")
		return;
	var page = getSearchString("pagepath", urlParamater);
	$("#console").attr("src", "../" + page + "/Index");
	$(".nav a").each(function (index) {
		var thisItem = $(this)[0];
		if (thisItem.innerText == "微语") {
			$(this).addClass("active");
		} else {
			$(this).removeClass("active");
		}

	});
};

function load(response) {
	if (response != undefined) {
		if (response.message != '200') {
			$('#top').append('<div style="opacity: 0.5;font-size:15px;padding:18px;margin-right:-5px"><a href="../login/login"><i class="layui-icon layui-icon-username"></i>还未登录</a></div>');
		} else {
			$('#top').append('<li class="layui-nav-item"><a href="">控制台<span class="layui-badge">9</span></a></li>');
			$('#top').append('<li class="layui-nav-item"><a href="">个人中心<span class="layui-badge-dot"></span></a></li>');
			$('#top').append('<li class="layui-nav-item" lay-unselect="">' +
				'<a href="">' +
				'<img src="" class="layui-nav-img" />' + response.data.username + '' +
				'</a>' +
				'<dl class="layui-nav-child"><dd>' +
				'<a href="javascript:;">修改信息</a>' +
				'</dd>' +
				'<dd>' +
				'<a href="javascript:;">安全管理</a>' +
				'</dd>' +
				'<dd>' +
				'<a href="../Login/LoginOut">退了</a>' +
				'</dd>' +
				'</dl>' +
				'</li>');
		}
	}
	else
	{
		$('#top').append('<div style="opacity: 0.5;font-size:15px;padding:18px;margin-right:-5px"><a href="../login/login"><i class="layui-icon layui-icon-username"></i>还未登录</a></div>');	
	}
}
