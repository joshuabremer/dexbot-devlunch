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
//   dexbot remind notetaker @User

var moment = require('moment');

module.exports = function(robot) {
  var standupTime = robot.brain.get('standupTime');
  if (!standupTime) {
    robot.brain.set('standupTime', '09:30');
  }


  robot.respond(/when is standup/i, function(res) {
    res.reply(robot.brain.get('standupTime'));
  });

  robot.respond(/change standup time to (.*)/i, function(res) {
    var newStandupTime = res.match[1];
    robot.brain.set('standupTime', newStandupTime);
    res.reply(robot.brain.get('standupTime'));
  });

  robot.respond(/remind notetaker (.*)/i, function(res) {
    var standupTime = robot.brain.get('standupTime');
    var standupDateTime = moment(standupTime, 'HH:mm').add(7, 'hours').add(1,'day').format();
    var millisecondsUntilStandup = standupDateTime.diff(moment());
    var TEN_MINUTES = 1000 * 60 * 60;
    var noteTaker = res.match[1];
    setTimeout(function() {
      res.send(noteTaker + ' hey, standup is in ten minutes. Get ready to take notes.');
    }, millisecondsUntilStandup - TEN_MINUTES);
  });

};

