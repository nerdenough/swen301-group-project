function DashboardController($state, $http, $cookies) {
  var vm = this;
  if ($cookies.token) {
    $http
      .post('/auth/validate', {token: $cookies.token})
      .then(function(response) {
        if (!response.data.success) {
          $state.go('login');
        }
      });
  } else {
    $state.go('login');
  }
}
