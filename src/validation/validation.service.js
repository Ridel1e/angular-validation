/**
 * Created by ridel1e on 30/07/16.
 */

(function () {
  'use strict';

  angular
    .module('ngValidation')
    .service('validatorService', validatorService);

  validatorService
    .$inject = ['$q'];

  function validatorService($q) {
    var functions = {
      required: function () {
        return function (modelValue, viewValue) {
          return !isEmpty(modelValue);
        };
      },
      minlength: function (minLength) {
        return function (modelValue, viewValue) {
          return isEmpty(modelValue) || viewValue.length >= minLength;
        };
      },
      maxlength: function (maxLength) {
        return function (modelValue, viewValue) {
          return isEmpty(modelValue) || viewValue.length <= maxLength;
        };
      },
      min: function (minValue) {
        return function (modelValue, viewValue) {
          return isEmpty(modelValue) || viewValue >= minValue;
        }
      },
      max: function(maxValue) {
        return function (modelValue, viewValue) {
          return isEmpty(modelValue) || viewValue <= maxValue
        }
      }

    };


    function isEmpty(value) {
      return value === undefined || value === '' || value === null || value !== value;
    }

    return {
      getValidatorFunc : function (type, data, additionalModels) {
        if(functions[type]) {
          return functions[type](data, additionalModels);
        } else {
          throw new Error(type + ' validator function is not defined');
        }

      },
      addAsyncValidatorFunc: function(type, callback) {
        if(!functions[type]) {
          functions[type] = function () {
            return function (modelValue, viewValue) {
              return isEmpty(modelValue) ? $q.when() : callback(viewValue);
            }
          }
        } else {
          throw new Error('this type of validator function already exists')
        }
      },
      addValidatorFunc: function (type, callback) {
        if(!functions[type]) {
          functions[type] = function (data, additionalModels) {
            return function (modelValue, viewValue) {
              var viewValues;

              if(Array.isArray(additionalModels)) {
                viewValues = [];

                additionalModels.forEach(function (model) {
                  viewValues.push(model.$viewValue);
                })
              } else {
                viewValues = additionalModels.$viewValue;
              }

              var args = Array.prototype.concat(viewValue, data, viewValues);
              console.log(args);

              return isEmpty(modelValue) || callback.apply(null, args);
            }
          }
        } else {
          throw new Error('this type of validator function already exists')
        }
      }
    }
  }
})();