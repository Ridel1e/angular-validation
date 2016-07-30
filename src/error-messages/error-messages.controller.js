/**
 * Created by ridel1e on 30/07/16.
 */

(function () {
  'use strict';

  angular
    .module('ngValidation')
    .controller('ErrorMessagesController', ErrorMessagesController);

  function ErrorMessagesController() {
    var vm = this;

    vm.elementMessages = vm.messages[vm.for.$name];
    vm.validators = [];

    Object.keys(vm.for.$validators).forEach(function (validator) {
      vm.validators.push(validator);
    });
    Object.keys(vm.for.$asyncValidators).forEach(function (validator) {
      vm.validators.push(validator);
    });
  }
})();