(function(){
    var app = angular.module("VoterApp");
    app.controller('ScoreboardController', ['$location', 'DataService',  function($location, DataService){
        let init = function(){
            let promise = DataService.GetCompetitionPlacements();
            self.Loading = true;
            promise.done(function(placements){
                self.Placements = placements;
                self.Loading = false;
            });
        }, self = this;
        this.Loading = false;
        this.Placements = [];
        init();
    }]);
})();
