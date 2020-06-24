
var httpAddress='http://127.0.0.1:5000/';
var url=httpAddress+'api/';
function doBeforeSend(xhr)
{
    var token=localStorage.getItem('token');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token); 
    xhr.setRequestHeader('requestIp',returnCitySN["cip"]);  
    xhr.setRequestHeader('requestAddress',returnCitySN["cid"]); 
}
function doComplete(xhr)
{
    var resfrshToken=xhr.getResponseHeader('refreshToken');
    if (resfrshToken!=null) {
        localStorage.setItem("token",resfrshToken );
    } 
}
layui.use('layer',function(){
    var layer=layui.layer;
    $.ajaxSetup({
        cache:false,
        beforeSend: function (xhr) {
            doBeforeSend(xhr);
        },
        error:function(request){
            layer.msg('响应服务器失败', {
                icon: 7
            });
        },
        complete: function (xhr) {
            doComplete(xhr);
        }
    });
})
