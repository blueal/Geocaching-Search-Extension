  
function LoadOnLoad(){
	document.getElementById("selectedtext").innerHTML = localStorage["selected_text"];
	localStorage["selected_text"] = ""; //For your privacy and security, your selected text will be immediately deleted after the page is done loading
}


function close_window(){
	localStorage["selected_text"] = "";
	window.close();
}

document.querySelector("#closebutton").addEventListener('click', close_window);
document.addEventListener('DOMContentLoaded', LoadOnLoad, true);