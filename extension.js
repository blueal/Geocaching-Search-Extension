//Translates HTML
function translateHTML() {
	var lang = window.navigator.language;
	localStorage["identified_language"] = lang;
	console.log('Your browser Identified Its language as "' + lang + '". If this is wrong, check your language setting.');
	document.getElementById("save").innerHTML = chrome.i18n.getMessage("button_html");
	var element2 = document.getElementById("SearchButton");
	element2.setAttribute('Value', chrome.i18n.getMessage("SearchButton_html"));
}

document.addEventListener('DOMContentLoaded', translateHTML, true);

/*
Turn off Text Wrap

 _____                           _     _               _____ _                                _____     _                 _             
|  __ \                         | |   (_)             /  __ \ |                              |  ___|   | |               (_)            
| |  \/ ___  ___   ___ __ _  ___| |__  _ _ __   __ _  | /  \/ |__  _ __ ___  _ __ ___   ___  | |____  _| |_ ___ _ __  ___ _  ___  _ __  
| | __ / _ \/ _ \ / __/ _` |/ __| '_ \| | '_ \ / _` | | |   | '_ \| '__/ _ \| '_ ` _ \ / _ \ |  __\ \/ / __/ _ \ '_ \/ __| |/ _ \| '_ \ 
| |_\ \  __/ (_) | (_| (_| | (__| | | | | | | | (_| | | \__/\ | | | | | (_) | | | | | |  __/ | |___>  <| ||  __/ | | \__ \ | (_) | | | |
 \____/\___|\___/ \___\__,_|\___|_| |_|_|_| |_|\__, |  \____/_| |_|_|  \___/|_| |_| |_|\___| \____/_/\_\\__\___|_| |_|___/_|\___/|_| |_|
                                                __/ |                                                                                   
                                               |___/                                                                                    

 _____                _           _   _             _____                           _     _               _   _                         
/  __ \              | |         | | | |           |  __ \                         | |   (_)             | | | |                        
| /  \/_ __ ___  __ _| |_ ___  __| | | |__  _   _  | |  \/ ___  ___   ___ __ _  ___| |__  _ _ __   __ _  | | | |___  ___ _ __           
| |   | '__/ _ \/ _` | __/ _ \/ _` | | '_ \| | | | | | __ / _ \/ _ \ / __/ _` |/ __| '_ \| | '_ \ / _` | | | | / __|/ _ \ '__|          
| \__/\ | |  __/ (_| | ||  __/ (_| | | |_) | |_| | | |_\ \  __/ (_) | (_| (_| | (__| | | | | | | | (_| | | |_| \__ \  __/ |             
 \____/_|  \___|\__,_|\__\___|\__,_| |_.__/ \__, |  \____/\___|\___/ \___\__,_|\___|_| |_|_|_| |_|\__, |  \___/|___/\___|_|             
                                             __/ |                                                 __/ |                                
                                            |___/                                                 |___/                                 
 
______ _                  _                                                                                                             
| ___ \ |                | |                                                                                                            
| |_/ / |_   _  ___  __ _| |                                                                                                            
| ___ \ | | | |/ _ \/ _` | |                                                                                                            
| |_/ / | |_| |  __/ (_| | |                                                                                                            
\____/|_|\__,_|\___|\__,_|_|                                                                                                            
                                      


Somewhere in this extension is a hidden file. If you find it, I will reward you.
*/