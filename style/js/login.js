var loading;
layui.use(["form"], function () {
	var form = layui.form;
	var layer = layui.layer;
	form.on("submit(login)", function (data) {
		loading = layer.load(2)
		var loginData = data.field;
		var response = requestajax({
			route: 'login/login',
			type: 'post',
			datatype: 'json',
			data: {
				"Account": loginData.Account,
				"Password": loginData.Password
			},
			async: true,
			func:login
		});
		return false;
	})
})
function login(response) {
	if (response.code == "200") {
		localStorage.setItem("token", response.data);
		window.location.href = "../home/index";

	}
	else {
		layer.close(loading)
		layer.msg(response.message, { icon: 5 });
	}
}