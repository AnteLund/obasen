// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic-material', 'starter.controllers'])

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
.service('compService', function(){
    var competitionId = "";

    var setCompetitionId = function(compId){
      competitionId = compId;
    }

    var getCompetitionId = function(){
      return competitionId;
    }
    return {
      setCompetitionId: setCompetitionId,
      getCompetitionId: getCompetitionId

    }  
})
.service('lastPassingService', function(){
    var lastPassingHashes = [];

    var addLastPassingsHashes = function(lastPassingHash){
        lastPassingHashes.push(lastPassingHash);
        console.log(lastPassingHash)
    }

    var getLastPassingsHashes = function(){

      return lastPassingHashes;
    }

    var getLastPassingsHashesByClassId = function(compId){
      for (var d = 0, len = lastPassingHashes.length; d <len; d+=1){
        if(lastPassingHashes[d].compId === compId) {
          return lastPassingHashes[d].hash
        }
      }
      return null;
    }

    var getLastPassingResultByCLassId = function(compId){
      for (var d = 0, len = lastPassingHashes.length; d <len; d+=1){
        if(lastPassingHashes[d].compId === compId) {
          return lastPassingHashes[d].result
        }
      }
    }

    return {
      addLastPassingsHashes: addLastPassingsHashes,
      getLastPassingsHashes: getLastPassingsHashes,
      getLastPassingsHashesByClassId: getLastPassingsHashesByClassId,
      getLastPassingResultByCLassId: getLastPassingResultByCLassId
    }
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

.controller("compController", function($filter, $scope,$http, $interval, compService, lastPassingService){
  //on select change
  $scope.onchange = function(){
    compService.setCompetitionId($scope.selectedComp)
    $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitioninfo&comp=" + $scope.selectedComp).
    success(function(data, status, headers, config) {
    $scope.information = data;
    }).
    error(function(data, status, headers, config) {
      $scope.information = data;
    })

    //getlasthash

    $http.get("http://liveresultat.orientering.se/api.php?method=getlastpassings&comp=" + $scope.selectedComp + "&last_hash=" + lastPassingService.getLastPassingsHashesByClassId($scope.selectedComp)).
    success(function(data, status, headers, config) {
      if(data.status === "OK"){
          lastPassingService.addLastPassingsHashes({compId: $scope.selectedComp, hash:data.hash, result: data.passings})
          $scope.lastpassing = data.passings;
      }
      else{
          $scope.lastpassing = lastPassingService.getLastPassingResultByCLassId($scope.selectedComp)
      }
    }).
    error(function(data, status, headers, config) {
    })
  }

  $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitions").
  success(function(data, status, headers, config) {
    $scope.competitions = data.competitions;
  }).
  error(function(data, status, headers, config) {
    $scope.competitions = data.competitions;
  })

})

.controller("singleClassController", function($scope,$http, compService){
  console.log("laddar klasser med compID" + compService.getCompetitionId())
      $http.get("http://liveresultat.orientering.se/api.php?method=getclasses&comp=" + compService.getCompetitionId()).
      success(function(data, status, headers, config) {
        $scope.klasser = data.classes;
      }).
      error(function(data, status, headers, config) {
      })
  $scope.onchange = function(){
    console.log(compService.getCompetitionId());
    console.log("http://liveresultat.orientering.se/api.php?comp=" + compService.getCompetitionId() + "&method=getclassresults&unformattedTimes=false&class=" + $scope.selectedItem);
    $http.get("http://liveresultat.orientering.se/api.php?comp=" + compService.getCompetitionId() + "&method=getclassresults&unformattedTimes=false&class=" + $scope.selectedItem).
    success(function(data){
      $scope.classname = data.className;
      $scope.allresults = data.results;
    })
  }
    $scope.loadclasses = function(){
      console.log("laddar klasser med compID" + compService.getCompetitionId())
      $http.get("http://liveresultat.orientering.se/api.php?method=getclasses&comp=" + compService.getCompetitionId()).
      success(function(data, status, headers, config) {
        $scope.klasser = data.classes;
      }).
      error(function(data, status, headers, config) {
      })
    }

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

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
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
      cache: false,
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
