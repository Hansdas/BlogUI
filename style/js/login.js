﻿layui.use(["form"], function () {
	var form = layui.form;
	var layer = layui.layer;
	form.on("submit(login)", function (data) {
		var loginData = data.field;
		var index = layer.load(2)
		var response = requestajax({
			route: 'login/login',
			type: 'post',
			datatype: 'json',
			data: {
				"Account": loginData.Account,
				"Password": loginData.Password
			}
		});
		if (response.message == "OK") {
			window.location.href = "../home/index";

		}
		else {
			layer.close(index)
			layer.msg(response.message, { icon: 5 });
		}
		return false;
	})
})