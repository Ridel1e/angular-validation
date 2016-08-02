# angular-validation

## Применение

### Вид конфигурационных файлов

Модуль использует 2 вида конфигурационных файлов:

1. Правила валидации элементов формы. 

Правила для каждого поля начинаются с создания свойства с именем элемента в html в объекте конфигурации. Свойство является массивом, 
которое содержит различные правила. Правила - объект, с некотороыми параметрами. Всего параметра может быть 4
- __name__ - имя валидатора 
- __data__ - вспомогательные данные для валидации (к примеру минимальная или максимальная длина строки)
- __async__ - параметр, имеющий значение true или false. Применяется для указания, является ли валидатор асинхронным.
-__bindWith__ - массив имен моделей элементов формы, с которыми связано правило (повторение пароля связано с полем пароль и т.п)

Пример:
```javascript
  [{
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
 }]
```

2. Сообщения ошибок для каждого элемента формы. 

Пример конфигурации:
```javascript
{
  login: {
    required: 'login is required',
    minlength: 'login must contains at least 5 symbols',
    userExist: 'user with this login is already exist'
  },
  passwordConfirmation: {
    confirmPassword: 'please, repeat your password'
  }
}
```

### Стандартные правила

Модуль включает в себя основные реализованные правила для валидации элемента формы:

- __required__
- __minlength__
- __maxlength__
- __min__
- __max__
- __pattern__

### Как использовать 

Для использования стандартных валидаторов достаточно создать конфигурационный файл для правил, вызвать директиву 
validation как атрибут в элементе формы и передать ей вашу схему конфигурации в атрибуте rules.

Пример:

__JS:__
```javascript
 angular
  .module('myApp')
  .controller('MainCtrl',['$scope', 'formValidator' function ($scope, formValidator) {
    var vm = this;

    // scheme
    vm.scheme = [{
       fieldName: 'login',
       rules: [{
         name: "required"
       }, {
         name: "minlength",
         data: 5
       }]
     }];

    $scope
     .$applyAsync(function () {
       formValidator.setFormValidation(vm.userForm, vm.scheme);
     })

    }]);
```

__HTML:__
```html
<body ng-app="myApp">
    <div ng-controller="MainCtrl as vm">
        <form action="" name="vm.userForm">
            <input type="text"
                   name="login"
                   ng-model="vm.user.login">
    <script src="../node_modules/angular/angular.min.js"></script>
    <script src="../dist/bundle.js"></script>
    <script src="./main.js"></script>
</body>
```

### Добавление сообщений об ошибках

для добавления сообщений ошибок валидаций необходимо создать конфигурационный файл для сообщений и добавить в html директиву 
<error-messages> с двумя параметрами:
- __for__ модель (в примере выше это будет vm.userForm.login) 
- __messages__ - объект из конфигурации сообщений конкретного поля

Пример выше с сообщениями валидации:

__JS:__
```javascript
 angular
  .module('myApp')
  .controller('MainCtrl',['$scope', 'formValidator' function ($scope, formValidator) {
    var vm = this;

    // scheme
    vm.scheme = [{
       fieldName: 'login',
       rules: [{
         name: "required"
       }, {
         name: "minlength",
         data: 5
       }]
     }];

     vm.messages = {
         login: {
           required: 'login is required',
           minlength: 'login must contains at least 5 symbols',
           userExist: 'user with this login is already exist'
         }
     }

    $scope
     .$applyAsync(function () {
       formValidator.setFormValidation(vm.userForm, vm.scheme);
     })
    }]);
```


__HTML:__
```html
<body ng-app="myApp">
    <div ng-controller="MainCtrl as vm">
        <form action="" name="vm.userForm">
            <input type="text"
                   name="login"
                   ng-model="vm.user.login">
             <error-messages for="vm.userForm.login" messages="vm.messages.login"></error-messages>
    <script src="../node_modules/angular/angular.min.js"></script>
    <script src="../dist/bundle.js"></script>
    <script src="./main.js"></script>
</body>
```

### validatorService

validatorService предназначен для добавления пользовательских валидаторов. 

validatorService имеет методы:

- __addValidator("validatorName", callback)__ - добавление обычного валидатора
- __addAsyncValidator("validatorName", callback)__ - добавление асихронного валидатора

добавим пользовательский валидатор проверки числа на целостность

__JS:__
```javascript
 angular
  .module('myApp')
  .controller('MainCtrl', ['$scope', ''formValidator', function ($scope, formValidator) {
    var vm = this;

    // добавляем правило integer для поля age
    vm.scheme = [{
      fieldName: 'login',
      rules: [{
        name: "required"
      }, {
        name: "minlength",
        data: 5
      }]
    }, {
      fieldName: 'age',
      rules: [{
        name: 'integer'
      }]
    }];
  
  validatorService
    .addValidator('integer', function (age) {
      var ageRegEx = /^\d+$/
      
      return ageRegEx.test(age);
    });

  $scope
   .$applyAsync(function () {
     formValidator.setFormValidation(vm.userForm, vm.scheme);
   })

  });
```

Теперь мы можем использовать валидацию integer.

Теперь добавим асихнронный валидатор для проверки существования пользователя с таким логином. Для этого создадим тестовый сервис User 
с методом checkUserLogin, так как асинхронный валидатор должен возвращать promise

__JS:__
```javascript
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

 angular
  .module('myApp')
  .controller('MainCtrl', ['$scope', 'validatorService', 'User', function ($scope, formValidator, User) {
    var vm = this;

      // добавляем асинхронную валидацию userExist
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
      fieldName: 'age',
      rules: [{
        name: 'integer'
      }]
    }];

    validatorService
      .addValidator('integer', function (age) {
        var ageRegEx = /^\d+$/

        return ageRegEx.test(age);
      });

  // Асинхронный валидатор должен возвращать promise
      formValidator
        .addAsyncValidator('userExist', function (login) {
          return User.checkUserLogin(login);
      });

    $scope
     .$applyAsync(function () {
       formValidator.setFormValidation(vm.userForm, vm.scheme);
     })
  })
```

В html разметке ничего менять не нужно.

### Cвязывание полей.

Модуль может связывать любое количество полей (например для валидации вида проверки пароля)

Для этого в конфигурационном файле правил существует параметр __bindWith__ , который принимает массив моделей.

Валидатор подтверждения пароля:

__JS:__
```javascript
 angular
  .module('myApp')
  .controller('MainCtrl', '$scope', 'validatorService', 'User', function ($scope, formValidator, User) {
    var vm = this;

    // добавим правила для поля passwordConfirmation
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
  
  // Добавим пользовательский валидатор
  
    formValidator
      .addValidator('confirmPassword', function (passwordConfirmation, data, originalPassword) {
        return passwordConfirmation === originalPassword;
      });

      $scope
       .$applyAsync(function () {
         formValidator.setFormValidation(vm.userForm, vm.scheme);
       })
  };
```

__ВАЖНО__ Порядок параметров в калбэке создания пользвательского валидатора. 
```javascript
    formValidator
      .addValidator('confirmPassword', function (passwordConfirmation, data, originalPassword) {
        return passwordConfirmation === originalPassword;
      });
  };
```
Сначала идет значение основной модели __passwordConfirmation__, далее идет значение __data__ из конфигурации (даже если ее нет), 
далее значение связанных модели в порядке очередности массива (если был массив)
