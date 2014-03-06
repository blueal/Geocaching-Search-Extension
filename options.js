/*
*All of this code is for the Option Selection
*I would comment everything but Im too lazy to do that
*
*If you have ANY comments or questions (even not related to this), 
*contact Geocaching User blueal at "blueal@outlook.com"
*
*Use setStatus(Message, Duration) in the javascript console 
*to make a status message appear!
*
*
*/

/*Persistent Global Variables*/
var _number = 0,
_again = 15,
_REPEAT = false,
_running = false,
_duration;

/*Static Variables*/
var _DefaultFadeDelay = 2400;

// Saves options to localStorage.

function save_options() {
	select = document.getElementById("mode-option");
	var mode = select.children[select.selectedIndex].value;  //mode is what you have selected
	var current_setting = localStorage["preferred_option"];   //current setting saved into local storage

	if (current_setting == mode) //checks if your setting the option to what its already set to. Which is Impossible Now
	{
		//It Is Impossible to run this code now since the "set" button doesn't exist
		var a = getId("InputText");
		var a1 = a.getAttribute("name");
		

		if (a1 == "tracker" && current_setting == "geocache" || a1 == "wp" && current_setting == "trackable")
		//Checks if current_setting and what is actually set, is out of sync.
		{
			//This code will ONLY be run if something terrible has happened to the HTML
			//Putting this code in was completely unnecessary but I felt like being a good programmer and error proofing my code
			//Although now I should remove all this since it is impossible to run this section of code
			localStorage["preferred_option"] = mode
			setStatus();
			//Update HTML stuff
			if (mode == "geocache")
			{
				setGC();
				console.warn("HTML Out of sync, Changed Everything To Option Selected");
				return;
			}
			else if (mode == "trackable")
			{
				setTB();
				console.warn("HTML Is Out Of Sync, Changed Everything To Option Selected");
				return;
			}
			else
			{
				//It is EXTREMELY unlikely (if even possible) that you will get to this section of code
				ErrorOccured();
				return;
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
					console.warn("Button is being spammed, finally giving the user what it wanted");
				}
				else if (mode == "trackable")
				{
					setTB();
					console.log("Button is being spammed, finally giving the user what it wanted");
				}
				_number = 0;
				_again++
				localStorage["preferred_option"] = mode
				setStatus();
				return;
			}
		}
	}
	else if (mode == "trackable" || mode == "geocache") //checks if you didn't fuck with the HTML
	{
		//this is the actual code that will run when you click the Save/Set button (or when you change the option)
		_number = 0;
		localStorage["preferred_option"] = mode
		setStatus();
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
		else //impossible to get here as we already checked for this error
		{
			//100% impossible to get here
			ErrorOccured(true);
		}
	}
	else //You or something else has fucked with the HTML, reload the page
	{
		ErrorOccured();
	}
}



//restores options
function restore_options() {
  var favorite = localStorage["preferred_option"];
  if (favorite == "geocache")
	{
		setGC();
//		console.log("Changed Form Values to Geocache as per Setting")
	}
	else if (favorite == "trackable")
	{
		setTB();
//		console.log("Changed Attributes to Trackable as per Setting");
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
		//lets update the status
		setStatus("Error Resolved", 5000);
	}
  if (!favorite) {
    return;
  }
  var select = getId("mode-option");
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
	var element = getId("form");
	element.setAttribute('action', "http://www.geocaching.com/seek/cache_details.aspx?wp="); 
	var element = getId("InputText");
	element.setAttribute('name', "wp"); 
	element.setAttribute('placeholder', chrome.i18n.getMessage("InputTextGC_html"));
	element.setAttribute('title', chrome.i18n.getMessage("TitleGC_html"));
}
function setTB()
{
	var element = getId("form");
	element.setAttribute('action', "http://www.geocaching.com/track/details.aspx?tracker="); 
	var element = getId("InputText");
	element.setAttribute('name', "tracker"); 
	element.setAttribute('placeholder', chrome.i18n.getMessage("InputTextTB_html")); 
	element.setAttribute('title', chrome.i18n.getMessage("TitleTB_html"));
}

/*Sence we use the getElementById method a lot, lets turn it into a function*/
function getId(id)
{
	return document.getElementById(id);
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

	var status = getId("status");
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


/*Just a bit of Error Handling*/
function ErrorOccured(crtical)
{

	var errors = localStorage['Critical_Error'];
	if(critical == true)
	{
		//Something of epic puportions has occured, This is beyond a critical error
		alert("!!KABOOM!! The extension has occured a epic failure, please contact the creater of the extension immediately");
		alert("Seriously, the extension just managed to do something that is impossible");
		window.location.reload(true);
		return;
	}
	if(typeof errors === 'undefined')
	{
		//1st error ever has occured
		localStorage['Critical_Error'] = 1;
		localStorage['preferred_option'] = "trackable";
		window.alert("A Crtical Error Has Occured, The Extension Will Now Restart");
		window.location.reload(true);
		return;
	}
	else
	{
		//An Error Has Occured Before
		if(errors >= 4)
		{
			errors = 0;
			localStorage['Critical_Error'] = errors;
			localStorage['preferred_option'] = "trackable";
			//This is a recurring issue, we need to tell the User to reinstall the extension
			alert("Something terrible has happened to the Extension. If This Error Is Occurring Regularly, Please Reinstall The Extension");
			window.location.reload(true);
			return;
		}
		else
		{
			//An Error has occured before but no more then 3 times
			errors++
			localStorage['Critical_Error'] = errors;
			localStorage['preferred_option'] = "trackable";
			alert("A Critical Error Has Occured, The Extension Will Now Restart");
			window.location.reload(true);
			return;
		}
	}
}


/* Event Listeners */

document.addEventListener('DOMContentLoaded', restore_options, true);
document.querySelector("#mode-option").addEventListener('change', save_options);
document.querySelector("#InputText").addEventListener('blur', function (){document.getElementById("InputText").focus();}); 
//The above is so the input box ALWAYS has focus