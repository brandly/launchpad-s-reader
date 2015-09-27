var LaunchpadSReader = require('./')
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
