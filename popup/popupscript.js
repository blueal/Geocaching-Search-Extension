/*Pop-up Page Script*/

function LoadOnLoad(){
	ss = getCookie("selected_text");
    if(typeof ss === 'undefined')
    {
        document.getElementById("selectedtext").innerHTML = "Error Retreiving Selection Text"
    }
    else
    {
	   document.getElementById("selectedtext").innerHTML = ss
    }
}


function close_window(){
	window.close();
}

function getCookie(c_name)
{
    //All of this just to read a cookie...
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
    {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1)
    {
        c_value = null;
    }
    else
    {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1)
        {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

document.querySelector("#closebutton").addEventListener('click', close_window);
document.addEventListener('DOMContentLoaded', LoadOnLoad, true);