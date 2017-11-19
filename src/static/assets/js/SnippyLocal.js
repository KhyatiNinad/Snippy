var currentId = '0';
var isNew = 0;
var isDataFetched = false;

$(document).ready(function () {

    
    $('#sidebarCollapse').on('click', function () {
        $('#main-panel').toggleClass('active');
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/eclipse");
        editor.getSession().setMode("ace/mode/java");

        $("#tags").tagit({
        });

        $("#btnMySnippets").click(function () {
            ViewMySnippets();
        });

        var options = {
            hashTracking: false,
            closeOnConfirm: false,
            show: false
        };
        $('#newSnippet').modal(options);
        $("#deleteSnippet").modal(options);
        $("#importSnippet").modal(options);
        $("#errorModal").modal(options);
        //$("#errorModal").modal('show');
        $("#errorModal").modal('hide');

        $("#errorModal").hide();
        $("#errorModal").show();
    //$("#errorDiv").show();
        setTimeout(function () {
            $("#errorModal").hide();
            $("#errorDiv").show();

        }, 1000);
        $(document).on('click', '#contributeSave', function (e) {
            var tags = $("#tags").tagit("assignedTags");
            var editor = ace.edit("editor");
            var text = editor.getValue();
            var title = $("#title").val();
            if (title.length == 0) {
                $("#newError").text("Error: Please enter Snippet Title to Proceed");
                return false;
            }
            if (text.length == 0) {
                $("#newError").text("Error: Please enter Your Code Snippet to Proceed");
                return false;
            }
            if (text.replace(/ /g, '').length == 0) {
                $("#newError").text("Error: Please enter Your Code Snippet to Proceed");
                return false;
            }
            if (tags == null) {
                $("#newError").text("Error: Please enter Tags to Proceed");
                return false;
            }
            if (tags.length == 0) {
                $("#newError").text("Error: Please enter Tags to Proceed");
                return false;
            }

            if (isNew == 0) {
                SaveItem(title, text, tags);
            }
            else {
                UpdateItem(title, text, tags);
            }
            var inst = $('#newSnippet').modal('hide');
        });

        $("#btnContribute").click(function () {
            isNew = 0;
            $("#newheader").text("Add New Snippet");
            $("#newError").html("&nbsp;");
            $("#title").val("");
            $("#tags").tagit("removeAll");
            var editor = ace.edit("editor");
            var text = editor.setValue("");

            setUpInput($('#newSnippet'));
            var inst = $('#newSnippet').modal('show');
        });

        $("#search_button").click(function () {
            startSearch();

        });

        $('#search_text').keydown(function (event) {
            if (event.keyCode == 13) {
                startSearch();
                return false;
            }
        });
        var data = getAllData();
        var importData = false;
        if (data == null)
            importData = true;
        else if (data.length == 0)
            importData = true;
    /*
        if (importData) {
            var inst = $('#importSnippet').modal('show');
        }
        */
    });

function setNavBarValues(id, text)
{
    $("#pageTitle").text($("p", $(id)).text());
    $("li", $(".nav")).removeClass("active");
    $(id).addClass("active");

    $("#errorMessage").text("");
    $("#background").hide();
    $("#list").html(text);
    $("#loading").show();

}
function ViewSearchSnippets()
{
    setNavBarValues("#navSearchSnippets", "Use The Search Bar Above To Search Snippets");
    $("#loading").hide();

}
function ViewDashboard() {
    setNavBarValues("#navDashboard", "");
}

function ViewMySnippets() {
    setNavBarValues("#navMySnippets", "");
    var searchTerm = currentUserId;
        if (searchTerm.length > 0) {
            var data = getAllData();
            var results = filterResults('//*[userId="' + searchTerm + '"]', data);
            if (results.length > 0) {
                displayResults(results, "#myTemplate");
            }
            else {
                setNavBarValues("#navMySnippets", "No Snippets Found Contributed By You. Start Contributing!");
                $("#errorMessage").text("No Snippets Found Contributed By You. Start Contributing!");
                $("#background").show();
                $("#errorModal").modal('show');
            }
        }
        else {
            $("#errorMessage").text("Please Enter a Search Term");
            $("#background").show();
            $("#errorModal").modal('show');
        }
        $("#loading").hide();

    }

function startSearch() {
    ViewSearchSnippets();
        var searchTerm = $("#search_text").val();
        $("#list").html("");

        if (searchTerm.length > 0) {
            var data = getAllData();


            var results = filterResults('//*[contains(title, "' + searchTerm + '")]|//*[contains(tags, "' + searchTerm + '")]', data);
            if (results.length > 0) {
                displayResults(results, "#codeTemplate");
            }
            else {
                setNavBarValues("#navSearchSnippets", "No Results Found");
                $("#errorMessage").text("No Results Found");
                $("#background").show();
                $("#errorModal").modal('show');
            }
        }
        else {
            $("#errorMessage").text("Please Enter a Search Term");
            $("#background").show();
            $("#errorModal").modal('show');
        }
        $("#loading").hide();

    }

    function filterResults(term, data) {
        var reds = JSON.search(data, term);
        return reds;
    }

    function getAllData() {
        var array = Array();
        if (isDataFetched) {
        }
        else
        {
            $("#loading").show();
            for (i = 0; i <= localStorage.length - 1; i++) {
                key = localStorage.key(i);
                localStorage.removeItem(key);
            }
            debugger;
            $.ajax({
                url: "/getAllData",
                type: "GET",
                dataType: "json",
                cache: false,
                timeout: 15500,
                complete: function () {
                    //called when complete
                },

                success: function (data) {
                    debugger;
                    try {
                        var result = (data);
                        for (var i = 0 ; i < result.length ; i++) {
                            SaveItemToDB(result[i].title, result[i].text, result[i].tags,
                                result[i].user
                                , result[i].date, result[i].id, result[i].userId, false);
                        }
                        isDataFetched = true;
                    }
                    catch (e) {
                        $("#errorMessage").text("Error in Fetching Data");
                        $("#errorModal").modal('show');
                    }
                    $("#loading").hide();
                },

                error: function (e) {
                    $("#errorMessage").text("Error in Fetching Data");
                    $("#errorModal").modal('show');

                    $("#loading").hide();
                }
            });


        }
        var key = "";
        var i = 0;

        for (i = 0; i <= localStorage.length - 1; i++) {
            key = localStorage.key(i);
            array.push(JSON.parse(localStorage.getItem(key)));
        }

        return array;
    }

    function displayResults(array, codeTemplate) {
        $("#list").hide();
        $("#list").html(
          $(codeTemplate).render(array)
        ); //document.getElementById('list').innerHTML = list;

        $("#list").accordion({
            firstChildExpand: true,
            //whether expanding mulitple section is allowed or not
            multiExpand: true,
            //slide animation speed
            slideSpeed: 500,
            //drop down icon
            dropDownIcon: "&#9660",
        });

        $(".tags", $("#list")).each(function (i, v) {
            $(this).tagit({
                readOnly: true
            });
        });

        $(".editor", $("#list")).each(function (i, v) {
            var id = $(this).attr("id");
            var editor = ace.edit(id);
            editor.setReadOnly(true);
            editor.setTheme("ace/theme/eclipse");
            editor.getSession().setMode("ace/mode/java");

        });


        var clipboard = new Clipboard('.clipboardbtn', {
            text: function (trigger) {
                var btn = $(trigger);
                var parent = btn.parent().parent();
                var id = btn.attr("data-id");
                var editor = ace.edit("editor" + id);
                var text = "";
                var selected = editor.getCopyText();
                if (selected.length > 0)
                    text = selected;
                else
                    text = editor.getValue();

                return text;
            }
        });

        clipboard.on('success', function (e) {
            var trigger = e.trigger;
            var btn = $(trigger);
            var parent = btn.parent().parent();
            var t = $(".message", parent);
            t.text("");

            t.addClass('copied');
            setTimeout(function () { t.removeClass('copied'); }, 1500);

        });

        clipboard.on('error', function (e) {
            var trigger = e.trigger;
            var btn = $(trigger);
            var parent = btn.parent().parent();
            var t = $(".message", parent);
            t.text("");

            t.addClass('errorcopied');
            setTimeout(function () { t.removeClass('errorcopied'); }, 1500);
        });


        $("#list").show();

    }

    function AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    function DeleteSnippetId(id) {
        currentId = id;
        var inst = $('#deleteSnippet').modal('show');

    }


    function EditSnippetId(id, e) {
        var item = $(e);
        isNew = 1;
        currentId = id;

        var parent = item.parent().parent();

        $("#newError").html("&nbsp;");
        $("#title").val($("#title" + id, parent).val());
        $("#newheader").text("Edit Snippet");

        $("#tags").tagit("removeAll");

        var tags = $("#tags" + id, parent).tagit("assignedTags");

        for (var i = 0 ; i < tags.length ; i++) {
            $("#tags").tagit("createTag", tags[i]);
        }

        var editor = ace.edit("editor");
        var oldEdit = ace.edit("editor" + id);
        var text = editor.setValue(oldEdit.getValue());

        var inst = $('#newSnippet').modal('show');

    }


    function DeleteSnippet(id) {
        $("#loading").show();
        localStorage.removeItem(currentId);
        ViewMySnippets();
        var inst = $('#deleteSnippet').modal('hide');
        $("#loading").hide();

    }




    function SaveItem(title, text, tags) {
        var userName = removeSpaces(currentUser);
        var now = new Date();
        var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
        var uid = (new Date().getTime()).toString(36);
        var id = userName + uid;

        SaveItemToDB(title, text, tags.join(','), userName, strDateTime, id, currentUserId, true);


    }

    function SaveItemToDB(title, text, tags, userName, strDateTime, id, cId, toServer) {
        var data = {
            id: id,
            title: title,
            text: text,
            tags: tags,
            user: userName,
            userId: cId,
            date: strDateTime
        };
        localStorage.setItem(id, JSON.stringify(data));

        if(toServer)
        {
            PostAjaxDataToApp("/saveSnippet", data, function (e)
            {
                $("#list").html("");
                $("#errorMessage").text("Code Snippet Saved Successfully");
                $("#background").show();
                $("#loading").hide();
                $("#errorModal").modal('show');

            },
            function (e) {
                $("#list").html("");
                $("#errorMessage").text("Error in Saving Snippet to Server. Please try again later.");
                $("#background").show();
                $("#loading").hide();
                $("#errorModal").modal('show');

            });
        }
    }



    function UpdateItem(title, text, tags) {
        var userName = removeSpaces(currentUser);

        var now = new Date();
        var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");

        var data = {
            id: currentId,
            title: title,
            text: text,
            tags: tags.join(','),
            user: userName,
            userId: currentUserId,
            date: strDateTime
        };
        localStorage.setItem(currentId, JSON.stringify(data));
        PostAjaxDataToApp("/saveSnippet", data, function (e) {
            ViewMySnippets();
            //getAllData();
            $("#errorMessage").text("Code Snippet Updated Successfully");
            $("#loading").hide();
            $("#errorModal").modal('show');

        },
function (e) {
    $("#errorMessage").text("Error in Saving Snippet to Server. Please try again later.");
    $("#loading").hide();
    $("#errorModal").modal('show');

});


    }


    function ImportSnippet() {
        $("#loading").show();
        var inst = $('#importSnippet').modal('hide');
        $("#errorMessage").text("");
        $.ajax({
            url: "/import.csv",
            type: "GET",
            dataType: "text",
            cache: false,
            timeout: 15500,
            complete: function () {
                //called when complete
            },

            success: function (data) {
                debugger;
                try {
                    var result = $.csv.toObjects(data);
                    for (var i = 0 ; i < result.length ; i++) {
                        SaveItemToDB(result[i].title, result[i].text, result[i].tags,
                            result[i].user
                            , result[i].date, result[i].id, result[i].userId, true);
                    }
                    $("#errorMessage").text("Imported Successfully. Start using jSnippy!");
                    $("#errorModal").modal('show');
                }
                catch (e) {
                    $("#errorMessage").text("Error in Import! Never mind.. Start using jSnippy!");
                    $("#errorModal").modal('show');
                }
                $("#loading").hide();
            },

            error: function (e) {
                $("#errorMessage").text("Error in Import! Never mind.. Start using jSnippy!");
                $("#errorModal").modal('show');

                $("#loading").hide();
            }
        });
    }

    function setUpInput(x)
    {

        $(":input", x).bind("keyup change", function (e) {
            if ($(e.currentTarget).hasClass("form-control") ) {
                var label = $("label", $(e.currentTarget).parent().parent());
                if ($(e.currentTarget).val().length > 0) {
                    label.addClass("active");
                }
                else {
                    label.removeClass("active");

                }
            }
            if ( $(e.currentTarget).hasClass("ui-autocomplete-input")) {
                var label = $("label", $(e.currentTarget).parent().parent().parent().parent());

                var tags = $("#tags").tagit("assignedTags");

                if ($(e.currentTarget).val().length > 0 || tags.length > 0) {
                    label.addClass("active");
                }
                else {
                    label.removeClass("active");

                }
            }
        });

    }

    function PostAjaxDataToApp(url, inputData, successCallback, errorCallback) {
        $.ajax({
            url: url,
            type: "POST",
            data: inputData,
            datatype: "json",
            success: function (result) {
                if (successCallback)
                    successCallback(result);
            },
            error: function (e) {
                if (errorCallback)
                    errorCallback(e);
            }
        });
    }

    function removeSpaces(currentUser)
    {
        var str = currentUser.replace(/[^a-z0-9]/gi, '');
        alert(str);
        return str;
    }