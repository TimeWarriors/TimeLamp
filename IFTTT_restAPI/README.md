# IFTTT_RestApi

Call this API via IFTTT to change your current status.

GUIDE:

1. Create a new IFTTT trigger with eighter Android or iOS location triggers.

2. Create a trigger for entering or exiting an area

3. Place the trigger in the buildings area.

4. Choose action channel Maker.

5. Choose to make a web request

6. Use the follow settings for your enter and exit calls:

URL: *to be decided*

Method: POST

Content Type: application/json


Body:

	{"id": "youUserID", //This can be provided by the admin for the application
	
	"presence": {{EnteredOrExited}}  //this is an ingredient you can create by clicking the bottle icon at the right corner, this 					 
						//will give true if you are entering the area, false if you exit it.
	}
