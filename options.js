/*
*All of this code is for the Option Selection
*I would comment everything but Im too lazy to do that
*
*If you have comments or questions, contact Geocaching User blueal at "blueal@outlook.com"
*
*/

var _number = 0,
_again = 15;

// Saves options to localStorage.
function save_options() {
	select = document.getElementById("mode-option");
	var mode = select.children[select.selectedIndex].value;  //mode is what you have selected
	var current_setting = localStorage["preferred_option"]   //current setting saved into local storage

	if (current_setting == mode) //checks if your setting the option to what its already set to.
	{
		var a=document.getElementById("InputText");
		var a1 = a.getAttribute("name");
		
		if (a1 == "tracker" && current_setting == "geocache" || a1 == "wp" && current_setting == "trackable") //Checks if current_setting and what is actually set, is out of sync.
		{
			//This code will ONLY be run if something terrible has happened to the HTML
			//Putting this code in was completely unnecessary but I felt like being a good programmer and error proofing my code
			localStorage["preferred_option"] = mode
			var status = document.getElementById("status");
			status.innerHTML = chrome.i18n.getMessage("Status_html");
			setTimeout(function() {
				status.innerHTML = "";
			}, 1000);
			//Updates HTML stuff
			if (mode == "geocache")
			{
				setGC();
				console.warn("HTML Out of sync, Changed Everything To Option Selected");
			}
			else if (mode == "trackable")
			{
				setTB();
				console.log("HTML Is Out Of Sync, Changed Everything To Option Selected");
			}
			else
			{
				window.location.reload(true);
			}
		}
		else //this is the actual, setting something to something its already set to idiot proofing code.
		{
			_number++
			if (_number == _again) //All of this to make it as user friendly as possible
			{
				if (mode == "geocache")
				{
					setGC();
					console.warn("Button is being spammed, It finally gave the user what it wanted");
				}
				else if (mode == "trackable")
				{
					setTB();
					console.log("Button is being spammed, It finally gave the user what it wanted");
				}
				_number = 0;
				_again++
				localStorage["preferred_option"] = mode
				var status = document.getElementById("status");
				status.innerHTML = chrome.i18n.getMessage("Status_html");
				setTimeout(function() {
				status.innerHTML = "";
				}, 1000);
			}
		}
	}
	else if (mode == "trackable" || mode == "geocache") //checks if you didn't fuck with the HTML
	{
		//this is the actual code that will run when you click the Save/Set button
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
			setGC();
			console.log("Changed Attributes to Geocache");
		}
		else if (mode == "trackable")
		{
			setTB();
			console.log("Changed Attributes to Trackable");
		}
		else //Look at the comment below
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
		setGC();
		console.log("Changed Form Values to Geocache as per Setting")
	}
	else if (favorite == "trackable")
	{
		setTB();
		console.log("Changed Attributes to Trackable as per Setting");
	}
	else if (typeof favorite === 'undefined')
	{
		setTB();
		console.log("No current setting set, changed Attributes to Trackable");
		localStorage["preferred_option"] = "trackable";
	}
	else
	{
		setTB();
		console.warn('Warning: localStorage responded with unknown variable: "' + favorite + '" Attributes where changed to trackable');		
		localStorage["preferred_option"] = "trackable";
	}
  if (!favorite) {
    return;
  }
  var select = document.getElementById("mode-option"); //I don't understand any of this code at all, All I know is that it works,
  for (var i = 0; i < select.children.length; i++) {	//It sets the drop down menu to what you set it to
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}
//The following are the incredibly important HTML setting functions
function setGC()
{
	var element = document.getElementById("form");
	element.setAttribute('action', "http://www.geocaching.com/seek/cache_details.aspx?wp="); 
	var element = document.getElementById("InputText");
	element.setAttribute('name', "wp"); 
	element.setAttribute('placeholder', chrome.i18n.getMessage("InputTextGC_html"));
	element.setAttribute('title', chrome.i18n.getMessage("TitleGC_html"));
	element.focus();
}
function setTB()
{
	var element = document.getElementById("form");
	element.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
	var element = document.getElementById("InputText");
	element.setAttribute('name', "tracker"); 
	element.setAttribute('placeholder', chrome.i18n.getMessage("InputTextTB_html")); 
	element.setAttribute('title', chrome.i18n.getMessage("TitleTB_html"));
	element.focus();
}




document.addEventListener('DOMContentLoaded', restore_options, true);
document.querySelector("#save").addEventListener('click', save_options);

