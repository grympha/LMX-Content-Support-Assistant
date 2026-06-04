# How to Schedule Weather Temperature Trigger Widgets

Source document: `How+to+Schedule+Weather_Temperature+Trigger+Widgets.doc`

# How to Schedule Weather/Temperature Trigger Widgets
## Scheduling Weather/Temperature Trigger Widgets
Weather Trigger, trigger-based scheduling rule that activates content only when specific weather conditions are detected, such as:
- Rain
- Clear skies
- Cloudy or stormy weather
Temperature Trigger type of trigger rule similar to the Weather Trigger, but based on temperature thresholds instead of weather conditions.
- Example triggers:
- When temperature exceeds 30°C (e.g., show cold beverage ad)
- When temperature drops below 15°C (e.g., show heater promotion)
## Steps
- Log in to the CMS – Go to https://cms.movingwalls.com/ and enter your credentials.
- Go to the Storage Page or “Create” section if the user is in the “Scheduled Content” page.
- Go to the Widget Tab – Click on the “Widgets” tab located in the top right corner to select preference widget.
- Select the chosen weather based widgets
## Configuration Page.
API Registration Link:
- Weather/ Temperature based Trigger API : https://openweathermap.org/api
- Insert the API key that has been sent to the mail from their website to the “API Key” field box
- Select the screen’s location or any desired address.
- Select “Add parameter” and select the preferred content for the chosen widget type. One content needs to be toggled as default as a base content that will play if no configured parameters are met or no connection is available.
8. Select the parameter(chosen weather, temperature)
9. Once all has been configured then just click on “Save” the schedule to publish it to the playlist.
If a widget was created from the playlist page then the user must click on the “publish” button to push it to the player
## Scheduling Weather Update Widget
Weather Update Widget is a visual content element that displays real-time weather information (e.g., temperature, weather condition, location) on digital screens. It’s typically placed on-screen alongside scheduled content to provide live updates to viewers.
API Registration Link:
- Weather Update API : https://www.weatherapi.com/
- Insert the API key received to the “api_key” field box.
- Set the frequency of API polling. (how frequent the user want the API call to get the latest update) *Lesser frequencies will use more API requests across the hours
- Select the location of the screen or any desired address. The screen will display the current information based on that selected location.
Common Issues.
- Delayed API Updates – Weather data may not refresh in real-time, causing outdated triggers.
- Incorrect Location Mapping – API may not accurately detect the correct location, affecting targeted content.
- API Rate Limits – Exceeding API request limits can result in missing weather updates.
- Trigger Misconfiguration – Incorrect parameter setup may prevent content from displaying at the right conditions.
- Network Connectivity Issues – Poor internet connection can delay or block API responses.
- Cache Retention Problems – Old weather data may persist due to caching, leading to incorrect content display.
- Unsupported Weather Conditions – API may not include specific weather conditions needed for triggering content.
- Time Zone Mismatch – Weather triggers may activate at the wrong time due to incorrect time zone settings.
