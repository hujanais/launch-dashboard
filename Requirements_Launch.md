### These are the requirements for the /launch route only.

1.  Data is downloaded once every 1/2 hour and saved to a temporary json file in LocalStorage.
2.  We are interested only with items with GoForLaunch LaunchStatus.
3.  On the dashboard, show a meta-data for each of the upcoming launches with a countdown.  This list will be re-synced 
when the new data is downloaded.
4.  Currently there is a launchApi.ts for the endpoint access and /Pages/LaunchPage dashboard. 

Follow-on Questions.
Data refresh behavior: should the app auto-fetch every 30 minutes in the background (no button), or keep a manual Refresh button as well? > auto-refresh only.  if manual refresh needed, user will just refresh the browser.
Launch status filter: requirement says only GoForLaunch; do you want hard filtering by status.name === "Go for Launch" client-side too (in case API returns mixed statuses)? >> status.name === "Go for Launch"
Card density: for a minimal UI, should each card show only core info (mission, provider, NET, countdown, location) and move extra fields to details view? keep the current summary card data and just re-style.
Visual style: do you prefer light, dark, or auto/system theme for the /launch page? dark theme
Layout preference: one-column stacked cards (mobile-first minimal) or responsive grid (2-3 columns on desktop)? >> mobile first 
Countdown behavior: when countdown goes below zero, should it display Liftoff/TBD instead of negative time? show negative time is ok.
LocalStorage policy: should cached data include a timestamp so we can detect stale cache and force re-sync at startup? no, re-sync at startup.

