##LightHandler

###Installation
Make sure to have installed timeLamp according to its readme. And make sure to have the username for your philips hue bridge ready. If you haven't created a user on your please see: http://www.developers.meethue.com/documentation/getting-started on how to create a user.

When done create a json-file named "config.json" with the attributes: 
* "hueIp" with a value thats equal to the ip to the philips hue bridge
* "userName" with a value thats equal to a user that you created on the philips hue bridge.

the json-file should look something like this
```
{
  "hueIp":"ex-ip-adress.se",
  "userName":"2adsad343124124"
}
```

###Functions

* **getHueLamps()** - returns a json-object with all hue lamps registered on the bridge as well as the lamps attributes and configurations.

* **getHueLampById(id)** - returns a json object containing information about a lamp specified by an id.

* **changeBrightness(lampId, brightness, secondsToChange)** - changes the brightness of the specified lamp transitioning over specified seconds(secondsToChange). Brightness can be set to 0-255.

* **changeSaturation(lampId, saturation, secondsToChange)** - changes the saturation of the specified lamp transitioning over specified seconds(secondsToChange). saturation can be set to 0-255.

* **On(lampId, status)** - turns the lamp on(status = true) or off(status = false)

* **setWarning(lampId, blinkrate, seconds, hue)** - sets a specified lamp(lampId) to blink for x amount of seconds. blinkrate is in milliseconds and specifies how fast the lamp should blink, seconds for how long it should blink/pulsate and hue(0-65535) is for what color it should blink/pulsate.

* **changeColorWithHue(lampId, hue, secondsToChange)** - changes the color of the lamp to a specified value: hue(0-65535) transitioning from its current color into the new color over specified amount of time in seconds(secondsToChange).
