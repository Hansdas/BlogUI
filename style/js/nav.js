function initLoad() {
	$("#user").hide();
	$("#nologin").hide();
	//导航栏点击变色
	$(".nav a").click(function () {
		//var index = layer.load(2)
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
}
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
