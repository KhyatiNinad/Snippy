var currentId = '0';
var isNew = 0;
var currentUser = 'System';
(function ($, undefined) {
    $("html").addClass("ink-btn");

    var sqrt2 = Math.sqrt(2);

    function hypot(x, y) {
        return Math.sqrt((x * x) + (y * y));
    }
    $("button:not('.mod')").each(function (el) {
        var self = $(this),
          html = self.html();

        self.html("").append($('<div class="btn"/>').html(html));
    })
      .append($('<div class="ink-visual-container"/>').append($('<div class="ink-visual-static"/>')))

    .on("select", function (evt) {
        event.preventDefault();
        return false;
    })
      .on("mousedown touchstart", function (evt) {
          event.preventDefault();

          var self = $(this),
            container = self.find(".ink-visual-static", true).eq(0);

          if (!container.length) return;

          container.find(".ink-visual").addClass("hide");

          var rect = this.getBoundingClientRect(),
            cRect = container[0].getBoundingClientRect(),
            cx, cy, radius, diam;

          if (event.changedTouches) {
              cx = event.changedTouches[0].clientX;
              cy = event.changedTouches[0].clientY;
          } else {
              cx = event.clientX;
              cy = event.clientY;
          }

          if (self.is(".float")) {
              var rx = rect.width / 2,
                ry = rect.height / 2,
                br = (rx + ry) / 2,
                mx = rect.left + rx,
                my = rect.top + ry;

              radius = hypot(cx - mx, cy - my) + br;
          } else {
              var w = Math.max(cx - rect.left, rect.right - cx),
                h = Math.max(cy - rect.top, rect.bottom - cy);

              radius = hypot(w, h);
          }
          diam = radius * 2;

          var el = $('<div class="ink-visual"/>').width(diam).height(diam)
            .css("left", cx - cRect.left - radius).css("top", cy - cRect.top - radius)

          .on("animationend webkitAnimationEnd oanimationend MSAnimationEnd", function () {
              var self2 = $(this);

              switch (event.animationName) {
                  case "ink-visual-show":
                      if (self.is(":active")) self2.addClass("shown");
                      break;

                  case "ink-visual-hide":
                      self2.remove();
                      break;
              }
          })

          .on("touchend", function () {
              event.preventDefault();
          });

          container.append(el);
      });

    $(window).on("mouseup touchend", function (evt) {
        $(".ink-visual-static").children(".ink-visual").addClass("hide");
    })
      .on("select selectstart", function (evt) {
          event.preventDefault();
          return false;
      });
}(jQuery))

$(document).ready(function () {
    VSS.init({
        usePlatformScripts: true,
        usePlatformStyles: false
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
        closeOnConfirm: false
    };
    $('#newSnippet').remodal(options);
    $("#deleteSnippet").remodal(options);
    $("#importSnippet").remodal(options);

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
        else
        {
            UpdateItem(title, text, tags);
        }
        var inst = $('#newSnippet').remodal();
        inst.close();
    });

    $("#btnContribute").click(function () {
        isNew = 0;
        $("#newheader").text("Add New Snippet");
        $("#newError").html("&nbsp;");
        $("#title").val("");
        $("#tags").tagit("removeAll");
        var editor = ace.edit("editor");
        var text = editor.setValue("");

        var inst = $('#newSnippet').remodal();
        inst.open();
    });

    $("#search_button").click(function () {
        startSearch();

    });

    $('#search_text').keydown(function(event) {
        if (event.keyCode == 13) {
            startSearch();
            return false;
        }
    });
    VSS.notifyLoadSucceeded();



    $("#loading").show();

    setTimeout(function () {
        try {
            var context = VSS.getWebContext();

            try {
                currentUser = context.user.name;
                currentUser = currentUser.replace(/^[^a-z]+|[^\w:.-]+/gi, "");
            }
            catch (e)
            { }
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                // Get all document under the collection
                try {
                    dataService.getDocuments("jSnippyStore").then(function (data) {
                        var importData = false;
                        if (data == null)
                            importData = true;
                        else if (data.length == 0)
                            importData = true;


                        $("#loading").hide();
                        if (importData) {
                            var inst = $('#importSnippet').remodal();
                            inst.open();
                        }

                    }, function (data) {
                        var importData = false;
                            importData = true;

                        $("#loading").hide();
                        if (importData) {
                            var inst = $('#importSnippet').remodal();
                            inst.open();
                        }

                    });
                }
                catch (e) {
                    $("#loading").hide();
                }

            });
        }
        catch (e) {
            $("#loading").hide();
        }
    }, 2000);



});

