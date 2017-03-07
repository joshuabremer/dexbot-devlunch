var JIRA_USERNAME = process.env.HUBOT_JIRA_USERNAME;
var JIRA_PASSWORD = process.env.HUBOT_JIRA_PASSWORD;

module.exports = function(robot) {
  robot.respond(/(ROG-\d{1,5})/i, function(res) {
    var ticketKey = res.match[1].toUpperCase();
    var jiraUrl = 'https://jira.sweetspotdiabetesops.com:8443/rest/api/latest/issue/' + ticketKey + '?expand=names';
    res.send("Asking JIRA for " + ticketKey + '...');
    robot.logger.debug('Requesting: ' + jiraUrl);
    return res.http(jiraUrl)
      .auth(JIRA_USERNAME, JIRA_PASSWORD)
      .get()(function(err, response, body) {
      if(err) {
        res.send("Error retrieving JIRA ticket");
        res.send(res.statusCode);
        return;
      }
      var jiraBody = JSON.parse(body);
      var url = 'https://jira.sweetspotdiabetesops.com:8443/browse/' + ticketKey;
      try {
      var ticketSummary = jiraBody.fields.summary;
      var assignee = jiraBody.fields.assignee.displayName;
      var status = jiraBody.fields.status.name;

      res.send(url);
      res.send('Name: ' + ticketSummary);
      res.send('Assignee: ' + assignee);
      res.send('Status: ' + status);
    } catch(error) {
      res.send('Error displaying info for ' + ticketKey);
      res.send(error.stack);
    }
    });
  });
};