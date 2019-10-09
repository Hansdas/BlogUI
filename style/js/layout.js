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
		if (response.code != '200') {
			$("#nologin").show();	
			$("#user").hide();
		} else {
			$("#nologin").hide();	
			$("#user").show();
		}
	}
	else
	{
		$("#nologin").show();	
			$("#user").hide();	
	}
}
