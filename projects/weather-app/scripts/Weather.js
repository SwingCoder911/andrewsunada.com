(function($){
  'use strict';
  /**
   * Set weather api url as angular constant
   * Consider 2 weather area containers (factories) => passed into directives
   * Each Weather area object knows its own stuff and the Weather
   * controller knows how the 2 objects interact with eachother
   *
   * Eventually I'll want to split this out into es6 Classes
   */
  var app = angular.module('WeatherApp', [])
    .constant({
      ApiUrl: "http://api.wunderground.com/api/[api-key]/conditions/q/[zipcode].json",
      IconUrl: "http://icons.wxug.com/i/c/i/[icon].gif",
      ApiKey: "625172310aff38a6"
    })
    .controller({
      WeatherController: ['$scope', 'ApiService', 'WeatherLocation', function($scope, ApiService, WeatherLocation){
        let updateTempDiff = () => {
          if(this.WeatherATemp === null || this.WeatherATemp === null){
            return;
          }
          let difference = Math.abs(Math.round((this.WeatherATemp - this.WeatherBTemp) / 10) * 10);
          this.TemperatureDifference = isNaN(difference) ?  "" : difference;
        };
        this.TemperatureDifference = "";
        this.WeatherATemp = null;
        this.WeatherBTemp = null;
        this.IsWeatherDifferenceAvailable = () => {
          return this.WeatherATemp !== null && this.WeatherBTemp !== null;
        };
        $scope.$watch(() => this.WeatherATemp, updateTempDiff);
        $scope.$watch(() => this.WeatherBTemp, updateTempDiff);
      }]
    })
    .directive({
      weatherView: function(){
        return {
          scope:{
            Temperature: "=temperature"
          },
          link: function(scope, attrs, element){

          },
          controller: ['$scope', 'WeatherLocation', 'ApiService', function($scope, WeatherLocation, ApiService){
            this.Weather = new WeatherLocation();
            this.ZipCode = "";
            this.EditMode = true;
            this.Loading = false;
            this.UpdateZipcode = (zipcode) => {
              //Validate zipcode
              let promise = ApiService.GetWeatherForZip(zipcode);
              this.Loading = true;
              promise.then((data) => {
                this.Loading = false;
                this.Weather = new WeatherLocation(data);
                $scope.$apply();
              });
              this.EditMode = false;
              $scope.$watch(() => this.Weather, () => {
                this.Temperature = this.Weather.Temperature;
              });
            };
            this.ToggleEditMode = () => {
              this.EditMode = !this.EditMode;
            }
          }],
          bindToController: true,
          controllerAs: "ctrl",
          templateUrl: 'scripts/weather-view.tmpl.html'
        }
      }
    })
    .factory({
      WeatherLocation: ['IconUrl', function(IconUrl){
        return function(data){
          console.log(data);
          if(!data){
            return;
          }
          this.Temperature = (data.temp_f !== undefined) ? (Math.round(data.temp_f * 10) / 10) : "";
          this.Status = (data.weather !== undefined) ? data.weather: "";
          this.Icon = (data.icon !== undefined) ? IconUrl.replace("[icon]", data.icon): "";
          this.Location = "";
          if(data.display_location !== undefined && data.display_location.full !== undefined){
            this.Location = data.display_location.full;
          }
          console.log(this);
        };
      }]
    })
    .service({
      ApiService: ['$http', 'ApiUrl', 'ApiKey', function($http, ApiUrl, ApiKey){
        let call = function(url, method){
            return $http({
              method: method,
              url: url
            });
        };
        this.API = ApiUrl.replace("[api-key]", ApiKey);
        this.GetWeatherForZip = function(zipcode){
          let weatherUrl = this.API.replace('[zipcode]', zipcode);
          return new Promise((resolve, reject) => {
            let caller = call(weatherUrl, "GET");
            caller.then((response) => {
              resolve(response.data.current_observation);
            },
            (response) => {
              reject(response);
            });
          });
        };
      }]
    });
})(jQuery);
