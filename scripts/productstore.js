//var xml = require('xml-parse-from-string');

module.exports = function(robot) {
  var annoyIntervalId, answer, enterReplies, leaveReplies, lulz;
  robot.respond(/store (.*)/i, function(res) {
    var productStore;
    productStore = res.match[1];
    var baseUrl = "https://productstore.sweetspot" + productStore + ".com/"
    var jsonUrl = baseUrl + "products.json"
    return res.http(jsonUrl)
      .get()(function(err, response, body) {
      if(err) {
        res.send("Error finding product store");
        res.send(res.statusCode);
        return;
      }
      var productsJson = JSON.parse(body);
      try {
        productsJson.forEach(function(element) {
            res.send(element.name);
        }, this);
      } catch(error) {
        res.send('Error displaying productStore info');
        res.send(error.stack);
      }
    });
  });
};
