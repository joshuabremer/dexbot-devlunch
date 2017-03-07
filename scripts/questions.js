var natural = require('natural'),
    TfIdf = natural.TfIdf;

var loadIndex = function() {
  var indexString = robot.brain.get("documentIndex");
    if (indexString) {
      var tfidf = new TfIdf(JSON.parse(indexString));
    } else {
      var tfidf = new TfIdf();
    }
  tfidf
}

module.exports = function(robot) {
  robot.hear(/(.*)/, function(res) {
    var message = res.match[1];

    var tfidf = loadIndex();
    tfidf.addDocument(message);
    var documentId = tfidf.documents.length;
    robot.brain.set("document-"+documentId, message);
    robot.brain.set("documentIndex", JSON.stringify(tfidf));
  });

  robot.respond(/(.*)?/i, function(res) {
    var question = res.match[1]
    res.send("You asked a question: " + question)
    var tfidf = loadIndex()

    var best = "Not found"
    var bestScore = 0
    tfidf.tfidfs(question, function(i, measure) {
      if (bestScore < measure) {
        bestScore = measure
        best = robot.brain.get("document-"+i)
      }
    });
    robot.send("The closest match is: "+best)
  });

}
