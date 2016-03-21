### How do I start up SlackReader?
SlackReader will automatically start when TimeLamp is initiated.


***

 
### How does SlackReader know which channels to act on?
SlackReader is listening on all channels in team "CoursePress". 
However, SlackReader won't do anything more than that if you don't tell it to.

If you want SlackReader to act on one or more specific channels you will have 
to specify the coursecodes for those channels in the file *[courses.json](https://github.com/TimeWarriors/TimeLamp/blob/master/SlackReader/courses.json)*. <br />
**See example below for clarification**

```
{
  "codes": [
    "1dv409",
    "1dv405",
    "1dv450"
  ]
}
```

**Important!**
  The specified coursecode has to be included in the name of the created Slack-channel.<br />
  **Examples**: "1dv024-oop", "1dv406-asp_net-wf", "1dv405-databasteknik", "1dv42e-exjobbwpud".<br />
  (The coursecode doesn't have to be in the beginning of the name).


***


### What to do if one of the JSON-files gets undefined?
**<p>In case of *[channels.json](https://github.com/TimeWarriors/TimeLamp/blob/master/SlackReader/courses.json)* or *[users.json](https://github.com/TimeWarriors/TimeLamp/blob/master/SlackReader/courses.json)* gets undefined.</p>**
1) Open file and erase all content. It will probably look something like this.
```
undefined
```
2) Type in start- and endbrackets.
```
[]
```
3) Restart SlackReader.

**<p>In case of *[courses.json](https://github.com/TimeWarriors/TimeLamp/blob/master/SlackReader/courses.json)* gets undefined.</p>**

1) Open file and erase all content. It will probably look something like this.
```
undefined
```
2) Copy code from template below and paste in file.
```
{
  "codes": [
    "type coursecode here"
  ]
}
```
3) Restart SlackReader.


***


### Things to keep in mind for the future
SlackReader has a couple of dependencies to other softwares which may cause it to stop working properly if the developers of those softwares decide to make changes to their code.

**Things to investigate if SlackReader stops working properly:**
* [Slack (Real Time Message) API](https://api.slack.com/rtm)
* [TimeWarriors TimeEdit API](https://github.com/TimeWarriors/TimeEdit)
 * Official TimeEdit Service

##### Slack API
This is probably a minor risk but still a risk. If the developers behind Slacks API decide to make major changes to their API and stops supporting the existing API-code which SlackReader uses.

##### TimeEdit
One of the major risks is all code related to TimeEdit. SlackReader uses the TimeWarriors TimeEdit API which is a webscraper, and is (of obvious reasons) dependent on the code of the official TimeEdit-service. If this happens start by updating the TimeWarriors TimeEdit API to support the new TimeEdit codestructure. When this is done update the code in SlackReader if needed.
