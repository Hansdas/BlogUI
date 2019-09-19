function requestajax(route, methodtype, {datatype='json', async='false',func=''}) {
    var result=undefined;
    $.ajax({
        url: 'https://127.0.0.1:5001/blogh/' + route,
        type: methodtype,
        datatype: datatype,
        async: async,
        success: function (response) {
            if(func=='')
            {
                result=response;
            }
            else
            {
                func(response);
            }           
        },
        error: function (response) {
            result=response
        }
    });
    return result;
}
function invoke(func)
{

}
function upload(route, methodtype, datatype, async) {
    var result;
    $.ajax({
        url: 'https://127.0.0.1:5001/blogh/' + route,
        type: methodtype,
        datatype: datatype,
        async: async,
        success: function (response) {
            result=response
        },
        error: function (response) {
            result=response
        }
    });
    return result;
}