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
//   dexbot trimet

var APP_ID = process.env.HUBOT_TRIMET_API_KEY;
var fetch = require('node-fetch');
var parser = require('xml2json');
var moment = require('moment');

module.exports = function(robot) {

  robot.respond(/trimet-list (.*)/i, function(res) {
    var match = res.match[1];
    res.reply('(WIP) listing ' + match);
  });

  robot.respond(/\btrimet\b/i, function(res) {
    var name = res.message.user.name.toLowerCase();

    if(name.indexOf('peter') > -1) {
      var url = 'https://developer.trimet.org/ws/V1/arrivals?locIDs=7586&appID=' + APP_ID;

      fetch(url).then(function(trimetResp) {
          trimetResp.text().then(function(body) {
            var json = JSON.parse(parser.toJson(body));
            var filteredArrivals = json.resultSet.arrival.filter(function(arrival) {
              return arrival.route === "35";
            });

            var response = filteredArrivals.reduce(function(acc, val) {
              var date = moment(parseInt(val.estimated || val.scheduled));

              return acc + ' ' + date.format('h:mm A') + ',';
            }, 'Your next arrivals are at (estimated):');

            res.reply(response);
        });

      });
    } else {
      res.reply('Hmmm... not enough info, try "trimet-list stopID"');
    }



  });

};

