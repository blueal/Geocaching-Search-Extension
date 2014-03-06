//Lines 2-15 translates the HTML for the extension
var _InputText = chrome.i18n.getMessage("InputText_html");
var _SearchButton = chrome.i18n.getMessage("SearchButton_html");


function translateHTML() {
	document.getElementById("disclaimerSpan").innerHTML = chrome.i18n.getMessage("disclaimer_html"); //Immediately translates disclaimer
	
	var element1 = document.getElementById("InputText"); //Identifies the text box and defines it
	element1.setAttribute('placeholder', _InputText); //sets the text box to a variable that is defined on line 2
	
	var element2 = document.getElementById("SearchButton"); //Identifies the button and defines it
	element2.setAttribute('Value', _SearchButton); //sets the button text to a variable that is defined on line 3
}
window.onload = translateHTML; //This will immediately run the above function


//Everything below this line is for Google Analytics
var _AnalyticsCode = 'UA-41404176-1';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);
 	
(function() {
var ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);
})();