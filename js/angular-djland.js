

//app.module('episodeModule', [''])

djland.factory('apiService', function ($http, $location) {

      var API_URL_BASE = 'api'; // api.citr.ca when live

      return {

        getShowData: function (id) {
          return $http.get(API_URL_BASE + '/show?ID=' + id);
        },

        listActiveShows: function(){
          return $http.get(API_URL_BASE + '/shows');
        },

        getEpisodeData: function (id) {
          return $http.get(API_URL_BASE + '/episode?ID=' + id);
        },

        saveShowData: function (data) {
          return $http.post(API_URL_BASE + '/show/save.php', data);
        },

        saveEpisodeData: function (data) {
          return $http.post(API_URL_BASE + '/episode/save.php', data);
        },

        getPlaylists: function (limit,offset) {
          limit = limit || 100; offset = offset || 0;
          return $http.get(API_URL_BASE + '/playlists/mine.php');
        },

        getPlodcasts: function(limit,offset) {
          limit = limit || 100; offset = offset || 0;
          return $http.get(API_URL_BASE + '/playlists/plodcast.php');

        },

        getEveryonesPlaylists: function (limit,offset) {
          limit = limit || 100; offset = offset || 0;
          return $http.get(API_URL_BASE + '/playlists/all.php?LIMIT='+limit+'&offset='+offset);
        },

        getPlaylistData: function (id) {
          return $http.get(API_URL_BASE+ '/playlist?ID='+id);
        },

        getFullPlaylistData: function (id) {
          return $http.get(API_URL_BASE+ '/playlist/full.php?ID='+id);
        },

        getEpisodes: function () {
          return $http.get(API_URL_BASE + '/episodes/mine.php');
        },

        getSpecialBroadcasts: function () {
          return $http.get(API_URL_BASE + '/specialevents');
        },

        saveSpecialBroadcast: function (data) {
          return $http.post(API_URL_BASE + '/specialevents/save.php', data);
        },

        createSpecialBroadcast: function (data) {
          return $http.post(API_URL_BASE + '/specialevents/create.php', data);
        },

        getRecentSamPlays: function () {
          return $http.get(API_URL_BASE + '/sam/recent.php');
        },

        getSamFromRange: function(min, max) {
          return $http.post(API_URL_BASE + '/sam/range.php',angular.toJson({'min':min,'max':max}));

        },

        savePlaylist: function(data) {
          return $http.post(API_URL_BASE + '/playlist/save.php', data);
        },

        getNextShow: function(time){
          return $http.get(API_URL_BASE + '/schedule/nextshow.php?time='+time)
        },

        getAdsFromBlock: function(time){
          return $http.get(API_URL_BASE + '/ad/scheduled.php?timeblock='+time)
        },

        savePodcast: function(podcast){
          return $http.post(API_URL_BASE + '/episode/create.php')
        },

        getArchiverTime: function(){
          return $http.get('http://archive.citr.ca/time/')
        },


        createPodcastAudio: function(data){
          return $http.get(API_URL_BASE + '/podcasting/create_audio_file.php?start='+data.start+'&end='+data.end+'&show='+data.show)
        }


      };
    });

djland.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});

djland.controller('showCtrl', ['$scope','apiService','$location',function($scope, apiService, $location){

  $scope.dj_edit_fields_only = true;// TODO - if robin editing, set to false, migrate markup from php

  $scope.showData = {}; // <- gets all loaded from server
  $scope.formData = {}; // <- all private
  $scope.formData.show_id = $location.search().id;
  var editable_by_dj = [
    'name',
    'show_desc',
    'secondary_genre_tags',
    'alerts'
  ];

  apiService.getShowData($scope.formData.show_id)
      .then(function(response){
        $scope.showData = response.data;

        if($scope.dj_edit_fields_only){
          for(var i in editable_by_dj){

            Object.defineProperty(
                $scope.formData,editable_by_dj[i],
                { value:$scope.showData[editable_by_dj[i]],
                  enumerable:true,writable:true
                }
            )
          }

        } else {
          // Robin view formData gets everything in showData...
          // also load 'notes' field (sensitive data)
          // need to add that to private api, accessible only by Robin
        }

      });

  $scope.save = function(){
    $scope.message = 'saving...';

    apiService.saveShowData($scope.formData)
        .then(function(response){
          $scope.message = response.data.message;
        }).catch(function(response){
          console.error(response.data);
          $scope.message = 'sorry, saving did not work';
        });
  }



}]);




djland.controller('episodeSingle', ['$scope', '$location', 'apiService', function($scope, $location, apiService) {
// GET id FROM LOCATION BAR
  $scope.status = 'loading episode...';
  $scope.episodes = [];
  apiService.getEpisodeData($location.search().id)
      .then(function(response){
        $scope.episodes[0] = response.data;
        $scope.status = '';
      });


}]);




djland.controller('datepicker', ['$scope','$filter',function($scope, $filter) {


  $scope.today = function() {
    $scope.dt = new Date();
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.format = 'medium';

  $scope.date_change = function(){
    //  $scope.$parent.new_sb.start.updateTimeObjs();
    alert('hi');
  }

}]);

djland.filter('range', function($filter) {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<max; i++)
      input.push($filter('pad')(i,2));
    return input;
  };
});

djland.filter('rangeNoPad', function() {
  return function(input, min, max) {
    min = parseInt(min); //Make string input int
    max = parseInt(max);
    for (var i=min; i<max; i++)
      input.push(i);
    return input;
  };
});

djland.filter('pad', function () {
  return function (n, len) {
    var num = parseInt(n, 10);
    len = parseInt(len, 10);
    if (isNaN(num) || isNaN(len)) {
      return n;
    }
    num = ''+num;
    while (num.length < len) {
      num = '0'+num;
    }
    return num;
  };
});