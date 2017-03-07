var Helper = require('hubot-test-helper');
var helper = new Helper(('../scripts/trimet.js'));
var expect = require('chai').expect;

var room;

describe('trimet bot', function() {
  beforeEach(function() {
    room = helper.createRoom();
  });

  afterEach(function() {
    room.destroy();
  });

  it('should give a basic response', function(done) {
     room.user.say('peter', 'hubot trimet').then(function() {
      expect(room.messages).to.eql([
        ['peter', 'hubot trimet'],
        ['hubot', '@peter this is a trimet message']
      ]);
      done();
    });

  });

})

