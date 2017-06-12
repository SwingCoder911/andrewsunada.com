(function(){
    "use strict";
    var app = angular.module("VoterApp", ["ngRoute"]);
    app.config(function($routeProvider, $locationProvider){
        $routeProvider.when('/competition-list', {
            templateUrl: "scripts/competition-list.tmpl.html",
            controller: "CompetitionListController",
            controllerAs: "compController"
        })
        .when('/competition/:id', {
            templateUrl: "scripts/competition.tmpl.html",
            controller: "CompetitionController",
            controllerAs: "competitionController"
        })
        .when('/admin',{
            templateUrl: "scripts/main-competition.tmpl.html",
            controller: "MainCompetitionController",
            controllerAs: "competitionController",
            resolve: {
                MainCompetition: ['DataService', function(DataService){
                    return DataService.GetCurrentCompetition();
                }]
            }
        })
        .when('/login', {
            templateUrl: "scripts/login.tmpl.html",
            controller: "LoginController",
            controllerAs: "loginController"
        })
        .when('/scoreboard', {
            templateUrl: "scripts/scoreboard.tmpl.html",
            controller: "ScoreboardController",
            controllerAs: "scoreboardController"
        })
        .when('/thankyou', {
            templateUrl: "scripts/thank-you.tmpl.html"
        })
        .when('/alreadyvoted', {
            templateUrl: "scripts/already-voted.tmpl.html"
        })
        .when('/unavailable', {
            templateUrl: "scripts/unavailable.tmpl.html"
        })
        .when('/', {
            templateUrl: "scripts/voter.tmpl.html",
            controller: "VoterController",
            controllerAs: "voterController"
        });
    });
    app.factory('Couple', ['$location', 'DataService', function($location, DataService){
        let Couple = function(data){
            this.Id = parseInt(data.id);
            this.Partner1 = data.partner1;
            this.Partner2 = data.partner2;
        };
        return Couple;
    }]);
    app.factory('Competition', ['$location', 'DataService', 'Couple', function($location, DataService, Couple){
        let Competition = function(data){
            let self = this;
            this.Name = data.name;
            this.Id = parseInt(data.id);
            this.IsCurrent = data.isCurrent == "1";
            this.IsClosed = data.isClosed == "1";
            this.Couples = [];

            this.loadCouples = function(couples){
                couples.forEach(function(item){
                    self.Couples.push(new Couple(item));
                });
            };

            this.Edit = function(){
                $location.path('/competition/' + this.Id);
            };
            this.Delete = function(){
                let promise = DataService.RemoveComp({Id: this.Id});
                promise.done(function(){
                });
            };
            this.loadCouples(data.couples);
        };
        return Competition;
    }]);
    app.filter('coupleListFilter', function(){
        return function(list, value1, value2){
            list = list.filter((item) => {
                return (item.Id != value1 && item.Id != value2);
            });
            return list;
        }
    });

})();