function ViewMySnippets()
{
    $("#errorMessage").text("");
    $("#background").hide();
    $("#list").html("");
    $("#loading").show();
    var searchTerm = currentUser;
    if (searchTerm.length > 0) {

        try {
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                // Get all document under the collection
                dataService.getDocuments("jSnippyStore").then(function (data) {
                    if (data != null) {
                        var results = filterResults('//*[user="' + searchTerm + '"]', data);
                        if (results.length > 0) {
                            displayResults(results, "#myTemplate");
                            $("#loading").hide();

                        }
                        else {
                            $("#errorMessage").text("No Snippets Found Contributed By You. Start Contributing!");
                            $("#background").show();
                            $("#loading").hide();

                        }
                    }
                    else
                    {
                        $("#errorMessage").text("No Snippets Found Contributed By You. Start Contributing!");
                        $("#background").show();
                        $("#loading").hide();
                    }

                }, function (e) {
                    $("#errorMessage").text("No Snippets Found Contributed By You. Start Contributing!");
                    $("#background").show();
                    $("#loading").hide();
                });
            });
        }
        catch (e)
        { }
    }
    else {
        $("#loading").hide();
        $("#errorMessage").text("Please Enter a Search Term");
        $("#background").show();
    }

}

function startSearch()
{
    $("#errorMessage").text("");
    $("#background").hide();
    $("#loading").show();
    var searchTerm = $("#search_text").val();
    $("#list").html("");

    if (searchTerm.length > 0) {

        try {
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                // Get all document under the collection
                try {
                    dataService.getDocuments("jSnippyStore").then(function (data) {
                        if (data != null) {
                            var results = filterResults('//*[contains(title, "' + searchTerm + '")]|//*[contains(tags, "' + searchTerm + '")]', data);
                            if (results.length > 0) {
                                displayResults(results, "#codeTemplate");
                                $("#loading").hide();
                            }
                            else {
                                $("#errorMessage").text("No Results Found");
                                $("#background").show();
                                $("#loading").hide();
                            }
                        }
                        else
                        {
                            $("#errorMessage").text("No Results Found");
                            $("#background").show();
                            $("#loading").hide();

                        }
                    }, function (e) {
                        $("#errorMessage").text("No Results Found");
                        $("#background").show();
                        $("#loading").hide();
                    });
                }
                catch(e)
                {
                    $("#errorMessage").text("Error in Fetching Snippets. Please try again later.");
                    $("#background").show();
                    $("#loading").hide();
                }
            });
        }
        catch (e)
        {
            $("#errorMessage").text("Error in Fetching Snippets. Please try again later.");
            $("#background").show();
            $("#loading").hide();
        }

    }
    else {
        $("#errorMessage").text("Please Enter a Search Term");
        $("#background").show();
        $("#loading").hide();
    }

}

function filterResults(term, data) {
    var reds = JSON.search(data, term);
    return reds;
}

function getAllData()
{

    var key = "";
    var i = 0;
    var array = Array();
    /*
    for (i = 0; i <= localStorage.length - 1; i++) {
        key = localStorage.key(i);
        array.push(JSON.parse(localStorage.getItem(key)));
    }
    */

    try {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            // Get all document under the collection
            dataService.getDocuments("jSnippyStore").then(function (docs) {
                return docs;
            });
        });
    }
    catch (e)
    { }

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
function DeleteSnippetId(id)
{
    currentId = id;
    var inst = $('#deleteSnippet').remodal();
    inst.open();

}


function EditSnippetId(id, e) {
    var item = $(e);
    isNew = 1;
    currentId = id;

    var parent = item.parent().parent();

    $("#newError").html("&nbsp;");
    $("#title").val($("#title"+ id, parent).val());
    $("#newheader").text("Edit Snippet");

    $("#tags").tagit("removeAll");

    var tags = $("#tags" + id, parent).tagit("assignedTags");

    for (var i = 0 ; i < tags.length ; i++)
    {
        $("#tags").tagit("createTag", tags[i]);
    }

    var editor = ace.edit("editor");
    var oldEdit = ace.edit("editor" + id);
    var text = editor.setValue(oldEdit.getValue());

    var inst = $('#newSnippet').remodal();
    inst.open();

}


