
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
        url: 'http://127.0.0.1:5000/blogh/' + options.route,
        data:options.data,
        type: options.type,
        datatype: options.datatype,
        async: options.async,
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