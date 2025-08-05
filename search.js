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

// Saves options to localStorage.
/**
 * Manages Saved Option storage and retrieval using the `chrome.storage.sync` API.
 * This function can act as both a getter and a setter.
 * @async
 * @function getOrSetOptionToStorage
 * @param {string} option 
 * @returns {Promise<string|void>} - MUST USE AWAIT, returns current saved option as string that must be resolved from a promise object
 */
async function getOrSetOptionToStorage(option) {
    if (option !== null && option !== undefined && option !== '') {
        await chrome.storage.sync.set({ [OPTION_STORAGE_LOCATION]: option });
    }
    const result = await chrome.storage.sync.get(OPTION_STORAGE_LOCATION);
    return result[OPTION_STORAGE_LOCATION];
}

/**
 * Saves the currently selected option from the dropdown menu to Chrome storage.
 * Updates the form UI based on the selected option and displays a status message.
 * If the selected option is invalid, reloads the extension.
 * If the selected option is already set, resets the form without saving.
 *
 * @async
 * @function saveOptions
 * @returns {Promise<void>} Resolves when the option is saved and the form/status are updated.
 */
async function saveOptions() {
	const select         = document.getElementById("mode-option");
	const selectedOption = select.children[select.selectedIndex].value;
	const currentSetting = await getOrSetOptionToStorage();

	switch(selectedOption){
		case currentSetting:
			console.log("Selected Option: " + selectedOption + " is already set to " + currentSetting + " Reset the form.");
			setForm(selectedOption);
			return;
		case GEOCACHE_OPTION:
			setForm(GEOCACHE_OPTION);
			break;
		case TRACKABLE_OPTION:
			setForm(TRACKABLE_OPTION);
			break;
		default:
			//Invalid Selected Option. HTML is broken.
			console.error("Invalid Option In Selection Menu: " + selectedOption)
			chrome.runtime.reload()
			return;
	}
	console.log("Set Form to: " + selectedOption);
	await getOrSetOptionToStorage(selectedOption);
	console.log("Saved Option: " + selectedOption + " to storage.");
	setStatus();
	return;
}

/**
 * Restores the form state from storage by retrieving the saved option.
 * Sets the form based on the retrieved option, or defaults to DEFAULT_OPTION if no valid option is found.
 * Handles errors during retrieval and logs them to the console.
 *
 * @async
 * @function setFormFromStorage
 * @returns {Promise<void>} Resolves when the form state has been set.
 */
async function setFormFromStorage() {
	try{
		const SAVED_OPTION = await getOrSetOptionToStorage();
		switch (SAVED_OPTION) {
			case GEOCACHE_OPTION:
				setForm(GEOCACHE_OPTION);
				break;
			case TRACKABLE_OPTION:
				setForm(TRACKABLE_OPTION);
				break;
			default:
				console.log("No Valid Option to Restore: " + SAVED_OPTION + "\nSetting to DEFAULT_OPTION: " + DEFAULT_OPTION);
				await getOrSetOptionToStorage(DEFAULT_OPTION);
				setForm(DEFAULT_OPTION);
				break;
		}
		return;
	}
	catch (error) {
		console.warn("Failed to retrieve SAVED OPTION: " + error)
		//If we can't get the saved option, just set it to the default. Assume storage is not broken.
		await getOrSetOptionToStorage(DEFAULT_OPTION);
		setForm(DEFAULT_OPTION);
		return;
	}
}

/**
 * Updates the input box and dropdown menu based on the selected option.
 *
 * Sets the placeholder and title of the input box according to the provided option,
 * and updates the dropdown menu selection to match the option.
 *
 * @param {string} option - The selected option, expected to be either GEOCACHE_OPTION or TRACKABLE_OPTION.
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


/**
 * Displays a status message in the element with id "status" and fades it out after a specified duration.
 *
 * @param {string} [message] - The message to display. If omitted, uses a localized default message.
 * @param {number} [duration] - Duration in milliseconds before the message fades out. Defaults to 2400ms.
 * @returns {void} Resolves when the status message is displayed and the timer is set.
 */
function setStatus(message, duration) {
	const DEFAULT_DURATION = 2400; // Default duration for fade out in milliseconds
    const DEFAULT_MESSAGE = chrome.i18n.getMessage("Status_html");
	const status = document.getElementById("status");
    const msg = typeof message === 'undefined' ? DEFAULT_MESSAGE : message;
    const fadeDelay = typeof duration === 'undefined' ? DEFAULT_DURATION : duration; // Default to 2 seconds

    // Reset fade and timer
    status.classList.remove('fade-out');
    clearTimeout(status._fadeTimeout);

    // Set message
    status.innerHTML = msg;

    // Remove any previous transitionend handler
    status.removeEventListener('transitionend', status._fadeHandler);

    // Define and store the handler so it can be removed later
    status._fadeHandler = function(e) {
        if (e.propertyName === 'opacity') {
            status.innerHTML = "";
            status.classList.remove('fade-out');
            status.removeEventListener('transitionend', status._fadeHandler);
        }
    };

    // Start fade after delay
    status._fadeTimeout = setTimeout(() => {
        status.addEventListener('transitionend', status._fadeHandler);
        status.classList.add('fade-out');
    }, fadeDelay);

    return;
}

/**
 * Handles the search
 * @param {string} input - The search box input.
 * @returns {Promise<void>} Resolves when the search is handled.
 */
async function search(input){
	const searchText     = input.trim(); // Removes leading and trailing whitespace from input
	const CURRENT_OPTION = await getOrSetOptionToStorage();
	var searchUrl        = "";
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