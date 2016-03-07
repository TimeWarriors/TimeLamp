
### lampSettings.json

This file contains proporties for lamps.

** Example **
```JSON
[
    {
        "type": "hue", // type of lamp
        "lampId": "XX", // id of hue lamp
        "roomId": "ny105" // id of which room lamp is in
    }
]
```

### modulesettings.json

This file contains proporties for nightmode and lamp color options.

* In preRoomBookingTimes you can add an object that controls color of lamps on a specific time before a booking.

* If the emit proporty in preRooBookingTimes objects is true it will emit on the time value plus a string named "time"  ex  *"time_120"*

** Example **
```JSON
{
    "nightMode": { // nightmode props.
        "startColor": 46920,
        "endColor": 25500,
        "startTime": "20:00",
        "endTime": "04:00" // this time is always the day after startTime.
    },
    "roomOccupiedColor": 0, // hue color when a room is booked.
    "roomAvalibleColor": 25500, // hue color when a room is avalible.
    "preRoomBookingTimes" : [
        {
            "time": 120, // time in minutes, minutes before booking.
            "color": 25500, // start color when clock is time before booking.
            "fade": true, // if it should fade or note.
            "pulse": false, // if it sould pulse or note.
            "emit": false // if it should send out a node EventEmitter or not.
        },

        // "time": 0, object should always be there, do it runs on booking start.
        {
            "time": 0,
            "color": 0,
            "fade": false,
            "pulse": false,
            "emit": true
        }
    ]
}
```
