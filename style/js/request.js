var url='http://127.0.0.1:5000/api/';
function requestajax(args) {
    var options={
        route:args.route,
        type:args.type||'get',
        datatype:args.datatype||'json',
        data:args.data||'',
        async:args.async|| false,
        func:args.func||undefined,
    };
    var result=undefined;
    $.ajax({
        url:url + options.route,
        data:options.data,
        type: options.type,
        datatype: options.datatype,
        async: options.async,
        beforeSend: function (xhr) {
            var token=localStorage.getItem('token');
             xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (response) {
            if (response.code == "200") {
                localStorage.setItem("token", response.data);
            }
            if(options.func==undefined)
            {
                result=response;
            }
            else
            {
                options.func(response);
            }           
        },
        error:function(response){
            if(options.func==undefined)
            {
                result=undefined;
            }
            else
            {
                options.func();
            }           
        },
    });
    return result;
}