// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.factory('CompetitionService',function($scope,$http){
    $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitioninfo&comp=10871").
  success(function(data, status, headers, config) {
    $scope.information = data;
    test += $scope.information.date;
  }).
  error(function(data, status, headers, config) {
    $scope.information = data;
  })
  return {CompetitionInformation: $scope.information }

})

.controller("clubController", function($scope, $http){
  $scope.onenter = function(){
    console.log($scope.searchedItem);
    $http.get("http://liveresultat.orientering.se/api.php?comp=10967&method=getclubresults&formatedTimes=true&club=" + $scope.searchedItem).
    success(function(data, status, headers, config) {
      $scope.clubName = data.clubName;
      $scope.runners = data.results;
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      $scope.information = data;
    }) 
  }
})

.controller("compController", function($scope,$http){
  $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitioninfo&comp=10871").
  success(function(data, status, headers, config) {
    $scope.information = data;
  }).
  error(function(data, status, headers, config) {
    $scope.information = data;
  })
  $http.get("http://liveresultat.orientering.se/api.php?method=getlastpassings&comp=10871").
  success(function(data, status, headers, config) {
    $scope.lastpassing = data.passings;
  }).
  error(function(data, status, headers, config) {
  })
})

.controller("singleClassController", function($scope,$http){
  $scope.onchange = function(){
    console.log($scope.selectedItem);
    console.log("http://liveresultat.orientering.se/api.php?comp=10259&method=getclassresults&unformattedTimes=true&class=" + $scope.selectedItem);
    $http.get("http://liveresultat.orientering.se/api.php?comp=10259&method=getclassresults&unformattedTimes=true&class=" + $scope.selectedItem ).
    success(function(data){
      $scope.classname = data.className;
      $scope.allresults = data.results;
    })
  }
  $http.get("http://liveresultat.orientering.se/api.php?method=getclasses&comp=10259").
  success(function(data, status, headers, config) {
    $scope.klasser = data.classes;
    console.log(data.classes);
  }).
  error(function(data, status, headers, config) {
  })
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
      }
    }
  })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/failedlink');
});
