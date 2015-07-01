$(document).ready(function(){
  window.app = {};

  app.messages = [];

  app.rooms = {'All Rooms': true};

  app.selectedRoom = 'All Rooms';

  app.friends = {};

  app.init = function() {
    // What should I be doing you guys?
    app.fetch();
    setInterval(app.fetch, 2000);
  };

  app.send = function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://127.0.0.1:3000/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  app.fetch = function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://127.0.0.1:3000/1/classes/chatterbox',
      type: 'GET',
      success: function (data) {
        console.log('chatterbox: Message fetched ');
        app.messages = data.results;
        app.update();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message');
      }
    });
  };

  app.clearMessages = function() {
    $('#chatterbox').empty();
  };

  app.addMessage = function() {
    var username = window.location.search.substring(window.location.search.indexOf('=')+1);
    var message = {
      username: username.replace('%20', ' '),
      text: $('#input').val(),
      roomname: app.selectedRoom
    };
    app.send(message);
    $('#input').val('');
  };

  app.addRoom = function(room) {
    //Set up a new room.
    app.selectedRoom = room;
    app.rooms[room] = true;
    app.update();
  };

  app.update = function () {
    // This updates Messages
    app.clearMessages();
    $.each(app.messages, function(i, message){
      var fixedRoomName = message.roomname || 'Main';
      fixedRoomName = fixedRoomName.replace(' ', '');
      app.rooms[fixedRoomName] = true;
      var $message = $('<div class="message"></div>');
      $message.addClass(fixedRoomName);
      var $text = $('<div></div>').text(message.text === undefined ? '--------' : message.text).addClass('text');
      var $user = $('<div class="username"></div>').text(message.username === undefined ? 'WHO ARE YOU?' : message.username);
      $message.append($text).append($user);
      if (app.friends[message.username]) $message.addClass('friend');
      $('#chatterbox').append($message);
    });
    //This updates Rooms
    $('#roomList').empty();
    $.each(Object.keys(app.rooms), function(i, key){
      var $room = $("<div></div>").text(key).addClass('room').data('room', key);
      $('#roomList').append($room);
    });
    app.setRoom();
  };

  app.setRoom = function(){
    if (app.selectedRoom === 'All Rooms') {
      $('.message').show();
    } else {
      $('.message').hide();
      $('.'+app.selectedRoom.replace(' ', '')).show();
    }
  };

  $('.send').on('click', function(e) {
    app.addMessage();
  });

  $('#changeID').on('click', function(){
    window.location.search = '';
  });

  $('#roomList').on('click', '.room' ,function(e){
    app.selectedRoom = $(e.target).data('room');
    app.setRoom();
  });

  $('#chatterbox').on('click', '.username', function(e) {
    if (app.friends[$(e.target).text()] !== true) {
      app.friends[$(e.target).text()] = true;
      var $friend = $('<div></div>').text($(e.target).text());
      $('#friendList').append($friend);
    }
  });

  $('#addRoom').on('click', function(){
    var room = prompt('Room Name:');
    app.addRoom(room);
  });

  app.init();
});
