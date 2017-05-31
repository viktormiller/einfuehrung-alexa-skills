'use strict';
module.change_code = 1;
var _ = require('lodash');

function MathequizHelper (obj) {
  this.started = false;
  this.exerciseIndex = 0;
  this.currentStep = 0;
  this.exercise = [
    {
      title: 'Mathequiz',
      template: 'Auf Wiedersehen!',
      steps: [
        {
          value: null,
          template_key: 'exercise_1',
          prompt: '10+3',
          help: 'Wie lautet das Ergebnis von 10+3',
          result: '13'
        },
        {
          value: null,
          template_key: 'exercise_2',
          prompt: '5+7',
          help: 'Wie lautet das Ergebnis von 5+7',
          result: '12'
        },
        {
          value: null,
          template_key: 'exercise_3',
          prompt: '27+6',
          help: 'Wie lautet das Ergebnis von 27+6',
          result: '33'
        },
        {
          value: null,
          template_key: 'exercise_4',
          prompt: '17+8',
          help: 'Wie lautet das Ergebnis von 17+8',
          result: '25'
        }
      ]
    }
  ];
  for (var prop in obj) this[prop] = obj[prop];
}

MathequizHelper.prototype.completed = function() {
  return this.currentStep === (this.currentMathequiz().steps.length - 1);
};

MathequizHelper.prototype.getPrompt = function() {
  return this.getStep().prompt;
};

MathequizHelper.prototype.getStep = function() {
  return this.currentMathequiz().steps[this.currentStep];
};

MathequizHelper.prototype.buildMathequiz = function() {
  var currentMathequiz = this.currentMathequiz();
  var templateValues = _.reduce(currentMathequiz.steps, function(accumulator, step) {
    accumulator[step.template_key] = step.value;
    return accumulator;
  }, {});
  var compiledTemplate = _.template(currentMathequiz.template);
  return compiledTemplate(templateValues);
};


MathequizHelper.prototype.currentMathequiz = function() {
  return this.exercise[this.exerciseIndex];
};

module.exports = MathequizHelper;
