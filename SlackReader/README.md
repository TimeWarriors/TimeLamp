### How do I start up SlackReader? ###
SlackReader will automatically start when TimeLamp is initiated.
 
### How does SlackReader know which channels to act on? ###
SlackReader is listening on all channels in team "CoursePress". 
However, SlackReader won't do anything more than that if you don't tell it to.

If you want SlackReader to act on one or more specific channels you will have 
to specify the coursecodes for those channels in the file <i>courses.json</i>. <br />
**See example below for clarification:**

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
