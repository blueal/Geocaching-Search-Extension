/* This background page has been converted to service worker
 * as required by manifest v3
 *
 * Information about event pages is available here 
 * http://developer.chrome.com/extensions/event_pages.html
 */

//var selectedText;

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

async function onClickHandler(info, tab) {

	//Run some Analytics
	runAnalyticsEvent("onClickHandler", info.menuItemId)
	
	if (info.menuItemId == "GC") {
		//GC Click Handler
		
		if (info.selectionText.match(/^[a-zA-Z0-9]+$/)) {
			var url = 'https://www.geocaching.com/seek/cache_details.aspx?wp=' + info.selectionText;
			//opens new tab 
			chrome.tabs.create({
				url: url
			});
			return;
		}
		else
		{
			return;
			
		}	
	}
	if(info.menuItemId == "TB") {
		//TB click handler
		
		/*Checking if you just selected useless garbage*/
		if (info.selectionText.match(/^[a-zA-Z0-9]+$/)) {
			var url = 'https://www.geocaching.com/track/details.aspx?tracker=' + info.selectionText;
			//opens new tab 
			chrome.tabs.create({
				url: url
			});
			return;
		}
		else
		{
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
	chrome.storage.local["identified_language"] = chrome.runtime.getManifest().current_locale;
	chrome.storage.local["preferred_option"] = "trackable";

	//Analytics Startup
	runAnalyticsEvent("onInstalled", "Startup")
	
}


//NEW event page event listeners
chrome.contextMenus.onClicked.addListener(onClickHandler);
chrome.runtime.onInstalled.addListener(Startup);
chrome.runtime.onUpdateAvailable.addListener(function (){chrome.runtime.reload;})



