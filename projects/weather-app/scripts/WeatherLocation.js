(function(){
  'use strict';
  class WeatherLocationProvider{
    constructor(){
      return WeatherLocation;
    }
  }
  class WeatherLocation{
      constructor(data){
        this.IconUrl = "http://icons.wxug.com/i/c/i/[icon].gif";
        this.Temperature = "";
        this.Status = "";
        this.Icon = "";
        this.Location = "";
        this.Error = "";
        if(!data){
          return;
        }
        this.ProcessData(data);
      }
      ProcessData(data){
        if(data.temp_f !== undefined){
          this.Temperature = (Math.round(data.temp_f * 10) / 10);
        }
        if(data.weather !== undefined){
          this.Status = data.weather;
        }
        if(data.icon !== undefined){
          this.Icon = this.IconUrl.replace("[icon]", data.icon)
        }
        if(data.display_location !== undefined && data.display_location.full !== undefined){
          this.Location = data.display_location.full;
        }
      }
      SetError(message){
        this.Temperature = null;
        this.Error = message;
      }
  }
  window.WeatherLocationProvider = WeatherLocationProvider;
})();
