/**
 * 获取url参数
 * @param  key 
 */
function getSearchString(key) {
	var urlParamater = window.location.search;
	urlParamater = urlParamater.substring(1, urlParamater.length); // 获取URL中?之后的字符（去掉第一位的问号）
	// 以&分隔字符串，获得类似name=xiaoli这样的元素数组
	var arr = urlParamater.split("&");
	var obj = new Object();

	// 将每一个数组元素以=分隔并赋给obj对象 
	for (var i = 0; i < arr.length; i++) {
		var tmp_arr = arr[i].split("=");
		obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
	}
	return obj[key];
}
/**
 * iframe自适应高度
 */
function setIframeHeight(iframeId) {
	$('#'+iframeId).each(function (index) {
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

function initLoading(htmlId, top, left) {
	var loading = '<img class="loading" style="height: 72px;width: 123px;margin-top:' + top + 'px;margin-left: ' + left + 'px;" src="/style/images/laoding.jpg" >'
	$('#' + htmlId).append(loading)
}

function closeLoading(htmlId) {
	$('#' + htmlId + ' .loading').hide()
}

function getArticleTypeName(type) {
	if (type == 1)
		return '散文礼记'
	else if (type == 2)
		return "韶华追忆"
	else if (type == 3)
		return "编程世界"
	else if (type == 4)
		return "娱乐竞技"
	else if (type == 5)
		return "趣味百态"
}