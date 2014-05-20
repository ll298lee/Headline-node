var app = angular.module("admin_rss", []);

app.controller('mainCtrl', ['$rootScope', '$scope', 
    function ($rootScope, $scope){
      $scope.searchKey = '';
      $scope.searchFields = ['name', 'press_code', 'rss_code', 'region'];
      $scope.currentSearchField = $scope.searchFields[0];
      $scope.selectSearchField = function(index){
        $scope.currentSearchField = $scope.searchFields[index];
        $scope.searchKey = '';
      }
}]);

app.controller('createNewModalCtrl', ['$scope', 
  function ($scope){
    $scope.clearForm = function(){
      $scope.pressCode = "";
      $scope.rssName = "";
      $scope.rssUrl = "";
    }

    $scope.create = function(){
      console.log("create the shit")
    }
    
}]);




app.directive("modalTrigger", [function(){
  return {
   restrict: "A",
   link: function(scope, el, attrs){
      el.bind('click', function() {
        $(attrs.modalTrigger).one('shown.bs.modal', function(){
          var modalScope = $(attrs.modalTrigger).scope();
          modalScope.$apply(function () {
              modalScope.clearForm();
          });
        }).modal({show:true});
      });
     }
  };
}]);