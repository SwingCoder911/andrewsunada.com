(function(){
  'use strict';
  class WeatherApiService{
    constructor($http, ApiUrl, ApiKey){
      this.API = ApiUrl.replace("[api-key]", ApiKey);
      this.$http = $http;
    }
    Call(url, method){
      return this.$http({
        method: method,
        url: url
      });
    }
    GetWeatherForZip(zipcode){
      let weatherUrl = this.API.replace('[zipcode]', zipcode);
      return new Promise((resolve, reject) => {
        let caller = this.Call(weatherUrl, "GET");
        caller.then((apiResponse) => {
          if(apiResponse.data.current_observation !== undefined){
            resolve(apiResponse.data.current_observation);
          }else if(apiResponse.data.response.error !== undefined){
            reject(apiResponse.data.response.error);
          }
        },
        (response) => {
          reject(response);
        });
      });
    }
  }
  WeatherApiService.$inject = ['$http', 'ApiUrl', 'ApiKey'];
  window.WeatherApiService = WeatherApiService;
})();
