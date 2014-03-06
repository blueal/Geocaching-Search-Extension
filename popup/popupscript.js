/*Pop-up Page Script*/

function LoadOnLoad(){
    var ss = chrome.extension.getBackgroundPage().selectedText 
    //I should be using chrome.runtime.getBackgroundPage instead but it isn't working correctly
    var element = document.getElementById("selectedtext");
    if(typeof ss === 'undefined')
    {
        console.warn("Warning: Unable to retreive your selected text")
        element.setAttribute('class', "error"); 
        element.innerHTML = "Error Retreiving Selected Text"
    }
    else
    {
        //Setting "what you selcted" to what you selected
        element.innerHTML = ss
        //deleting variable
        chrome.extension.getBackgroundPage().selectedText = undefined
    }
}


function close_window(){
	window.close();
}

document.querySelector("#closebutton").addEventListener('click', close_window);
document.addEventListener('DOMContentLoaded', LoadOnLoad, true);