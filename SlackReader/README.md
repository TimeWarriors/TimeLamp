# How do I start up SlackReader? #
<p>SlackReader will automatically start when TimeLamp is initiated.</p>
 
# How does SlackReader know which channels to check?#
<p>If you want SlackReader to check one or more channels you will have 
to specify the coursecodes for those channels in the file *courses.json*.
See example below for clarification:</p>

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
  <p>The specified coursecode has to be included in the name of the created Slack-channel.</p>
  Examples: "1dv024-oop", "1dv406-asp_net-wf", "1dv405-databasteknik", "1dv42e-exjobbwpud".
  (The coursecode doesn't have to be in the beginning of the name).
