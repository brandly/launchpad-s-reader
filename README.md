# Launchpad S Reader

> read input from Launchpad S MIDI controller

```shell
$ shell npm install --save launchpad-s-reader
```

## usage

```js
var LaunchpadSReader = require('launchpad-s-reader')
var launchpad = new LaunchpadSReader()

launchpad.on('press', function (e) {
  console.log('press', e)
})

launchpad.on('release', function (e) {
  console.log('release', e)
})

launchpad.on('error', function (e) {
  console.log('error', e)
})

launchpad.connect()
```
