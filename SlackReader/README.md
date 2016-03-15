### How do I start up SlackReader? ###
SlackReader will automatically start when TimeLamp is initiated.
 
### How does SlackReader know which channels to act on? ###
SlackReader is listening on all channels in team "CoursePress". 
However, SlackReader won't do anything more than that if you don't tell it to.

If you want SlackReader to act on one or more specific channels you will have 
to specify the coursecodes for those channels in the file <i>courses.json</i>. <br />
**See example below for clarification**

```
{
  "codes": [
    "1dv409",
    "1dv405",
    "1dv450",
    "1dv438",
    "1dv411",
    "1dv023",
    "1dv024"
  ]
}
```

**Important!**
  The specified coursecode has to be included in the name of the created Slack-channel.<br />
  **Examples**: "1dv024-oop", "1dv406-asp_net-wf", "1dv405-databasteknik", "1dv42e-exjobbwpud".<br />
  (The coursecode doesn't have to be in the beginning of the name).


### What to do if one of the JSON-files gets undefined? ###
**In case of <i>channels.json</i> or <i>users.json</i> gets undefined.**<br />
1) Open file and erase all content. It will probably look something like this.
```
undefined
```
2) Type in start- and endbrackets.
```
[]
```
3) Restart SlackReader.

**In case of <i>courses.json</i> gets undefined.**<br />
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
