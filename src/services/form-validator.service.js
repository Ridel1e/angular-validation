/**
 * Created by ridel1e on 02/08/16.
 */

(function () {
  'use strict';
  
  angular
    .module('ngValidation')
    .service('formValidator', formValidator);

  formValidator
    .$inject = ['$q', '$rootScope'];

  function formValidator($q, $rootScope) {
    var validators, currentForm;

    validators = {
      required: function () {
        return function (modelValue, viewValue) {
          return !isEmpty(modelValue);
        }
      },

      minlength: createValidatorFunction(function (value, minLength) {
        return value.length >= minLength;
      }),

      maxlength: createValidatorFunction(function (value, maxLength) {
        return value.length <= maxLength;
      }),

      min: createValidatorFunction(function (value, minValue) {
        return +value >= minValue;
      }),

      max: createValidatorFunction(function (value, maxValue) {
        return +value <= maxValue;
      }),

      pattern: createValidatorFunction(function (value, pattern) {
        var regExp = new RegExp(pattern);

        return regExp.test(value);
      })
    };



    return {
      addAsyncValidator: addAsyncValidator,
      addValidator: addValidator,
      setFormValidation: setFormValidation
    };

    // public functions

    function addValidator(validatorName, callback) {
      if(!validators[validatorName]) {
        validators[validatorName] = createValidatorFunction(callback)
      } else {
        throw new Error('validator with this name already exists')
      }
    }

    function addAsyncValidator(validatorName, callback) {
      if(!validators[validatorName]) {
        validators[validatorName] = createValidatorFunction(callback, true)
      } else {
        throw new Error('validator with this name already exists')
      }
    }

    function setFormValidation(form, scheme) {
      currentForm = form;

      scheme.forEach(function (fieldScheme) {
        setFieldRules(form[fieldScheme.fieldName], fieldScheme.rules)
      });
    }

    // private functions

    function createValidatorFunction(callback, async) {
      return function (data, boundedModels) {

        return function (modelValue, viewValue) {
          var args, boundedModelsViewValues = [];

          if(boundedModels) {
            boundedModelsViewValues = getBoundedModelsViewValue(boundedModels);
          }

          args = Array.prototype.concat(viewValue, data, boundedModelsViewValues);
          // console.log(args);

          if(async) {
            return isEmpty(modelValue) ? $q.when() : callback.apply(null, args);
          } else {
            return isEmpty(modelValue) || callback.apply(null, args);
          }
        }
      }
    }

    function getBoundedModelsViewValue(boundedModels) {
      var boundedModelsViewValues = [];

      boundedModels.forEach(function (model) {
        boundedModelsViewValues.push(model.$viewValue);
      });

      return boundedModelsViewValues;
    }

    function setFieldRules(model, rules) {
      rules.forEach(function (rule) {
        var boundedModels;
        if(rule.bindWith) {
          boundedModels =  getBoundedModels(rule.bindWith);
        }

        if(rule.async) {
          model.$asyncValidators[rule.name] = validators[rule.name](rule.data, boundedModels);
        } else {
          model.$validators[rule.name] = validators[rule.name](rule.data, boundedModels);
        }

        if(boundedModels) {
          boundedModels.forEach(function (boundedModel) {
            addWatcher(boundedModel, model);
          })
        }

      })
    }

    function getBoundedModels(boundedModelNames) {
      var boundedModels = [];

      boundedModelNames.forEach(function (boundedModelName) {
        boundedModels.push(currentForm[boundedModelName]);
      });

      return boundedModels
    }

    function addWatcher(boundedModel, mainModel) {
      $rootScope
        .$watch(function () {
          return boundedModel.$viewValue
        }, function () {
          mainModel.$validate();
        })
    }

    function isEmpty(value) {
      return value === undefined || value === '' || value === null || value !== value;
    }
  }
})();