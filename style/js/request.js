
var httpAddress='http://127.0.0.1:5000/';
var url=httpAddress+'api/';
function doBeforeSend(xhr)
{
    var token=localStorage.getItem('token');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);  
}
function doComplete(xhr)
{
    var resfrshToken=xhr.getResponseHeader('refreshToken');
    if (resfrshToken!=null) {
        localStorage.setItem("token",resfrshToken );
    } 
}