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


.controller("startController", function($scope, $http, compService){
  $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitions").
  success(function(data, status, headers, config) {
    $scope.competitions = data.competitions;
  }).
  error(function(data, status, headers, config) {
    $scope.competitions = data.competitions;
  })
  $scope.onclick = function(comp){
    console.log(comp.id)
    compService.setCompetitionId(comp.id)

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
  $scope.showPassings = false

  $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitioninfo&comp=" + compService.getCompetitionId()).
  success(function(data, status, headers, config) {
  $scope.information = data;
  //Check if comp is more then 2 days old and hide last passings
  var d = new Date()
  d.setDate(d.getDate()-2)
  var todaysDate = $filter('date')(d, 'yyyy-MM-dd');
  if(data.date > todaysDate) $scope.showPassings = true
  console.log($scope.showPassings)
  }).
  error(function(data, status, headers, config) {
    $scope.information = data;
    
  })
  //compare date

  
  
    //getlasthash

    $http.get("http://liveresultat.orientering.se/api.php?method=getlastpassings&comp=" + compService.getCompetitionId() + "&last_hash=" + lastPassingService.getLastPassingsHashesByClassId($scope.selectedComp)).
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
  

  $http.get("http://liveresultat.orientering.se/api.php?method=getcompetitions").
  success(function(data, status, headers, config) {
    $scope.competitions = data.competitions;
  }).
  error(function(data, status, headers, config) {
    $scope.competitions = data.competitions;
  })

})

.controller("singleClassController", function($scope,$http, compService){
  var timeSecToMinute = function(millseconds){
      var seconds = millseconds/100
      var minutes = Math.floor(seconds/60)
      var restseconds = seconds%60;
      return minutes.toString() +":" + restseconds.toString();
  }
  $scope.showShortResult = true
  $scope.toggleSplitTimes = function(){
    if($scope.showSplitTimes === true){
      $scope.showShortResult = false
    }
    else if($scope.showSplitTimes === false){
      $scope.showShortResult = true
      
    }
    console.log($scope.showShortResult)
  }


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
      $scope.splitcontrols = data.splitcontrols;
      var splitTimes = data.splitcontrols;
      console.log(data.splitcontrols[0].code)
      for(var i = 0;i<data.results.length;i++){
       var fixedsplittimes = []
        for(x = 0; x<data.splitcontrols.length; x++){
          fixedsplittimes.push({'code': data.splitcontrols[x].code, 'time': timeSecToMinute(data.results[i].splits[data.splitcontrols[x].code]), 'place':data.results[i].splits[data.splitcontrols[x].code + "_place"]})
        }
        
        console.log(fixedsplittimes)
        data.results[i].splits = fixedsplittimes
      }
      console.log(timeSecToMinute(116000))
      console.log(data.results)
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

  .state('start', {
    url: '/start',
    controller: 'startController',
    templateUrl: 'templates/start.html'
  })

  .state('app.search', {
    url: "/search",
    cache:false,
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
  $urlRouterProvider.otherwise('/start');
});
