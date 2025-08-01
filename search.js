/*Persistent Global Variables for SetStatus
* TODO: Rewrite this function so I don't have to use these annoying variables.
*/
var _number = 0,
_again = 15,
_REPEAT = false,
_running = false,
_duration;

/**
 * The URL prefix for searching GC codes
 * @constant
 * @type {string}
 */
const GEOCACHE_SEARCH_URL  = "https://www.geocaching.com/geocache/";

/**
 * The URL prefix for searching TB codes
 * @constant
 * @type {string}
 */
const TRACKABLE_SEARCH_URL = "https://www.geocaching.com/track/details.aspx?tracker=";

/**
 * Geocache Option ID
 * @constant
 * @type {string}
 */
const GEOCACHE_OPTION = "geocache"

/**
 * Trackable Option ID
 * @constant
 * @type {string}
 */
const TRACKABLE_OPTION = "trackable"

/**
 * Default Option ID
 * @constant
 * @type {string}
 */
const DEFAULT_OPTION = TRACKABLE_OPTION

/**
 * Saved Option Local Storage Location
 * @constant
 * @type {string}
 */
const OPTION_STORAGE_LOCATION = "preferred_option"



/*Static Variables*/
var _DefaultFadeDelay = 2400;

// Saves options to localStorage.

async function getOrSetOptionToStorage(option){
	if(option !== null && option !== undefined && option !== '') {
		await chrome.storage.local.set({"preferred_option": option});
	}
	return await chrome.storage.local.get(["preferred_option"]);
}

function saveOptions() {
	select = document.getElementById("mode-option");
	var selectedOption = select.children[select.selectedIndex].value;
	//selectedOption = document.getElementById("mode-option").select.children[select.selectedIndex].value;
	const savedSetting = getOrSetOptionToStorage();

	switch(selectedOption){
		case savedSetting:
			console.log("Selected Option is already saved. Reset the form.");
			setForm(selectedOption);
			return;
		case GEOCACHE_OPTION:
			setForm(GEOCACHE_OPTION);
			break;
		case TRACKABLE_OPTION:
			setForm(TRACKABLE_OPTION);
			break;
		default:
			//Invalid Selected Option
			console.error("Invalid Option In Selection Menu: " + selectedOption)
			setStatus("ERROR");
			return;
	}

	getOrSetOptionToStorage(selectedOption);
	setStatus();
	return;
}


function setFormFromStorage() {
	const SAVED_OPTION = getOrSetOptionToStorage();
	switch (SAVED_OPTION) {
		case GEOCACHE_OPTION:
			setForm(GEOCACHE_OPTION);
			break;
		case TRACKABLE_OPTION:
			setForm(TRACKABLE_OPTION);
			break;
		default:
			console.log("No Valid Option to Restore: " + SAVED_OPTION + "\nSetting to DEFAULT_OPTION: " + DEFAULT_OPTION);
			getOrSetOptionToStorage(DEFAULT_OPTION);
			setForm(DEFAULT_OPTION);
			break;
	}

}

/**
 * Set Form HTML for Different Options
 * @param {string} option - Must be a valid OPTION constant
 */
function setForm(option) {
	var inputBox = document.getElementById("InputText");
	switch (option){
		case GEOCACHE_OPTION:
			inputBox.setAttribute('placeholder', chrome.i18n.getMessage("InputTextGC_html"));
			inputBox.setAttribute('title', chrome.i18n.getMessage("TitleGC_html"));
			break;
		case TRACKABLE_OPTION:
			inputBox.setAttribute('placeholder', chrome.i18n.getMessage("InputTextTB_html")); 
			inputBox.setAttribute('title', chrome.i18n.getMessage("TitleTB_html"));
			break;
		default:
			console.error("No Valid Option Given For setForm Function: " + option)
			return;
	}

	//Reset Drop down box
	var select = document.getElementById("mode-option");
  		for (var i = 0; i < select.children.length; i++) {	//It sets the drop down menu to what you set it to
    	var child = select.children[i];
    	if (child.value == option) {
      		child.selected = "true";
      		break;
    	}
  	}

	return;

}


