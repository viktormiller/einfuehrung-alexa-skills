var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('hello_world');
app.id = require('./package.json').alexa.applicationId;

app.launch(function(req, res) {
  var prompt = 'Nenne mir deinen Namen und dein Alter.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('NameIntent', {
  "slots": { "NAME": "AMAZON.DE_FIRST_NAME", "AGE": "AMAZON.NUMBER" },
  "utterances": ["{Mein Name lautet|Mein Name ist|Ich heiße} {NAME} und ich bin {AGE}{ Jahre alt|}"]
}, function(req, res) {
  res.say('Dein Name ist ' + req.slot('NAME') + ' und du bist ' + req.slot('AGE') + ' Jahre alt');
});

app.intent('AgeIntent', {
  "slots": { "AGE": "AMAZON.NUMBER" },
  "utterances": ["Ich bin {AGE}{ Jahre alt|}"]
}, function(req, res) {
  res.say('Du bist ' + req.slot('AGE') + ' Jahre alt.');
})

module.exports = app;
