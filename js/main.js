/*

    WebNotepad for Firefox
    https://jaroslavc.eu/webnotepad

*/

//      Menus :
show_menu = false;
show_links = false;
show_fonts = false;

//      Colors :
theme = 1; // 1 is dark, 0 is white.

//      Language :
locale = {
    default_file_name: "New Text Document",

    go_to_link: "Go to {url}", // {url} cannot be removed.
    refresh_links: "Click to refresh all links",
    close_links: "Click to close links menu.",

    menu_links: [
        "☇ Save as…",
        "⚒ Font settings",
        "☘ Switch theme",
        "⚠ Changelog",
        "⚑ About"
    ],

    font_name: "Font name (ex. Tahoma)",
    font_size: "Size",
    font_submit: "Set",

    txtarea_placeholder: "Type something here",

    // Errors
    no_textarea_error: "Textarea or links window couldn't be found. Try refreshing the page (F5).",
    no_links_found: "I didn't found any links."
};
//      Other :
version = "1.5";

// --- --- --- --- --- --- --- --- --- --- ---

function get_url_list(textarea, links_window)
{
    if ((typeof(textarea) != "undefined") && (typeof(links_window) != "undefined"))
    {
        var number_of_links;
        var re = /(https?:\/\/[^\s]+)/g;
        do
        {
            actual_links = re.exec(textarea.value);
            if (actual_links)
            {
                number_of_links =+1;
                
                var link = document.createElement("a");
                link.href = actual_links[0]; link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.title = locale.go_to_link.replace("{url}", actual_links[0]);
                link.setAttribute("class", actual_links[0].split("://")[0] == "https" ? "ssl" : "");
                link.appendChild(document.createTextNode(actual_links[0].split("://", 2)[1]));

                links_window.appendChild(link);
            }
        } while (actual_links);
        if (!number_of_links)
        {
            var p = document.createElement("p");
            p.setAttribute("class", "error");
            p.appendChild(document.createTextNode(locale.no_links_found));
            links_window.appendChild(p);
        }
    }
    else
    {
        alert(locale.no_textarea_error);
    }
}

function remove_links(links_window)
{
    while (links_window.hasChildNodes())
    {
        if (links_window.lastChild.tagName != "BUTTON")
        {
            links_window.removeChild(links_window.lastChild);
        }
        else
        {
            break;
        }
    }
}

// --- --- --- --- --- --- --- --- --- --- ---

window.addEventListener("load", function() {
    // Get required elements to variables.
    var links_window            = document.getElementById("linksWindow");
    var links_button            = document.getElementById("linksButton");
    var menu_window             = document.getElementById("menuWindow");
    var menu_button             = document.getElementById("menuButton");
    var textarea                = document.getElementsByTagName("textarea")[0];
    var close_menu_button       = document.getElementById("closeMenu");
    var close_links_button      = document.getElementById("closeLinks");
    var refresh_links_button    = document.getElementById("refreshLinks");
    var font_settings           = document.getElementById("fontSettings");
	var font_settings_button    = document.getElementById("font_settings_button");
	var font_settings_exitbutton= document.getElementById("closeFontSettings");
	var setFontName				= document.getElementsByTagName("input")[0];
	var setFontSize				= document.getElementsByTagName("input")[1];
	var setFontColor			= document.getElementsByTagName("input")[2];
	var fontSubmitButton		= document.getElementById("fontSubmitButton");
	var changeThemeButton		= document.getElementById("change_theme_button");
	


    // Set the default theme.
    var theme_link = document.createElement("link");
    theme_link.rel = "stylesheet";
    theme_link.type = "text/css";
    theme_link.href = `css/${ theme ? "black" : "white" }.css`;
    document.head.appendChild(theme_link);

    // Load locale
    textarea.placeholder = locale.txtarea_placeholder;
    for (var i = 0; i < menu_window.children.length; i++)
    {
        menu_window.children[i].appendChild(document.createTextNode(locale.menu_links[i]));
        if (i >= 4)
        {
            break;
        }
    }
    refresh_links_button.title = locale.refresh_links;
    close_links_button.title = locale.close_links;
    font_settings_inputs = font_settings.getElementsByTagName("input");
    font_settings_inputs[0].placeholder = locale.font_name;
    font_settings_inputs[1].placeholder = locale.font_size;
    font_settings_inputs[3].value = locale.font_submit;


    // Onclick events
    menu_button.addEventListener("click", function() {
        menu_window.style.display = "block";
        file = new Blob([textarea.value.replace(/[\r\n]/g, "\r\n")], {
            type: "text/plain"
        });
        var save_file_button = document.getElementById("savefile");
        save_file_button.href = URL.createObjectURL(file);
        save_file_button.download = `${ locale.default_file_name }.txt`;
        
    });

    close_menu_button.addEventListener("click", function() {
        menu_window.style.display = "none";
    });

    links_button.addEventListener("click", function() {
        links_window.style.display = "block";
        get_url_list(textarea, links_window);
    });

    close_links_button.addEventListener("click", function() {
        links_window.style.display = "none";
        remove_links(links_window);
    });

    refresh_links_button.addEventListener("click", function() {
        remove_links(links_window);
        get_url_list(textarea, links_window);
    });
	
	font_settings_button.addEventListener("click", function() {
		if (!show_fonts) {
			font_settings.style.display = "block";
			show_fonts = true;
		}
		else {
			font_settings.style.display = "none";
			show_fonts = false;
		}
	});
	
	font_settings_exitbutton.addEventListener("click", function() {
		font_settings.style.display = "none";
		show_fonts = false;
	});
	
	fontSubmitButton.addEventListener("click", function() {
		textarea.style.fontFamily = setFontName.value;
		textarea.style.fontSize = setFontSize.value;
		textarea.style.color = setFontColor.value;
		font_settings.style.display = "none";
		show_fonts = false;
	});
	
	changeThemeButton.addEventListener("click", function() {
		if (theme) {
			theme_link.href = 'css/white.css';
			theme = 0;
		}
		else {
			theme_link.href = 'css/black.css';
			theme = 1;
		}
	});

});
