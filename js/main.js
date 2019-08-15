if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.slice(0, prefix.length) === prefix;
    };
}

function setHomePage(obj) {
    var aUrls = document.URL.split("#");
    var vDomainName = aUrls[0];

    try {
        obj.style.behavior = 'url(#default#homepage)';
        obj.setHomePage(vDomainName);
    } catch (e) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage', vDomainName);
            } catch (e) {
                alert("抱歉，此操作被浏览器拒绝！\n\n您需要手动将【" + vDomainName + "】设置为首页。\n如果您不会设置主页，你可以去搜索“浏览器设置主页”");
            }
        } else {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【" + vDomainName + "】设置为首页。\n如果您不会设置主页，你可以去搜索“浏览器设置主页”");
        }
    }
    try {//IE
        window.external.AddFavorite(vDomainName, "次元壁导航");
    } catch (e) {//Firefox
        try {
            window.sidebar.addPanel("次元壁导航", vDomainName, "");
        } catch (e) {

        }
    }
}

function set_foot_bottom() {
    if ($('html').innerHeight() < $(".container").outerHeight() + $('#foot').outerHeight()) {
        $('#foot').removeClass('foot-bottom');
    } else {
        $('#foot').addClass('foot-bottom');
    }
}

function set_search_type(t) {
    $("#left-btn span").text($(t).text());
    $("#left-btn img").attr("src", $(t).children('img').attr("src"));
    $("#search-input").attr("placeholder", $(t).data("tip") == undefined ? "" : $(t).data("tip"));
    $("#left-btn").attr("href", $(t).attr("href"));
    $("#search-btn").data("url", $(t).data("url"));
    $("#search-btn").data("newwindow", $(t).data("newwindow") != undefined);
    $("#search-btn").data("end", $(t).data("end") == undefined ? "" : $(t).data("end"));
    if ($(t).data("uploadimage")) {
        $("#img_upload_click").show();
    } else {
        $("#img_upload_click").hide();
    }
    var url2 = $(t).data("url2");
    if (url2 != undefined) {
        $("#search-btn").data("url2", url2);
    } else {
        $("#search-btn").data("url2", "");
    }
    return false;
}
function getSearchData(json) {
    var html = "";
    for (var i = 0; i < json.s.length; i++) {
        html += '<li><a href="javascript:$(\'#search-input\').val(\'' + json.s[i] + '\')">' + json.s[i] + '</a></li>';
    }
    $("#search-dropdown-list").html(html);
    if (html == "") {
        $("#search-input").parent().removeClass("open");
    } else {
        $("#search-input").parent().addClass("open");
    }
}

