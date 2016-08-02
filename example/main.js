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
    .controller('MainCtrl', ['formValidator', 'User', '$scope', function (formValidator, User, $scope) {
      var vm = this;

      // validation scheme
      vm.scheme = [{
        fieldName: 'login',
        rules: [{
          name: "required"
        }, {
          name: "minlength",
          data: 5
        }, {
          name: "userExist",
          async: true
        }]
      }, {
        fieldName: 'passwordConfirmation',
        rules: [{
          name: 'passwordConfirmed',
          bindWith: [
            'password'
          ]
        }]
      }];

      // messages scheme
      vm.messages = {
        login: {
          required: 'login is required',
          minlength: 'login must contains at least 5 symbols',
          userExist: 'user with this login is already exist'
        },
        passwordConfirmation: {
          passwordConfirmed: 'please, repeat your password'
        }
      };

      // we add custom confirmPassword validation

      formValidator
        .addValidator('passwordConfirmed', function (passwordConfirmation, data, originalPassword) {
          return passwordConfirmation === originalPassword;
        });

      // custom async validator

      formValidator
        .addAsyncValidator('userExist', function (login) {
          return User.checkUserLogin(login);
        });

      // set validation to form

      $scope
        .$applyAsync(function () {
          formValidator.setFormValidation(vm.userForm, vm.scheme);
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