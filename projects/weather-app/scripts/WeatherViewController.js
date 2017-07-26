(function(){
  'use strict';
  class WeatherViewController{
    constructor($scope, WeatherLocation, ApiService){
      this.WeatherLocationProvider = WeatherLocation;
      this.$scope = $scope;
      this.Weather = new this.WeatherLocationProvider();
      this.ApiService = ApiService;
      this.ZipCode = "";
      this.EditMode = true;
      this.Loading = false;
    }
    UpdateZipcode(form){
      if(!form.$valid){
        return;
      }
      let promise = this.ApiService.GetWeatherForZip(form.zip.$viewValue);
      this.Loading = true;
      promise.then((data) => {
        this.Loading = false;
        this.Weather = new this.WeatherLocationProvider(data);
        this.$scope.$apply();
      },
      (response) => {
        this.Loading = false;
        this.Weather = new this.WeatherLocationProvider();
        this.Weather.SetError(response.description);
        this.$scope.$apply();
      });
      this.EditMode = false;
      this.$scope.$watch(() => this.Weather, () => {
        this.Temperature = this.Weather.Temperature;
      });
    };
    ToggleEditMode(){
      this.EditMode = !this.EditMode;
    }
  }
  WeatherViewController.$inject = ['$scope', 'WeatherLocation', 'ApiService'];
  window.WeatherViewController = WeatherViewController;
})();
