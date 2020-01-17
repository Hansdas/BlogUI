
layui.use(["form"], function () {
	var form = layui.form;
	var layer = layui.layer;
	form.on("submit(login)", function (data) {
		var loading = layer.load(2)
		var loginData = data.field;
		$.ajax({
			url: url + 'login/login',
			type: 'post',
			dataType: 'json',
			data: {
				"Account": loginData.Account,
				"Password": loginData.Password
			},
			success: function (response) {
				if (response.code == "0") {
					localStorage.setItem("token", response.data);
					window.location.href = "../home/index.html";
			
				}
				else {
					layer.close(loading)
					layer.msg(response.message, { icon: 5 });
				}
			},
		});
		return false;
	})
})

function loginOut()
{
	var token=localStorage.getItem('token');
	$.ajax({
		url: url + 'login/loginout',
		type: 'post',
		data:{
			'token':token
		},
		dataType: 'json',
	});
	localStorage.removeItem('token');
	window.location.href = '../login/login.html';
}