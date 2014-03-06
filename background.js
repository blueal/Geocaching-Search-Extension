//context menu scripts

function clickHandlerGC(){
  return function(info, tab) {
    if(info.selectionText.indexOf(" ") != -1) //checks if you included a space in your selection
	{
	chrome.windows.create({ url: "/popup/nospacesGC.html", type: "detached_panel",  top: 250, width: 360, height: 200});
	localStorage["selected_text"] = info.selectionText; //passing your selection to localStorage so the popup can display the text you selected, It will be immediately deleted on page load
	}
	else
	{
    // This sets the URL variable to the text selected
    var url = 'http://www.geocaching.com/seek/cache_details.aspx?wp=' + info.selectionText; //Whoa! There's some URL construction going on here
	//opens new window 
    window.open(url);
	} 
    
  };
}

function clickHandlerTB(){
  return function(info, tab) {
    if(info.selectionText.indexOf(" ") != -1)
	{
	chrome.windows.create({ url: "/popup/nospacesTB.html", type: "detached_panel", top: 200, width: 390, height: 200});
	localStorage["selected_text"] = info.selectionText;
	}
	else
	{
    var url = 'http://www.geocaching.com/track/details.aspx?tracker=' + info.selectionText;
    window.open(url);
	} 
    
  };
}

chrome.contextMenus.create({
  "title":chrome.i18n.getMessage("InputTextGC_html"),
  "contexts":["selection"],
  "onclick": clickHandlerGC()
  
});  
chrome.contextMenus.create({
  "title":"Trackable",
  "contexts":["selection"],
  "onclick": clickHandlerTB()
});  
