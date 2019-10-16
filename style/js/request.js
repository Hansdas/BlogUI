
function requestajax(args) {
    var options={
        route:args.route,
        type:args.type||'get',
        datatype:args.datatype||'json',
        data:args.data||'',
        async:args.async|| false,
        func:args.func||undefined,
        beforeSend:args.beforefunc||undefined
    };
    var result=undefined;
    $.ajax({
        url: 'http://127.0.0.1:5000/blogh/' + options.route,
        data:options.data,
        type: options.type,
        datatype: options.datatype,
        async: options.async,
        beforeSend: function (xhr) {
            if(options.beforeSend!==undefined)
            {
                options.beforeSend(xhr);
            }
        },
        success: function (response) {
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
        }
    });
    return result;
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