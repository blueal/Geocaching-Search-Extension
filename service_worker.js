/* This background page has been converted to service worker
 * as required by manifest v3
 *
 * Information about event pages is available here 
 * http://developer.chrome.com/extensions/event_pages.html
 */


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

/**runAnalyticsEvent
 * @param {string} eventName - Name of the Event.
 * @param {string} eventID - ID of the event.
 * 
 * Must remove the "this" from getOrCreateSessionID or else it will error
 */
async function runAnalyticsEvent(eventName, eventID) {

	async function getOrCreateClientId() {
		const result = await chrome.storage.local.get('clientId');
		let clientId = result.clientId;
		if (!clientId) {
			// Generate a unique client ID, the actual value is not relevant
			clientId = self.crypto.randomUUID();
			await chrome.storage.local.set({clientId});
		}
		return clientId;
	}

	const SESSION_EXPIRATION_IN_MIN = 30;

	async function getOrCreateSessionId() {
		// Store session in memory storage
		let {sessionData} = await chrome.storage.session.get('sessionData');
		// Check if session exists and is still valid
		const currentTimeInMs = Date.now();
		if (sessionData && sessionData.timestamp) {
			// Calculate how long ago the session was last updated
			const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
			// Check if last update lays past the session expiration threshold
			if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
			// Delete old session id to start a new session
			sessionData = null;
			} else {
			// Update timestamp to keep session alive
			sessionData.timestamp = currentTimeInMs;
			await chrome.storage.session.set({sessionData});
			}
		}
		if (!sessionData) {
			// Create and store a new session
			sessionData = {
			session_id: currentTimeInMs.toString(),
			timestamp: currentTimeInMs.toString(),
			};
			await chrome.storage.session.set({sessionData});
		}
		return sessionData.session_id;
	}

	const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
	const MEASUREMENT_ID = `G-SEYPQDQBKQ`;
	const API_SECRET = `l1-nLvpRRRqA2_k6xs4Txw`;
	const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

	fetch(
		`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
		{
			method: "POST",
			body: JSON.stringify({
				client_id: await getOrCreateClientId(),
				events: [
					{
						name: eventName,
						params: {
							session_id: await getOrCreateSessionId(),
							engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
							id: eventID,
						},
					},
				],
			}),
		}
	);
}

/**
 * Context Menu Click Handler. Refer to API documention
 * https://developer.chrome.com/docs/extensions/reference/api/contextMenus
 * @param {*} info 
 * @param {*} tab 
 * @returns 
 */
async function onClickHandler(info, tab) {
	const selectedOption = info.menuItemId;
	const selectedText   = info.selectionText;
	if(selectedText.match(/^[a-zA-Z0-9]+$/)) {
		//Well, it's not garabge. We'll process the input.
		if (selectedOption == GEOCACHE_OPTION) {
			var url = GEOCACHE_SEARCH_URL + selectedText;
		}
		else if (selectedOption == TRACKABLE_OPTION) {
			var url = TRACKABLE_SEARCH_URL + selectedText;
		}
		else {
			console.error("Invalid Contaxt Menu Option: " + selectedOption)
		}
	}
	else {
		console.log("Invalid Text Selected: " + selectedText)
		return;
	}

	//Run some Analytics
	runAnalyticsEvent("onClickHandler", selectedOption)

	chrome.tabs.create({
		url: url
	});
}

function Startup() {
	chrome.contextMenus.create({
	 "title":"GC",
	  "contexts":["selection"],
	  "id": GEOCACHE_OPTION,
	});  
	chrome.contextMenus.create({
	  "title":"TB",
	  "contexts":["selection"],
	  "id": TRACKABLE_OPTION,
	});
	
	//Setting up some initial settings
	chrome.storage.local["identified_language"] = chrome.runtime.getManifest().current_locale;

	//Analytics Startup
	runAnalyticsEvent("onInstalled", "Startup")
	
}


//NEW event page event listeners
chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(Startup);
chrome.runtime.onUpdateAvailable.addListener(function (){chrome.runtime.reload;})



