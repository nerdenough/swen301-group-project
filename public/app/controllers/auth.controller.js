function AuthController($state, $http, $cookies) {
  var vm = this;
  vm.user = {};
  vm.error = {};

  vm.login = function() {
    $http
      .post('/auth/login', vm.user.login)
      .then(vm.handle);
  };

  vm.register = function() {
    $http
      .post('/auth/register', vm.user.register)
      .then(vm.handle);
  };

  vm.handle = function(res) {
    if (res.data.success) {
      $cookies.token = res.data.token;
      $state.go('dashboard');
    } else {
      vm.error.login = res.data.error;
    }
  };
}
