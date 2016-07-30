/**
 * Created by ridel1e on 30/07/16.
 */

angular
  .module('ngValidation')
  .directive('errorMessages', errorMessages);

function errorMessages() {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl:"../src/error-messages/error-messages.html",
    controller: 'ErrorMessagesController',
    controllerAs: 'vm',
    bindToController: {
      for: '=',
      messages: '='
    }
  }
}