//NEW Google Analytics 4 Code
//https://developer.chrome.com/docs/extensions/how-to/integrate/google-analytics-4
//Please note this code is duplicated in service_worker.js to track some events

//Create Unique ID for user
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


// Track Session Function
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



//Analytics Function
const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const MEASUREMENT_ID = `G-SEYPQDQBKQ`;
const API_SECRET = `l1-nLvpRRRqA2_k6xs4Txw`;
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

window.addEventListener("load", async () => {
  fetch(`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
  {
    method: "POST",
    body: JSON.stringify({
      client_id: await getOrCreateClientId(),
      events: [
        {
          name: "page_view",
          params: {
            session_id: await getOrCreateSessionId(),
            engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
            page_title: document.title,
            page_location: document.location.href
          },
        },
      ],
    }),
  });
});

//Capture the Submission
//But first we must wait for the page to load because it will error as NULL if we dont
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("SearchButton").addEventListener('click', async () => {
        fetch(
        `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
        {
            method: 'POST',
            body: JSON.stringify({
            client_id: await getOrCreateClientId(),
            events: [
                {
                name: 'search',
                params: {
                    session_id: await getOrCreateSessionId(),
                    engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                    id: localStorage["preferred_option"],
                },
                },
            ],
            }),
        }
        );
    });
});