//Translates HTML
function translateHTML() {
	var lang = chrome.runtime.getManifest().current_locale;
	localStorage["identified_language"] = lang;
	console.log('Your browser Identified Its language as "' + lang + '". If this is wrong, check your language setting.');
	document.getElementById("SearchButton").setAttribute('Value', chrome.i18n.getMessage("SearchButton_html"));
}

document.addEventListener('DOMContentLoaded', translateHTML, true);

/*
*Turn off Text Wrap
*
 _____                           _     _               _____ _                                _____     _                 _             
|  __ \                         | |   (_)             /  __ \ |                              |  ___|   | |               (_)            
| |  \/ ___  ___   ___ __ _  ___| |__  _ _ __   __ _  | /  \/ |__  _ __ ___  _ __ ___   ___  | |____  _| |_ ___ _ __  ___ _  ___  _ __  
| | __ / _ \/ _ \ / __/ _` |/ __| '_ \| | '_ \ / _` | | |   | '_ \| '__/ _ \| '_ ` _ \ / _ \ |  __\ \/ / __/ _ \ '_ \/ __| |/ _ \| '_ \ 
| |_\ \  __/ (_) | (_| (_| | (__| | | | | | | | (_| | | \__/\ | | | | | (_) | | | | | |  __/ | |___>  <| ||  __/ | | \__ \ | (_) | | | |
 \____/\___|\___/ \___\__,_|\___|_| |_|_|_| |_|\__, |  \____/_| |_|_|  \___/|_| |_| |_|\___| \____/_/\_\\__\___|_| |_|___/_|\___/|_| |_|
                                                __/ |                                                                                   
                                               |___/                                                                                    
*/