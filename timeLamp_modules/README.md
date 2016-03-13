
### timeLamp module guide.

If you want to make a new timeLamp_module you will need thees.


* An **"exports.run"** this will return a new instance of your module it will also reive a object that cointaions a couple of instances of other classes.

```javascript
exports.run = function(functionLayer){
    return new Nightmode(functionLayer);
};
```
**Example of functionLayer classes**
```javascript
functionLayer = {
    nodeSchedule, // make and cancel node schedules
    emitter,      // get the global emitter
    TimeeditDAL,  // read schedule from timeLamp
    settings,     // read moduleSettings or lampSettings
    lightHandler  // control the lamps
};
```
* An **"init()"** function, the init function is the function that will be run x times a day so the starting point of your module should be the init() function.


In the folder moduleLoader open moduleLoader.js and require your in the requireModules() function

**Example of moduleLoader.js and requireModules()**
```javascript
requireModules(){
    this.timeLampModules.push(
        require('../timeLamp_modules/saturationStartChange.js').run(this._),
        require('../timeLamp_modules/changeColorWithTime.js').run(this._),
        require('../timeLamp_modules/nightmode.js').run(this._)
        // <= Require your timeLamp_module here.
    );
}
```