function setCookie(name, value, ms) {
    var exp = new Date();
    exp.setTime(exp.getTime() + ms);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function window_open(url) {
    $("#newwindow").attr("href", url);
    //$("#newwindow").click();
    document.getElementById("newwindow").click();
}

$(function () {
    set_foot_bottom();
    $(window).resize(function () {
        set_foot_bottom();
    });

    document.getElementById("search-input").addEventListener('paste', function (e) {
        if ($("#img_upload_click").css("display")=="none") {
            return;
        }
        if (e.clipboardData.files.length > 0) {
            if (e.clipboardData.files[0].type.indexOf('image') === -1) {
                return false;
            }
            var xhr = new XMLHttpRequest();
            xhr.open("post", "/ajax/UploadImage", true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.onloadend = function (a) {
                var data = JSON.parse(xhr.responseText);
                if (data.code == "200") {
                    $("#search-input").val(data.url);
                    $("#search-btn").click();
                } else {
                    alert(data.message);
                }
            };
            var fd = new FormData();
            fd.append('file', e.clipboardData.files[0]);
            xhr.send(fd);
        }
    });

    $('#remove_link').modal('hide');
    $('.box .remove_link').click(function () {
        $('#remove_link').modal();
        $("#remove_link_btn").data("id", $(this).data("id"));
        return false;
    });
    $("#remove_link_btn").click(function () {
        $.post("/ajax/removelink", { id: $(this).data("id") }, function (json) {
            if (json.code == 200) {
                $('#remove_link').modal("hide");
                window.location.reload();
            } else {
                $("#remove_link .alert").show().text(json.message);
            }
        });
        return false;
    });

    $('#edit_link').modal('hide');
    $('.edit-link').click(function () {
        $("#edit_link [name=name]").val($(this).data("name"));
        $("#edit_link [name=url]").val($(this).data("url"));
        $("#edit_link [name=id]").val($(this).data("id"));
        if ($(this).data("private") == "False") {
            $("#edit_link [name=private]").attr("checked", "checked");
        } else {
            $("#edit_link [name=private]").removeAttr("checked");
        }
        if ($(this).hasClass("head_link")) {
            $('#edit_link [type=checkbox]').attr("disabled", "disabled");
            $('#edit_link [type=checkbox]').attr("onclick", "return false;");
            $('#edit_link [type=checkbox]').attr("checked", "checked");
        } else {
            $('#edit_link [type=checkbox]').removeAttr("disabled");
            $('#edit_link [type=checkbox]').removeAttr("onclick");
        }
        $("#edit_link .alert").hide();
        $('#edit_link').modal();
        return false;
    });

    $("#edit_link_btn").click(function () {
        $.post("/ajax/EditLink", { name: $("#edit_link [name=name]").val(), url: $("#edit_link [name=url]").val(), Private: !$("#edit_link [name=private]").is(":checked"), id: $("#edit_link [name=id]").val() }, function (json) {
            if (json.code == 200) {
                $('#edit_link').modal("hide");
                window.location.reload();
            } else {
                $("#edit_link .alert").show().text(json.message);
            }
        });
    });

    $('#edit_group').modal('hide');
    $('.edit_group').click(function () {
        $("#edit_group [name=name]").val($(this).data("name"));
        $("#edit_group [name=id]").val($(this).data("id"));
        if ($(this).data("private") == "False") {
            $("#edit_group [name=private]").attr("checked", "checked");
        } else {
            $("#edit_group [name=private]").removeAttr("checked");
        }
        $('#edit_group').modal();
        return false;
    });
    $("#edit_group_btn").click(function () {
        $.post("/ajax/Editgroup", { name: $("#edit_group [name=name]").val(), Private: !$("#edit_group [name=private]").is(":checked"), id: $("#edit_group [name=id]").val() }, function (json) {
            if (json.code == 200) {
                $('#edit_group').modal("hide");
                window.location.reload();
            } else {
                $("#edit_group .alert").show().text(json.message);
            }
        });
    });

    $('#remove_group').modal('hide');
    $('.remove_group').click(function () {
        $('#remove_group').modal();
        $("#remove_group_btn").data("id", $(this).data("id"));
        return false;
    });
    $("#remove_group_btn").click(function () {
        $.post("/ajax/removegroup", { id: $(this).data("id") }, function (json) {
            if (json.code == 200) {
                $('#remove_group').modal("hide");
                window.location.reload();
            } else {
                $("#remove_group .alert").show().text(json.message);
            }
        });
        return false;
    });

    $('#add_link').modal('hide');
    $('.add_link').click(function () {
        $('#add_link').modal();
        $("#add_link .alert").hide();
        $("#add_link_btn").data("id", $(this).data("id"));
        return false;
    });
    $("#add_link_btn").click(function () {
        $.post("/ajax/addLink", { name: $("#add_link [name=name]").val(), url: $("#add_link [name=url]").val(), Private: !$("#add_link [name=private]").is(":checked"), id: $("#add_link_btn").data("id") }, function (json) {
            if (json.code == 200) {
                $('#add_link').modal("hide");
                window.location.reload();
            } else {
                $("#add_link .alert").show().text(json.message);
            }
        });
        return false;
    });
    $("#quick_add_link_btn").click(function () {
        $.post("/ajax/addLink", { name: $("#quick_add_link [name=name]").val(), url: $("#quick_add_link [name=url]").val(), Private: !$("#quick_add_link [name=private]").is(":checked"), id: $("#quick_add_link select").val() }, function (json) {
            if (json.code == 200) {
                $('#quick_add_link').modal("hide");
                window.location = "/" + json.linkname;
            } else {
                $("#quick_add_link .alert").show().text(json.message);
            }
        });
        return false;
    });

    $('#add_group').modal('hide');
    $('.add_group').click(function () {
        $('#add_group').modal();
        return false;
    });
    $("#add_group_btn").click(function () {
        $.post("/ajax/addgroup", { name: $("#add_group [name=name]").val(), Private: !$("#add_group [name=private]").is(":checked") }, function (json) {
            if (json.code == 200) {
                $('#add_group').modal("hide");
                window.location.reload();
            } else {
                $("#add_group .alert").show().text(json.message);
            }
        });
        return false;
    });

    $('.square .glyphicon-pencil').click(function () {
        return false;
    });

    $('#login_register').modal('hide');

    $(".nav-input a").click(function () {
        var img = $(".nav-input img");
        for (var i = 0; i < img.length; i++) {
            if (img.eq(i).attr("src") == "") {
                img.eq(i).attr("src", img.eq(i).data("src"))
            }
        }
        $(".nav-input a").removeClass("active");
        $(this).addClass("active");
        $("#dropdown-list").html($(this).next('ul').html());
        set_search_type($("#dropdown-list a")[0]);
        return false;
    });
    $("#search-input").keydown(function (k) {
        if (k.keyCode == 13) {
            $("#search-btn").click();
        } else {
            var list = $("#search-dropdown-list a");
            if (k.keyCode == 38) {
                if ($("#search-dropdown-list .select").length == 0 && list.length > 0) {
                    list.eq(list.length - 1).addClass("select");
                } else if (list.length > 0 && $("#search-dropdown-list .select").length == 1) {
                    var index = -1;
                    for (var i = 0; i < list.length; i++) {
                        if (list.eq(i).hasClass("select")) {
                            index = i;
                            break;
                        }
                    }
                    index = index - 1;
                    if (index >= 0) {
                        $("#search-dropdown-list .select").removeClass("select");
                        list.eq(index).addClass("select");
                    }
                }
                $("#search-input").val($("#search-dropdown-list .select").text());
            }
            else if (k.keyCode == 40) {
                if ($("#search-dropdown-list .select").length == 0 && list.length > 0) {
                    list.eq(0).addClass("select");
                } else if (list.length > 0 && $("#search-dropdown-list .select").length == 1) {
                    var index = -1;
                    for (var i = 0; i < list.length; i++) {
                        if (list.eq(i).hasClass("select")) {
                            index = i;
                            break;
                        }
                    }
                    index = index + 1;
                    if (index < list.length) {
                        $("#search-dropdown-list .select").removeClass("select");
                        list.eq(index).addClass("select");
                    }
                }
                $("#search-input").val($("#search-dropdown-list .select").text());
            }
        }
    });
    $("#search-input").blur(function () {
        setTimeout(function () {
            $("#search-input").parent().removeClass("open");
        }, 200);
    });
    $("#search-input").keyup(function (k) {
        if (k.keyCode != 13 && k.keyCode != 38 && k.keyCode != 40) {
            $.ajax({
                type: "get",
                async: false,
                url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent($("#search-input").val()),
                dataType: "jsonp",
                jsonp: "cb",
                jsonpCallback: "getSearchData",
                success: function (json) {
                },
                error: function () {
                }
            });
        }
    });
    $("#search-btn").click(function () {
        var kw = $("#search-input").val();
        var u = "";
        if ((kw.toLowerCase().startsWith("http://") || kw.toLowerCase().startsWith("https://")) && $("#search-btn").data("url2") != "") {
            u = $("#search-btn").data("url2") + encodeURIComponent(kw);
        } else {
            u = $("#search-btn").data("url") + encodeURIComponent(kw);
            if ($(this).data("end") != "") {
                u = u + $(this).data("end");
            }
        }
        var index = 0;
        var list = $(".nav-input>li>a");
        for (var i = 0; i < list.length ; i++) {
            if (list.eq(i).hasClass("active")) {
                index = i;
                break;
            }
        }
        if ($(this).data("target") == "blank") {
            if ($(this).data("toolbar") && !$(this).data("newwindow") && !$(this).data("mobile")) {
                //window.open("/search?url=" + encodeURIComponent(u) + "&keyword=" + encodeURIComponent(kw), "_blank");
                window_open("/search?url=" + encodeURIComponent(u) + "&keyword=" + encodeURIComponent(Base.encode(kw)) + "&index=" + index);
            } else {
                //window.open(u, "_blank");
                window_open(u);
            }
        } else {
            if ($(this).data("toolbar") && !$(this).data("newwindow") && !$(this).data("mobile")) {
                top.location = "/search?url=" + encodeURIComponent(u) + "&keyword=" + encodeURIComponent(Base.encode(kw)) + "&index=" + index;
            } else {
                window.location = u;
            }
        }
    });

    $("#edit_mode").click(function () {
        if ($("#edit_mode").text() == "编辑") {
            if ($("#user_name").text() == "") {
                $("#login_register").modal();
                return false;
            }
            if ($("#setting").length == 0) {
                window.location = "/";
            } else {
                $(".edit_mode").show();
                $("#edit_mode").text('取消编辑');
                setCookie("editmode", "true", 1000 * 60);
            }
        }
        else {
            $(".edit_mode").hide();
            $("#edit_mode").text('编辑');
            delCookie("editmode");
        }
        return false;
    });
    if (getCookie("editmode") == "true") {
        $(".edit_mode").show();
        $("#edit_mode").text('取消编辑');
    }
    $('#setting').modal('hide');
    $("#setting_click").click(function () {
        if ($("#user_name").text() == "") {
            $("#login_register").modal();
            return false;
        }
        if ($("#setting").length == 0) {
            window.location = "/";
        } else {
            $('#setting').modal();
            var img = $("#setting img");
            for (var i = 0; i < img.length; i++) {
                if (img.eq(i).attr("src") == "") {
                    img.eq(i).attr("src", img.eq(i).data("src"))
                }
            }
        }
        return false;
    });
    $("#setting_btn").click(function () {
        var backimage = $("#setting [name=backimage]").val();
        if ($("#setting [name=backimageurl]").val() != "") {
            backimage = $("#setting [name=backimageurl]").val();
        }
        $.post("/ajax/SaveSetting", { linkName: $("#setting [name=name]").val(), title: $("#setting [name=title]").val(), backimage: backimage, newwindow: $("#setting [name=newwindow]").is(":checked"), toolbar: $("#setting [name=toolbar]").is(":checked") }, function (json) {
            if (json.code == 200) {
                $('#setting').modal("hide");
                window.location = "/" + json.linkname;
            } else {
                $("#setting .alert-danger").show().text(json.message);
            }
        });
    });
    $("#setting img").click(function () {
        $("#setting img").removeClass("image_select");
        $(this).addClass("image_select");
        $("#setting [name=backimage]").val($(this).data("url"))
    });


    $("#login_register_btn").click(function () {
        $("#login_register .alert").hide();
        if ($("#login_register .nav-tabs .active").text() == "登录") {
            $.post("/ajax/login", { email: $("#login_name").val(), password: $("#login_password").val(), remember: 'true', linkName: $(this).data("link") },
                function (json) {
                    if (json.code == 200) {
                        $("#login_register_click").hide();
                        $("#user_name").text(json.username);
                        $("#logout_btn").show();
                        $("#login_register").modal('hide');
                        if (json.refresh) {
                            window.location.reload();
                        }
                    } else {
                        if (json.message != undefined) {
                            $("#login_register .alert").show().text(json.message);
                        }
                        else {
                            $("#login_register .alert").show().text("登录失败");
                        }
                    }
                });
        } else {
            $.post("/ajax/Register", { email: $("#register_email").val(), password: $("#register_password").val(), code: $("#register_code").val(), username: $("#register_name").val() },
                function (json) {
                    if (json.code == 200) {
                        alert("注册成功！请登录一下");
                        $("#login_register").modal('hide');
                        window.location.reload();
                    } else {
                        if (json.message != undefined) {
                            $("#login_register .alert").show().text(json.message);
                        }
                        else {
                            $("#login_register .alert").show().text("注册失败");
                        }
                    }
                });
        }
        return false;
    });

    $("#logout_btn").click(function () {
        $.get("/ajax/logout");
        $("#login_register_click").show();
        $("#user_name").text("");
        $("#logout_btn").hide();
    });
    $("#login_register_click").click(function () {
        var img = $("#register img");
        if (img.attr("src") == "") {
            img.attr("src", img.data("src"))
        }
    });

    $("#img_upload_click").click(function () {
        document.getElementById("file_upload").click();

    });

    $("#file_upload").change(function () {
        if ($(this).val() != "") {
            var formData = new FormData();
            formData.append("file", document.getElementById("file_upload").files[0]);
            $.ajax({
                url: "/ajax/UploadImage",
                type: "POST",
                data: formData,
                /**
                *必须false才会自动加上正确的Content-Type
                */
                contentType: false,
                /**
                * 必须false才会避开jQuery对 formdata 的默认处理
                * XMLHttpRequest会对 formdata 进行正确的处理
                */
                processData: false,
                success: function (data) {
                    if (data.code == "200") {
                        $("#search-input").val(data.url);
                        $("#search-btn").click();
                    } else {
                        alert(data.message);
                    }
                },
                error: function () {
                    alert("上传失败！");
                }
            });
        }
    });

});