function DeleteSnippet(id)
{
    $("#loading").show();
    //    localStorage.removeItem(currentId);
    try {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            // Delete document
            try {

                    dataService.deleteDocument("jSnippyStore", currentId).then(function () {
                        ViewMySnippets();
                        var inst = $('#deleteSnippet').remodal();
                        inst.close();
                        $("#loading").hide();
                    });
            }
            catch (e)
            {
                var inst = $('#deleteSnippet').remodal();
                inst.close();
                $("#loading").hide();
                $("#errorMessage").text("Error in Deleting. Please try again.");
                $("#background").show();
            }
        });
    }
    catch (e)
    {
        var inst = $('#deleteSnippet').remodal();
        inst.close();
        $("#loading").hide();
        $("#errorMessage").text("Error in Deleting. Please try again.");
        $("#background").show();
    }

}




function SaveItem(title, text, tags) {
    $("#loading").show();

    var userName = currentUser;
    var now = new Date();
    var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    var uid = (new Date().getTime()).toString(36);
    var id = userName + uid;

    SaveItemToDBAndDismiss(title, text, tags.join(','), userName, strDateTime, id);


}

function SaveItemToDBAndDismiss(title, text, tags, userName, strDateTime, id) {
    var data = {
        id: id,
        title: title,
        text: text,
        tags: tags,
        user: userName,
        date: strDateTime
    };
    //localStorage.setItem(id, JSON.stringify(data));
    try {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            // Prepare document first

            try {
                dataService.createDocument("jSnippyStore", data).then(function (doc) {
                    // Even if no id was passed to createDocument, one will be generated
                    $("#list").html("");
                    $("#errorMessage").text("Code Snippet Saved Successfully");
                    $("#background").show();
                    $("#loading").hide();
                });
            }
            catch(e)
            {
                $("#list").html("");
                $("#errorMessage").text("Error in Creating Snippet. Please try again later");
                $("#background").show();
                $("#loading").hide();
            }
        });
    }
    catch(e)
    {
        $("#list").html("");
        $("#errorMessage").text("Error in Creating Snippet. Please try again later");
        $("#background").show();
        $("#loading").hide();
    }

}


function SaveItemToDB(title, text, tags, userName, strDateTime, id)
{
    var data = {
        id: id,
        title: title,
        text: text,
        tags: tags,
        user: userName,
        date: strDateTime
    };

//    localStorage.setItem(id, JSON.stringify(data));

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Prepare document first
        dataService.createDocument("jSnippyStore", data).then(function (doc) {
            // Even if no id was passed to createDocument, one will be generated
        });
    });

}



function UpdateItem(title, text, tags) {
    $("#loading").show();

    var userName = currentUser;
    var now = new Date();
    var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");

    var data = {
        id: currentId,
        title: title,
        text: text,
        tags: tags.join(','),
        user: userName,
        date: strDateTime
    };

    try {
        VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
            // Prepare document first
            try {
                dataService.setDocument("jSnippyStore", data).then(function (doc) {
                    $("#errorMessage").text("Code Snippet Updated Successfully");
                    $("#loading").hide();
                    ViewMySnippets();
                });
            }
            catch(e)
            {
                $("#errorMessage").text("Error in Updating Snippet. Please try again later.");
                $("#list").html("");
                $("#background").show();
                $("#loading").hide();

            }
        });
    }
    catch (e)
    {
        $("#errorMessage").text("Error in Updating Snippet. Please try again later.");
        $("#list").html("");
        $("#background").show();
        $("#loading").hide();
    }
//    localStorage.setItem(currentId, JSON.stringify(data));
    //getAllData();

}


function ImportSnippet()
{
    $("#loading").show();
    var inst = $('#importSnippet').remodal();
    inst.close();
    $("#errorMessage").text("");
    $.ajax({
        url: "import.csv",
        type: "GET",
        dataType: "text",
        cache: false,
        timeout: 15500,
        complete: function () {
            //called when complete
        },

        success: function (data) {
            try {
                var result = $.csv.toObjects(data);
                for(var i = 0 ; i < result.length ; i++)
                {
                    SaveItemToDB(result[i].title, result[i].text, result[i].tags,
                        result[i].user
                        , result[i].date, result[i].id);
                }
                $("#errorMessage").text("Imported Successfully. Start using jSnippy!");
            }
            catch(e)
            {
                $("#errorMessage").text("Error in Import! Never mind.. Start using jSnippy!");
            }
            $("#loading").hide();
        },

        error: function (e) {
            $("#errorMessage").text("Error in Import! Never mind.. Start using jSnippy!");

            $("#loading").hide();
        }
    });
}