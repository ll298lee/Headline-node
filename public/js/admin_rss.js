var app = angular.module("admin_rss", []);


app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('handleEmit', function(event, args) {
        $rootScope.$broadcast('handleBroadcast', args);
    });
}]);


app.controller('mainCtrl', ['$rootScope', '$scope', '$http',
    function ($rootScope, $scope, $http){
      $scope.searchKey = '';
      $scope.searchFields = ['press_code', 'name', 'rss_code'];
      $scope.currentSearchField = $scope.searchFields[0];
      $scope.selectSearchField = function(index){
        $scope.currentSearchField = $scope.searchFields[index];
        $scope.searchKey = '';
      }

      $scope.rssList = [];

      $scope.query = function(){
        var params = {};
        if($scope.searchKey){
          params[$scope.currentSearchField] = $scope.searchKey; 
        }

        $http({
          url: "/api/rss_source", 
          method: "GET",
          params: params
        }).
        success(function(data, status, headers, config) {
          console.log(data);
          $scope.rssList = data;
          
        }).
        error(function(data, status, headers, config) {
          console.log(data);
        });
      };

      $scope.$on('handleBroadcast', function(event, args) {
        if(args.refresh){
          $scope.query();  
        }
      });    

      $scope.query();

}]);


app.controller('createNewModalCtrl', ['$scope', '$http', '$window',
  function ($scope, $http, $window){
    $scope.clearForm = function(){
      $scope.pressCode = "";
      $scope.rssName = "";
      $scope.rssUrl = "";
      $scope.rssCode = "";
    };

    $scope.create = function(){
      console.log("create the shit")
      $http.post("/api/rss_source", { 
        'press_code' : $scope.pressCode,
        'rss_name': $scope.rssName,
        'rss_url': $scope.rssUrl,
        'rss_code': $scope.rssCode
      }).
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.$emit('handleEmit', {refresh: true});
        $window.alert(data.message);
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
    }
}]);

app.controller('detailModalCtrl', ['$scope', '$http', '$window',
  function ($scope, $http, $window){
    $scope.initForm = function(rss){
      $scope.pressCode = rss.press_code;
      $scope.rssName = rss.name;
      $scope.rssUrl = rss.url;
      $scope.rssCode = rss.rss_code;
      $scope.rssId = rss.id;
    };

    $scope.deleteModel = function(){
      console.log("create the shit")
      $http.delete("/api/rss_source/"+$scope.rssId, { 
        'id' : $scope.objId,
      }).
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.$emit('handleEmit', {refresh: true});
        $window.alert(data.message);
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
    }

    $scope.update = function(){
      console.log("update")
      var params = {};
      if($scope.pressCode){
        params.press_code = $scope.pressCode;
      }
      if($scope.rssName){
        params.rss_name = $scope.rssName;
      }
      if($scope.rssUrl){
        params.rss_url = $scope.rssUrl;
      }
      if($scope.rssCode){
        params.rss_code = $scope.rssCode;
      }

      $http.post("/api/rss_source/" + $scope.rssId, params).
      success(function(data, status, headers, config) {
        console.log(data);
        $scope.$emit('handleEmit', {refresh: true});
        $window.alert(data.message);
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
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
            if(attrs.modalTrigger == '#createNewModal'){
              modalScope.clearForm();  
            }else if(attrs.modalTrigger == '#detailModal'){
              modalScope.initForm(scope.rss);  
            }
              
          });
        }).modal({show:true});
      });
     }
  };
}]);