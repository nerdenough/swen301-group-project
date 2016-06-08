app.controller('authCtrl', function($scope, $http) {
  $scope.login = function() {
    $http
      .post('/auth/login', $scope.user)
      .then(function(response) {
        console.log(response);
      });
  };

  $scope.register = register;
});

function login() {
  // TODO
}

function register() {
  // TODO
}
