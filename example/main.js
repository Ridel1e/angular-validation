/**
 * Created by ridel1e on 30/07/16.
 */

(function () {
  'use strict';
  
  // module
  angular
    .module('myApp',[
      'ngValidation'
    ]);

  angular
    .module('myApp')
    .controller('MainCtrl', ['validatorService', 'User', function (validatorService, User) {
      var vm = this;

      // rules scheme
      vm.rules = {
        login: [{
          name: "required"
        }, {
          name: "minlength",
          data: "5"
        }, {
          name: 'userExist',
          async: true
        }],
        confirmPassword: [{
          name: 'passwordConfirm'
        }]
      };

      // messages scheme
      vm.messages = {
        login: {
          required: 'login is required',
          minlength: 'login must contains at least 5 symbols',
          userExist: 'user with this login is already exist'
        },
        confirmPassword: {
          passwordConfirm: 'please, repeat your password'
        }
      };

      // we add custom confirmPassword validation

      validatorService
        .addValidatorFunc('passwordConfirm', function (passwordConfirmation, data, originalPassword) {
          return passwordConfirmation === originalPassword;
        });
      validatorService
        .addAsyncValidatorFunc('userExist', function (login) {
          return User.checkUserLogin(login);
        })

    }]);

  angular
    .module('myApp')
    .factory('User', ['$q', function ($q) {
      var User, users;

      users = [
        'Jimm123',
        'Jillian'
      ];

      User = function () {};


      User.checkUserLogin = function (login) {
        return $q(function (resolve, reject) {
          if(users.indexOf(login) === -1) {
            resolve();
          } else {
            reject();
          }
        })
      };

      return User;
    }])
})();