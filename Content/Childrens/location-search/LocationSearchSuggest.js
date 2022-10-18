$(function () {
    var URL_PREFIX = "/Tools/LocationSearchSuggestTool.aspx?q=";
    $("#q").autocomplete({
        source: function (request, response) {
            var sQuery = $("#q").val();
            if (sQuery.length > 1) {
                sQuery = "'" + sQuery + "'";
            }

            var URL = URL_PREFIX + sQuery;
            $.ajax({
                url: URL,
                success: function (data) {
                    var keyword = sQuery;
                    var jsonData = JSON.parse(JSON.stringify(data.suggest.ChildrensLocationSuggester));
                    jsonData = jsonData[keyword];
                    jsonData = jsonData['suggestions'];

                    var options = [];

                    for (var i = 0; i < jsonData.length; i++) {
                        var option = jsonData[i];
                        options.push(option['term']);
                    }
                    response($.map(options, function (value) {
                        return {
                            label: value
                        }
                    }));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert(textStatus);
                    alert(jqXHR);
                },
                dataType: 'json'
            });
        },
        minLength: 1
    })
});