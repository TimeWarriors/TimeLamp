# IFTTT_RestApi

Call this API via IFTTT to change your current status.

GUIDE:

1. Create a new IFTTT trigger with eighter Android or iOS location triggers.

2. Create a trigger for entering or exiting an area

3. Place the trigger in the buildings area.

4. Choose action channel Maker.

5. Choose to make a web request

6. Use the follow settings for your enter and exit calls:

<b>URL:</b> *TBD*/update/yourUserID/{{EnteredOrExited}}

yourUserID - this is an ID written in the usersettings.json

{{EnteredOrExited}} - this is an ingridient you can include on IFTTT on the right side of the url input field, this will be true if you entered the area and false if you left the area.

<b>Method:</b> POST

<b>Content Type:</b> Not required

<b>Body:</b> Not required
