(function( WeatherController, WeatherViewController, WeatherApiService, $){
  'use strict';
  var app = angular.module('WeatherApp', [])
    .constant({
      ApiUrl: "http://api.wunderground.com/api/[api-key]/conditions/q/[zipcode].json",
      ApiKey: "625172310aff38a6"
    })
    .controller({
      WeatherController: WeatherController
    })
    .directive({
      weatherView: function(){
        return {
          scope:{
            Temperature: "=temperature"
          },
          link: function(scope, attrs, element){

          },
          controller: WeatherViewController,
          bindToController: true,
          controllerAs: "ctrl",
          templateUrl: 'scripts/weather-view.tmpl.html'
        }
      }
    })
    .factory({
      WeatherLocation: WeatherLocationProvider
    })
    .service({
      ApiService: WeatherApiService
    });
})(window.WeatherController || {},
  window.WeatherViewController || {},
  window.WeatherApiService || {},
  jQuery);
