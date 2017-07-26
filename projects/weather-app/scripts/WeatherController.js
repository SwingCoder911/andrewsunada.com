(function(){
  'use strict';
  class WeatherController{
    constructor($scope, WeatherLocation, ApiService){
      this.TemperatureDifference = "";
      this.WeatherATemp = null;
      this.WeatherBTemp = null;
      $scope.$watch(() => this.WeatherATemp, () => {this.updateTempDiff()});
      $scope.$watch(() => this.WeatherBTemp, () => {this.updateTempDiff()});
    }
    updateTempDiff(){
      if(this.WeatherATemp === "" || this.WeatherBTemp === ""
      ||this.WeatherATemp === null || this.WeatherBTemp === null){
        return;
      }
      let difference = Math.abs(Math.round((this.WeatherATemp - this.WeatherBTemp) * 10) / 10);
      this.TemperatureDifference = isNaN(difference) ?  "" : difference;
    };
  }
  WeatherController.$inject = ['$scope', 'WeatherLocation', 'ApiService'];
  window.WeatherController = WeatherController;
})();
