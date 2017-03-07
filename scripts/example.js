// Description:
//   Example scripts for you to examine and try out.
//
// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md
//
// Commands:
//   hubot open the (.*) doors - Open the doors to a room
//   hubot annoy me - Hey, want to hear the most annoying sound in the world?
//   hubot unannoy me - Shuts me up
//   hubot you are a little slow - Replies a minute later
//   hubot have a beer - Mmm...beer...
//   hubot sleep it off - Too much beer...

module.exports = function(robot) {
  var annoyIntervalId, answer, enterReplies, leaveReplies, lulz;
  robot.hear(/badger/i, function(res) {
    res.send("Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS");
  });
  robot.respond(/open the (.*) doors/i, function(res) {
    var doorType;
    doorType = res.match[1];
    if (doorType === "pod bay") {
      res.reply("I'm afraid I can't let you do that.");
    } else {
      res.reply("Opening " + doorType + " doors");
    }
  });
  robot.hear(/I like pie/i, function(res) {
    res.emote("makes a freshly baked pie");
  });
  lulz = ['lol', 'rofl', 'lmao'];
  robot.respond(/lulz/i, function(res) {
    res.send(res.random(lulz));
  });
  robot.topic(function(res) {
    res.send(res.message.text + "? That's a Paddlin'");
  });
  enterReplies = ['Hi', 'Target Acquired', 'Firing', 'Hello friend.', 'Gotcha', 'I see you'];
  leaveReplies = ['Are you still there?', 'Target lost', 'Searching'];
  robot.enter(function(res) {
    res.send(res.random(enterReplies));
  });
  robot.leave(function(res) {
    res.send(res.random(leaveReplies));
  });
  answer = process.env.HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING;
  robot.respond(/what is the answer to the ultimate question of life/, function(res) {
    if (answer == null) {
      res.send("Missing HUBOT_ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING in environment: please set and try again");
      return;
    }
    res.send(answer + ", but what is the question?");
  });
  robot.respond(/you are a little slow/, function(res) {
    setIntervalN(function() {
      res.send("Who you calling 'slow'?");
    }, 60 * 1000);
  });
  annoyIntervalId = null;
  robot.respond(/annoy me/, function(res) {
    if (annoyIntervalId) {
      res.send("AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH");
      return;
    }
    res.send("Hey, want to hear the most annoying sound in the world?");
    annoyIntervalId = setInterval(function() {
      res.send("AAAAAAAAAAAEEEEEEEEEEEEEEEEEEEEEEEEIIIIIIIIHHHHHHHHHH");
    }, 1000, 60); // Only run 60 times
  });
  robot.respond(/unannoy me/, function(res) {
    if (annoyIntervalId) {
      res.send("GUYS, GUYS, GUYS!");
      clearInterval(annoyIntervalId);
      annoyIntervalId = null;
    } else {
      res.send("Not annoying you right now, am I?");
    }
  });
  robot.router.post('/hubot/chatsecrets/:room', function(req, res) {
    var data, room, secret;
    room = req.params.room;
    data = JSON.parse(req.body.payload);
    secret = data.secret;
    robot.messageRoom(room, "I have a secret: " + secret);
    res.send('OK');
  });
  robot.error(function(err, res) {
    robot.logger.error("DOES NOT COMPUTE");
    if (res != null) {
      res.reply("DOES NOT COMPUTE");
      res.send(err.stack);
    }
  });
  robot.respond(/have a beer/i, function(res) {
    var beersHad;
    beersHad = robot.brain.get('totalBeers') * 1 || 0;
    if (beersHad > 4) {
      res.reply("I'm too fizzy..");
    } else {
      res.reply('Sure!');
      robot.brain.set('totalBeers', beersHad + 1);
    }
  });
  robot.respond(/sleep it off/i, function(res) {
    robot.brain.set('totalBeers', 0);
    res.reply('zzzzz');
  });
};


function setIntervalN(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}
