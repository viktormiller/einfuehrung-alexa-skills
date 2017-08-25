"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var skillService = new Skill.app("mathequiz");
var MathequizHelper = require("./mathequiz_helper");
var MATHEQUIZ_BUILDER_SESSION_KEY = "mathequiz_builder";

var globalCorrect = 0;
var globalTotal = 0;

var getMathequizHelper = function(request) {
  var mathequizHelperData = request.session(MATHEQUIZ_BUILDER_SESSION_KEY);
  if (mathequizHelperData === undefined) {
    mathequizHelperData = {};
  }
  return new MathequizHelper(mathequizHelperData);
};

/* Cancel Method*/
var cancelIntentFunction = function(request, response) {
  // Add result here.

  // Call this when user stops the skill
  response.say("Du hast "+globalCorrect+" von "+globalTotal+" Aufgaben gelöst. Bis bald!").shouldEndSession(true);
};
/* End Cancel Method*/

skillService.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skillService.intent("AMAZON.StopIntent", {}, cancelIntentFunction);

/* LaunchRequest */
skillService.launch(function(request, response) {
  var globalCorrect = 0;
  var globalTotal = 0;
  var prompt = "Willkommen zum Mathequiz, "
    + "um zu beginnen, sage los.";
  response.say(prompt).shouldEndSession(false);
});
/* End LaunchRequest */

/* Help Intent */
skillService.intent("AMAZON.HelpIntent", {},
  function(request, response) {
    var mathequizHelper = getMathequizHelper(request);
    var help = "Willkommen zum Mathequiz."
      + "um zu beginnen, sage los "
      + "Du kannst auch stop oder abbrechen sagen um den Skill zu beenden.";
    if (mathequizHelper.started) {
      help = mathequizHelper.getStep().help;
    }
    response.say(help).shouldEndSession(false);
  });
/* End Help Intent */

/* Main Intent */
skillService.intent("mathequizIntent", {
  "slots": {
    "STEPVALUE": "AMAZON.NUMBER"
  },
  "utterances": ["{neu|start|los|anfangen}", "{-|STEPVALUE}"]
},
  function(request, response) {
    var stepValue = request.slot("STEPVALUE");
    var mathequizHelper = getMathequizHelper(request);
    var correct = 0;
    var result;
    mathequizHelper.started = true;

    if (stepValue !== undefined) {
      mathequizHelper.getStep().value = stepValue;
      //check if respnse is correct
      result = mathequizHelper.getStep().result;
      if(result == stepValue){
        correct++;
        globalCorrect++;
        response.say(stepValue +" ist richtig.");
      }
      else{
        response.say(stepValue +' ist falsch. Die korrekte Lösung ist '+ result +' <break time="1s"/>.');
      }
    }
    if (mathequizHelper.completed()) {
      var completedMathequiz = mathequizHelper.buildMathequiz();
      response.card(mathequizHelper.currentMathequiz().title, completedMathequiz);
      mathequizHelper.currentStep++;
      globalTotal = mathequizHelper.currentStep;
      response.say("Das Mathequiz ist vorbei! Du hast "+correct+" von "+globalTotal+" Aufgaben gelöst." + completedMathequiz);
      response.shouldEndSession(true);
    } else {
      if (stepValue !== undefined) {
        mathequizHelper.currentStep++;
        globalTotal = mathequizHelper.currentStep;
      }
      response.say("Nenne mir das Ergebnis von " + mathequizHelper.getPrompt());
      response.reprompt("Ich habe leider nichts gehört. Nenne mir das Ergebnis von " + mathequizHelper.getPrompt() + " um fortzufahren.");
      response.shouldEndSession(false);
    }
    response.session(MATHEQUIZ_BUILDER_SESSION_KEY, mathequizHelper);
  }
);
/* End Main Intent */

module.exports = skillService;
