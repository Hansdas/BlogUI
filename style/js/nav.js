function initLoad() {
	$("#user").hide();
	$("#nologin").hide();
	//导航栏点击变色
	$(".nav a").click(function () {
		$(".nav a").each(function () {
			$(this).removeClass("active");
		});
		var thisItem = $(this)[0];
		if (thisItem.innerText == "微语") {
			$("#console").attr("src", "../whisper/index.html?v=1");
		}
		else if (thisItem.innerText == "文章") {
			$("#console").attr("src", "../article/index.html?v=1");
		}
		else if (thisItem.innerText == "广场") {
			$("#console").attr("src", "../home/square.html");
		}
		else if (thisItem.innerText == "关于") {
			$("#console").attr("src", "../home/about.html");
		}
		$(this).addClass("active");
	});
	setIframeHeight();
	showPage();
}
//iframe自适应内容高度
function setIframeHeight() {
	$("#console").each(function (index) {
		var that = $(this);
		(function () {
			setInterval(function () {
				//setIframeHeight(that[0]);
				if (that[0]) {
					var iframeWin = that[0].contentWindow || that[0].contentDocument.parentWindow;
					if (iframeWin.document.body) {
						that[0].height = iframeWin.document.body.scrollHeight;
					}
				}
			}, 300);
		})(that);
	});
};

function showPage() {
	var urlParamater = window.location.search;
	if (urlParamater == "")
		return;
	var page = getSearchString("pagepath", urlParamater);
	$("#console").attr("src", "../" + page + "/index.html");
	$(".nav a").each(function (index) {
		var thisItem = $(this)[0];
		if (thisItem.innerText == "文章"&&page=='article') {
			$(this).addClass("active");
		} else {
			$(this).removeClass("active");
		}

	});
};
