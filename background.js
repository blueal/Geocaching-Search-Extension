/* This background page has been converted to the a event page
 * Which allows the web browser to run faster by not having the
 * script running all the time, instead the script will only run
 * when it is needed (like with the context menu)
 *
 * Information about event pages is available here 
 * http://developer.chrome.com/extensions/event_pages.html
 */

var selectedText;

function onClickHandler(info, tab) {
	if (info.menuItemId == "GC") {
		//GC Click Handler
		
		if (info.selectionText.match(/^[a-zA-Z0-9]+$/)) {
			var url = 'http://www.geocaching.com/seek/cache_details.aspx?wp=' + info.selectionText; //Whoa! There's some URL construction going on here
			//opens new window 
			window.open(url);
			return;
		}
		else
		{
			//The size of the window is determinded by the language
			var lang = localStorage["identified_language"];
			if(typeof lang === 'undefined')
			{
				lang = chrome.runtime.getManifest().current_locale;
			}
			if(lang == "en_US" || lang == "en_GB" || lang == "en")
			{
				//no extra space needed
				chrome.windows.create({ url: "/popup/selectionerrorGC.html", type: "detached_panel", focused:true, top: 250, width: 360, height: 200});
			}
			else
			{
				//extra space is needed
				chrome.windows.create({ url: "/popup/selectionerrorGC.html", type: "detached_panel", focused:true, top: 250, width: 480, height: 260});
			}
			//Passing what you selected to a global variable so it can be read by the popup
			selectedText = info.selectionText;

			//the variable should be deleted within the popup but just in case this will delelte it after 10 seconds
			setTimeout(function(){
				selectedText = undefined
			}, 10000);
			return;
			
		}	
	}
	if(info.menuItemId == "TB") {
		//TB click handler
		
		/*Checking if you just selected useless garbage*/
		if (info.selectionText.match(/^[a-zA-Z0-9]+$/)) {
			var url = 'http://www.geocaching.com/track/details.aspx?tracker=' + info.selectionText;
			//opens new window 
			window.open(url);
			return;
		}
		else
		{
			//The size of the window is determined by the language
			var lang = localStorage["identified_language"];
			if(typeof lang === 'undefined')
			{
				lang = chrome.runtime.getManifest().current_locale;
			}
			if(lang == "en_US" || lang == "en_GB" || lang == "en")
			{
				//no extra space needed
				chrome.windows.create({ url: "/popup/selectionerrorTB.html", type: "detached_panel",  focused: true, top: 250, width: 390, height: 200});
			}
			else
			{
				//extra space is needed
				chrome.windows.create({ url: "/popup/selectionerrorTB.html", type: "detached_panel",  focused: true, top: 250, width: 480, height: 260});
			}
			//Passing what you selected to a global variable so it can be read by the popup
			selectedText = info.selectionText;
			//The popup is supposed to delete the Variable, but just in case it doesn't,
			//This will delete it after 10 seconds
			
			setTimeout(function(){
				selectedText = undefined
			}, 10000);
			return;
		} 
	}
};

function Startup() {
	chrome.contextMenus.create({
	 "title":chrome.i18n.getMessage("InputTextGC_html"),
	  "contexts":["selection"],
	  "id": "GC",
	});  
	chrome.contextMenus.create({
	  "title":"Trackable",
	  "contexts":["selection"],
	  "id": "TB",
	});
	
	//Setting up some initial settings
	localStorage["identified_language"] = chrome.runtime.getManifest().current_locale;
	localStorage["preferred_option"] = "trackable";
	
}


//NEW event page event listeners
chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(Startup);
chrome.runtime.onUpdateAvailable.addListener(function (){chrome.runtime.reload;})



