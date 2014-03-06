//All the Code for the Option Selection

var _InputTextTB = chrome.i18n.getMessage("InputTextTB_html"),
_InputTextGC = chrome.i18n.getMessage("InputTextGC_html"),
_number = 0,
_again = 12;

// Saves options to localStorage.
function save_options() {
	select = document.getElementById("mode-option");
	var mode = select.children[select.selectedIndex].value;  //mode is what you have selected
	var current_setting = localStorage["preferred_option"]   //current setting saved into local storage

	if (current_setting == mode) //checks if your setting the option to what its already set to
	{
		var a=document.getElementById("InputText");
		var a1 = a.getAttribute("name");
		
		if (a1 == "tracker" && current_setting == "geocache" || a1 == "wp" && current_setting == "trackable") //Checks if current_setting and what is actually set, is out of sync.
		{
			localStorage["preferred_option"] = mode
			var status = document.getElementById("status");
			status.innerHTML = chrome.i18n.getMessage("Status_html");
			setTimeout(function() {
				status.innerHTML = "";
			}, 1000);
			//Updates HTML stuff
			if (mode == "geocache")
			{
				var element1 = document.getElementById("form");
				element1.setAttribute('action', "http://www.geocaching.com/seek/cache_details.aspx?wp="); 
				var element2 = document.getElementById("InputText");
				element2.setAttribute('name', "wp"); 
				//element2.setAttribute('placeholder', _InputTextGC); 
				element2.setAttribute('placeholder', chrome.i18n.getMessage("InputTextGC_html")); 
				console.log("Changed Attributes to Geocache");
			}
			else if (mode == "trackable")
			{
				var element1 = document.getElementById("form");
				element1.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
				var element2 = document.getElementById("InputText");
				element2.setAttribute('name', "tracker"); 
				//element2.setAttribute('placeholder', _InputTextTB); 
				element2.setAttribute('placeholder', chrome.i18n.getMessage("InputTextTB_html")); 
				console.log("Changed Attributes to Trackable");
			}
			else
			{
				window.location.reload(true);
			}
		}
		else
		{
			_number++
			if (_number == _again) //All of this to make it as user friendly as possible
			{
				var mode1 = "";
				if (current_setting = "trackable")
				{
					var mode1 = "Trackable"
				}
				else
				{
					var mode1 = "Geocache"
				}
				window.alert('The Form is already set to ' + mode1 + '. Please try and set it to something else that it is not already set to.')
				_number = 0;
				_again++
			}
		}
	}
	else if (mode == "trackable" || mode == "geocache")
	{
		_number = 0;
		localStorage["preferred_option"] = mode
		var status = document.getElementById("status");
		status.innerHTML = chrome.i18n.getMessage("Status_html");
		setTimeout(function() {
			status.innerHTML = "";
		}, 1000);
		//Updates HTML stuff
		if (mode == "geocache")
		{
			var element1 = document.getElementById("form");
			element1.setAttribute('action', "http://www.geocaching.com/seek/cache_details.aspx?wp="); 
			var element2 = document.getElementById("InputText");
			element2.setAttribute('name', "wp"); 
			//element2.setAttribute('placeholder', _InputTextGC); 
			element2.setAttribute('placeholder', chrome.i18n.getMessage("InputTextGC_html")); 
			console.log("Changed Attributes to Geocache");
		}
		else if (mode == "trackable")
		{
			var element1 = document.getElementById("form");
			element1.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
			var element2 = document.getElementById("InputText");
			element2.setAttribute('name', "tracker"); 
			//element2.setAttribute('placeholder', _InputTextTB); 
			element2.setAttribute('placeholder', chrome.i18n.getMessage("InputTextTB_html")); 
			console.log("Changed Attributes to Trackable");
		}
		else
		{
			window.location.reload(true);
		}
	}
	else //You will only get to this if you fool around with the HTML, same thing goes with the thing directly above this
	{
		window.location.reload(true);
	}
}

//restores options
function restore_options() {
  var favorite = localStorage["preferred_option"];
  if (favorite == "geocache")
	{
		
		var element1 = document.getElementById("form");
		element1.setAttribute('action', "http://www.geocaching.com/seek/cache_details.aspx?wp="); 
		var element2 = document.getElementById("InputText");
		element2.setAttribute('name', "wp"); 
		element2.setAttribute('placeholder', _InputTextGC);
		console.log("Changed Form Values to Geocache as per Setting")
	}
	else if (favorite == "trackable")
	{
		var element1 = document.getElementById("form");
		element1.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
		var element2 = document.getElementById("InputText");
		element2.setAttribute('name', "tracker"); 
		element2.setAttribute('placeholder', _InputTextTB); 
		console.log("Changed Attributes to Trackable as per Setting");
	}
	else if (typeof favorite === 'undefined')
	{
		var element1 = document.getElementById("form");
		element1.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
		var element2 = document.getElementById("InputText");
		element2.setAttribute('name', "tracker"); 
		element2.setAttribute('placeholder', _InputTextTB); 
		console.log("No current setting set, changed Attributes to Trackable");
		localStorage["preferred_option"] = "trackable";
	}
	else
	{
		console.warn('Warning: localStorage responded with unknown variable: "' + favorite + '" Attributes where changed to trackable');
		var element1 = document.getElementById("form");
		element1.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
		var element2 = document.getElementById("InputText");
		element2.setAttribute('name', "tracker"); 
		element2.setAttribute('placeholder', _InputTextTB); 
		localStorage["preferred_option"] = "trackable";
	}
  if (!favorite) {
    return;
  }
  var select = document.getElementById("mode-option");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}


document.addEventListener('DOMContentLoaded', restore_options, true);
document.querySelector("#save").addEventListener('click', save_options);

