"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var skillService = new Skill.app("lueckentextbuilder");
var LueckentextHelper = require("./lueckentext_helper");
var LUECKENTEXT_BUILDER_SESSION_KEY = "lueckentext_builder";
var getLueckentextHelper = function(request) {
  var lueckentextHelperData = request.session(LUECKENTEXT_BUILDER_SESSION_KEY);
  if (lueckentextHelperData === undefined) {
    lueckentextHelperData = {};
  }
  return new LueckentextHelper(lueckentextHelperData);
};
var cancelIntentFunction = function(request, response) {
  response.say("Auf Wiedersehen!").shouldEndSession(true);
};

skillService.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skillService.intent("AMAZON.StopIntent", {}, cancelIntentFunction);

skillService.launch(function(request, response) {
  var prompt = "Willkommen zu Lückentext. "
    + "Um einen neuen Lückentext zu erstellen, sage erstelle einen Lückentext. ";
  response.say(prompt).shouldEndSession(false);
});

skillService.intent("AMAZON.HelpIntent", {},
  function(request, response) {
    var lueckentextHelper = getLueckentextHelper(request);
    var help = "Willkommen zu Lückentext. "
      + "Um einen neuen Lückentext zu erstellen, sage erstelle einen Lückentext. "
      + "Du kannst auch stopp oder abbrechen sagen um den Skill zu beenden.";
    if (lueckentextHelper.started) {
      help = lueckentextHelper.getStep().help;
    }
    response.say(help).shouldEndSession(false);
  });

skillService.intent("lueckentextIntent", {
  "slots": {
    "STEPVALUE": "STEPVALUES"
  },
  "utterances": ["{neuer|starte|erstelle|beginne|baue} {|einen|den} Lückentext", "{-|STEPVALUE}"]
},
  function(request, response) {
    var stepValue = request.slot("STEPVALUE");
    var lueckentextHelper = getLueckentextHelper(request);
    lueckentextHelper.started = true;
    if (stepValue !== undefined) {
      lueckentextHelper.getStep().value = stepValue;
    }
    if (lueckentextHelper.completed()) {
      var completedLueckentext = lueckentextHelper.buildLueckentext();
      response.card(lueckentextHelper.currentLueckentext().title, completedLueckentext);
      response.say("Der Lückentext ist fertig! Ich lese ihn dir jetzt vor. " + completedLueckentext);
      response.shouldEndSession(true);
    } else {
      if (stepValue !== undefined) {
        lueckentextHelper.currentStep++;
      }
      response.say("Nenne mir " + lueckentextHelper.getPrompt());
      response.reprompt("Ich habe leider nichts gehört. Nenne mir " + lueckentextHelper.getPrompt() + " um fortzufahren.");
      response.shouldEndSession(false);
    }
    response.session(LUECKENTEXT_BUILDER_SESSION_KEY, lueckentextHelper);
  }
);
module.exports = skillService;