/*Function for Status Message*/

/*Execution Logic For Status Message
* 
*Display a message Using setStatus(message, duration);
*If that exact message is already being displayed it will just
*reset the fade to the new duration you specified.
*If you don't specify a duration, it will use the default which is defined on line 22
*If you also don't specify a message, it uses the "Option Saved" message
*If you set a new message and one is already being displayed, it will reset everything and 
*display the new message for the duration you sepcify.
*/

function setStatus(message, duration)
{
	/*The Code is designed so if you leave both variables blank
	it will display the normal "Saved Options" message*/

	var status = document.getElementById("status");
	var statushtml = status.innerHTML;
	
	if(statushtml == message || typeof message === 'undefined' && statushtml == chrome.i18n.getMessage("Status_html"))
	{
		//That Message Is already being displayed, reset the timer
		_duration = duration;
		_REPEAT = true;
		return "Timer Reset";
	}
	/*Message Content*/
	if(typeof message === 'undefined')
	{
		status.innerHTML = chrome.i18n.getMessage("Status_html");
	}
	else
	{
		status.innerHTML = message;
	}

	/*Duration of Messgae*/
	if(_running == true)
	{
		//A message is already being displayed. Stop it, and set a new duration
		_duration = duration;
		_REPEAT = true;
		return "New Message Is Being Displayed, and Timer Has Been Reset";
	}
	else
	{
		//Fresh new message, lets set the timer
		fade(status, duration);
		return "Message Is Being Displayed and Timer Is Set";
	}

}


/*Status Message Fade Out*/
function fade(elem, dur)
{
	_running = true;
	if(typeof dur === 'undefined')
	{
		dur = _DefaultFadeDelay;
	}
	elem.style.opacity = 1;

	//Lets wait a bit before we start fading
	setTimeout(function(){
		(function go(){
			if(_REPEAT == true)
			{
				//STOP EVERYTHING! We need to start the fade over again
				_REPEAT = false;
				fade(elem, _duration);
				return;
			}
			//Increment Opacity Down .03
			if(elem.style.opacity > .3){	//You can't go below 0
				elem.style.opacity = (elem.style.opacity - .3)
				//Fading isn't finished, keep fading
				setTimeout( go, 100 );
	
			}
			else if(elem.style.opacity > .05 && elem.style.opacity < .3)
			{
				//Keep going at a smaller rate to make it a smooth fade
				elem.style.opacity = (elem.style.opacity - .05)
				setTimeout(go, 100);
			}
			else
			{
				//Done Fading, do some clean-up then exit function
				elem.innerHTML = "";
				elem.removeAttribute("style");
				_duration = "";
				_running = false;
				return;
			}
		})();
	}, dur);
	return;
}

/**
 * Handles the search
 * @param {string} input - The search box input.
 */
function search(input){
	const searchText    = input.trim(); //trim the whitespace for good measure
	const CURRENT_OPTION = getOrSetOptionToStorage();
	var searchUrl       = "";
	//Check if it's a geocache or trackable
	switch(CURRENT_OPTION) {
		case GEOCACHE_OPTION:
			searchUrl = GEOCACHE_SEARCH_URL + searchText;
			console.log("Opening Geocache Page to: " + searchUrl)
			break;
		case TRACKABLE_OPTION:
			searchUrl = TRACKABLE_SEARCH_URL + searchText;
			console.log("Opening Trackable Page to: " + searchUrl)
			break;
		default:
			//Error
			console.error("Invalid Option: " + CURRENT_OPTION)
			return;
	}

	chrome.tabs.create({
		url: searchUrl
	});

}

/* Event Listeners */

document.addEventListener('DOMContentLoaded', () => {
	setFormFromStorage();
	document.querySelector("#mode-option").addEventListener('change', saveOptions);
	document.querySelector("#InputText").addEventListener('blur', function (){document.getElementById("InputText").focus();}); 
	//The above is so the input box ALWAYS has focus
	document.getElementById("form").addEventListener('submit', (event) => {
		// Prevent the default form submission behavior (page reload)
		event.preventDefault();
		search(
			document.getElementById("InputText").value
		);
	});
});