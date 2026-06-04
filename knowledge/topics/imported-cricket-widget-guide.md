# Cricket Widget Guide

Source document: `Cricket+Widget+Guide.doc`

# Cricket Widget Guide
Cricket widgets can be used display live scores and match schedules on the player by using a valid GoalServe API key
### How to schedule the Cricket Widget to a Playlist
Steps to Get Started:
Scheduling the widget on CMS Platform
- Navigating to the Widget
Go to the widget section under Storage and select the “CRICKET” widget. Click the “Schedule content” button below to configure it.
2 . Enter the API Key
- Input the valid API key from GoalServe (steps are below).
- After entering the key, click the "Search" button.
Enable League and Match Options
- Once the API key is verified, the League and Match selection options will be enabled for further selection.
Select the League
- The user selects a league from the dropdown or list.
Display Matches Based on League
- Once a league is selected, the system will display matches related to that league.
- The user can then select a specific match from the filtered list. It will show the updates of that specific match during live broadcast.
- *No updates will be shown if the match time has not started.
## Optional Stats Display
- Upcoming Matches Info
Allow the user to enter the number of upcoming matches to be displayed on the player side.
Example:  If the input is 3, then the player will show 3 upcoming matches.
No Matches Case:
*If there are no upcoming matches available, display the message: Upcoming match list not found under the selected league.
- Points Table Info
Allow the user to display another page that shows the standings of teams in a table.
- Loop_sec is to set the loop duration between displaying those 2 or 3 info page
- Custom Sponsor is so set the Logo placed below the statistics page
________________________________________________________________________________________________________
# GOALSERVE API Key generation :
#### 1. Go to the GoalServe Webpage to register an API key
- Click on this link to access the webpage.
- On that page, you can create an account and generate your API key.
#### 2. Generate the API Key
- After registration, log in to Goalserve.
- Follow the instructions to generate your cricket API key
#### 3. Activate the Live Score Widget
- Once the API key is validated, the system will automatically start displaying live cricket scores on the player using the widget.
