/**
 * Created by ridel1e on 30/07/16.
 */

/**
 * Created by ridel1e on 30/07/16.
 */

(function () {
  'use strict';

  angular
    .module('ngValidation')
    .directive('validation', validation);

  validation
    .$inject = ['validatorService'];

  function validation(validatorService) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        rules: '=',
        bindTo: '='
      },
      link: function (scope, element, attrs, ngModel) {
        if(scope.bindTo) {
          addWatchers();
        }

        scope.rules[ngModel.$name].forEach(function (rule) {
          if(rule.async) {
            ngModel.$asyncValidators[rule.name] = validatorService.getValidatorFunc(rule.name, rule.data, scope.bindTo);
          } else {
            ngModel.$validators[rule.name] = validatorService.getValidatorFunc(rule.name, rule.data, scope.bindTo);
          }
        });


        function addWatchers() {
          if(Array.isArray(scope.bindTo)) {
            scope.bindTo.forEach(function (model, index) {
              scope.$watch('bindTo['+ index +'].$viewValue', function (newValue) {
                ngModel.$validate();
              })
            })
          } else {
            scope.$watch("bindTo.$viewValue", function (newValue) {
              ngModel.$validate();
            })
          }
        }
      }

    }
  }
})();