//context menu scripts

function clickHandlerGC(){
  return function(info, tab) {
	if (info.selectionText.match(/^[a-zA-Z0-9]+$/)) {
		var url = 'http://www.geocaching.com/seek/cache_details.aspx?wp=' + info.selectionText; //Whoa! There's some URL construction going on here
		//opens new window 
		window.open(url);
	}
	else
	{
		chrome.windows.create({ url: "/popup/selectionerrorGC.html", type: "detached_panel",  top: 250, width: 360, height: 200});
		//passing your selection to a cookie, it will be deleted in 1o seconds
		document.cookie = "selected_text=" + info.selectionText + "; max-age=10";
	}
  };
}

function clickHandlerTB(){
  return function(info, tab) {
	/*Checking if you just selected useless garbage*/
 	if (info.selectionText.match(/^[a-zA-Z0-9]+$/)) {
		var url = 'http://www.geocaching.com/seek/cache_details.aspx?wp=' + info.selectionText;
		//opens new window 
		window.open(url);
	}
	else
	{
		//You selected useless garbage
		chrome.windows.create({ url: "/popup/selectionerrorGC.html", type: "detached_panel",  top: 250, width: 360, height: 200});
		//passing your selection to a cookie, it will be deleted in 1o seconds
		document.cookie = "selected_text=" + info.selectionText + "; max-age=10";
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
