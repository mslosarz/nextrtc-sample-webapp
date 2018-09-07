const NextRTC = require('nextrtc-js-client');
const $ = require('jquery');

window.app = {
  createConversation: function () {
    var convId = $('#convId').val();
    nextRTC.create(convId);
  },
  createBroadcastConversation: function () {
    var convId = $('#convId').val();
    nextRTC.create(convId, {type: 'BROADCAST'});
  },
  joinConversation: function () {
    var convId = $('#convId').val();
    nextRTC.join(convId);
  },
  leaveConversation: function () {
    $('.remotestream').remove();
    nextRTC.leave();
  },
  upperCase: function () {
    var convId = $('#convId').val();
    nextRTC.upperCase(convId);
  }
};

NextRTC.prototype.upperCase = function upperCase(content, custom) {
  this.channel.send({signal: 'upperCase', content: content, custom: custom});
};

var nextRTC = new NextRTC({
  wsURL: 'wss://' + location.hostname + (location.port ? ':' + location.port : '') + '/signaling',
  mediaConfig: {
    video: true,
    audio: false,
  },
  peerConfig: {
    iceServers: [
      {urls: "stun:23.21.150.121"},
      {urls: "stun:stun.l.google.com:19302"},
      {urls: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis@mozilla.com"}
    ],
    iceTransportPolicy: 'all'
  }
});

nextRTC.on('upperCase', function (event) {
  $('#convId').val(event.content);
});

nextRTC.on('created', function (event) {
  $('#log').append('<li>Room with id ' + event.content + ' has been created, share it with your friend to start videochat</li>');
});

nextRTC.on('joined', function (event) {
  $('#log').append('<li>You have been joined to conversation ' + event.content + '</li>');
});

nextRTC.on('newJoined', function (event) {
  $('#log').append('<li>Member with id ' + event.from + ' has joined conversation</li>');
});

nextRTC.on('localStream', function (stream) {
  var dest = $("#template").clone().prop({id: 'local'});
  $("#container").append(dest);
  dest[0].srcObject = stream.stream;
  dest[0].muted = true;
});

nextRTC.on('remoteStream', function (stream) {
  var dest = $("#template").clone().addClass('remotestream').prop({id: stream.member});
  $("#container").append(dest);
  dest[0].srcObject = stream.stream;
});

nextRTC.on('left', function (event) {
  nextRTC.release(event.from);
  $('#' + event.from).remove();
  $('#log').append('<li>' + event.from + " left!</li>");
});

nextRTC.on('error', function (event) {
  $('#log').append('<li>Something goes wrong! ' + event.content + '</li>')
});

