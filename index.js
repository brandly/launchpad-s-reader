var EventEmitter = require('events').EventEmitter
var util = require('util')
var MidiInput = require('midi').input

module.exports = LaunchpadSReader

function LaunchpadSReader () {
  this.input = new MidiInput()
}

util.inherits(LaunchpadSReader, EventEmitter)
var rls = LaunchpadSReader.prototype

rls.connect = function () {
  var count = this.input.getPortCount()

  if (!count) {
    return this.emitError('Unable to find MIDI input port')
  }

  var port = this.findLaunchpadPort(count)

  if (port === null) {
    return this.emitError('Unable to find Launchpad S')
  }

  this.input.on('message', this.handleMessage.bind(this))
  this.input.openPort(port)
}

rls.handleMessage = function (deltaTime, message) {
  var eventName = (message[2] === 127) ? 'press' : 'release'
  var button = getButtonName(message[0], message[1])

  var data = {
    button: button,
    deltaTime: deltaTime,
    message: message
  }

  if (button === 'block') {
    var coords = getBlockCoords(message[1])
    data.x = coords.x
    data.y = coords.y
  }

  this.emit(eventName, data)
}

rls.emitError = function (message) {
  this.emit('error', { message: message })
}

rls.disconnect = function () {
  this.input.closePort()
}

rls.findLaunchpadPort = function (numberOfPorts) {
  for (var i = 0; i < numberOfPorts; i++) {
    if (this.input.getPortName(0) === 'Launchpad S') {
      return i
    }
  }
  return null
}

var topRowNames = [
  'up',
  'down',
  'left',
  'right',
  'session',
  'user1',
  'user2',
  'mixer'
]

var rightColumnNames = [
  'vol',
  'pan',
  'sndA',
  'sndB',
  'stop',
  'trkOn',
  'solo',
  'arm'
]

function getButtonName (a, b) {
  if (a === 176) {
    return topRowNames[b - 104]
  } else if ((b - 8) % 16 === 0) {
    return rightColumnNames[(b - 8) / 16]
  }

  return 'block'
}

function getBlockCoords (b) {
  var mod = b % 16
  return {
    x: mod,
    y: (b - mod) / 16
  }
}
