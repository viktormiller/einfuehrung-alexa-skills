'use strict';
module.change_code = 1;
var _ = require('lodash');

function LueckentextHelper (obj) {
  this.started = false;
  this.lueckentextIndex = 0;
  this.currentStep = 0;
  this.lueckentext = [
    {
      title: 'Eines Tages',
      template: 'Eines Tages ${verb_1} ${person_name} nach New York um ${substantiv} zu sehen.',
      steps: [
        {
          value: null,
          template_key: 'verb_1',
          prompt: 'ein Verb in Vergangenheitsform',
          help: 'Ein Verb ist ein Tuwort in Vergangenheitsform: aß, reiste, spielte. Wie lautet dein Verb in Vergangenheitsform?'
        },
        {
          value: null,
          template_key: 'person_name',
          prompt: 'einen Namen',
          help: 'Nenne mir einen beliebigen Namen. Wie lautet der Name?'
        },
        {
          value: null,
          template_key: 'substantiv',
          prompt: 'ein Substantiv',
          help: 'Ein Substantiv ist ein Wort, das einen Menschen, eine Sache, ein Tier oder Ähnliches bezeichnet: einen Polizisten, ein Ei oder einen Affen. Wie lautet dein Substantiv?',
        }
      ]
    }
  ];
  for (var prop in obj) this[prop] = obj[prop];
}

LueckentextHelper.prototype.completed = function() {
  return this.currentStep === (this.currentLueckentext().steps.length - 1);
};

LueckentextHelper.prototype.getPrompt = function() {
  return this.getStep().prompt;
};

LueckentextHelper.prototype.getStep = function() {
  return this.currentLueckentext().steps[this.currentStep];
};

LueckentextHelper.prototype.buildLueckentext = function() {
  var currentLueckentext = this.currentLueckentext();
  var templateValues = _.reduce(currentLueckentext.steps, function(accumulator, step) {
    accumulator[step.template_key] = step.value;
    return accumulator;
  }, {});
  var compiledTemplate = _.template(currentLueckentext.template);
  return compiledTemplate(templateValues);
};


LueckentextHelper.prototype.currentLueckentext = function() {
  return this.lueckentext[this.lueckentextIndex];
};

module.exports = LueckentextHelper;
